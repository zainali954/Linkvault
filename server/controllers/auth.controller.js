import User from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "../validators/auth.validator.js";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import generateJWTs from "../utils/generateJWTs.js";
import { clearCookies, setCookies } from "../utils/cookiesManager.js";
import Session from "../models/session.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import getClientInfo from "../utils/getClientInfo.js";
import { sendForgotPasswordEmail, sendVerificationEmail, sendVerifiedSuccessEmail } from "../utils/sendEmails.js";

export const signup = asyncHandler(async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        throw new apiError(409, "An account with this email already exists. Please try logging in.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 12);

    const newUser = await User.create({
        name,
        email,
        password,
        verificationToken: hashedToken,
        verificationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    });

    const url = `${process.env.CLIENT_URL}/verify?email=${newUser.email}&token=${token}`
    await sendVerificationEmail(newUser.email, url)

    apiResponse.success(res, "Account created successfully", newUser.email, 200);
});

export const login = asyncHandler(async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }
    const { email, password } = req.body;

    const { userAgent, ipAddress } = getClientInfo(req)

    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(401, "Invalid email or password.");
    }

    // Blocked or Locked
    if (user.isBlocked || (user.lockUntil && user.lockUntil > new Date())) {
        throw new apiError(403, "Your account is temporarily locked. Please try again later.");
    }

    // Google login case
    if (!user.password && user.googleId) {
        throw new apiError(400, "This account uses Google login. Please sign in with Google.");
    }

    // Compare passwords
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
        user.failedAttempts += 1;
        user.lastFailedTime = new Date();

        if (user.failedAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
            await user.save();
            throw new apiError(403, "Too many failed login attempts. Your account is locked for 2 hours.");
        }

        await user.save();
        throw new apiError(401, "Invalid email or password.");
    }

    // Login success
    user.failedAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    const session = await Session.create({
        user: user._id,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    const { accessToken, refreshToken } = generateJWTs(user._id, session._id.toString())
    session.refreshToken = refreshToken;
    await session.save();

    setCookies(res, refreshToken, accessToken)

    apiResponse.success(res, "Login successful! Welcome back.", {  sessionId: session._id, user: userObj }, 200);
});

export const googleLogin = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) throw new apiError(400, "Authorization code missing");

    // Exchange code for tokens
    const { data } = await axios.post("https://oauth2.googleapis.com/token", null, {
        params: {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "http://localhost:5173/auth/google/callback",
            grant_type: "authorization_code",
        },
    });

    const { access_token } = data;

    // Get user info
    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const { email, name, picture, sub: googleId } = userInfo.data;

    let user = await User.findOne({ email }).select("-password");

    // If user exists, validate status
    if (user) {
        //  Blocked or Locked check
        if (user.isBlocked || (user.lockUntil && user.lockUntil > new Date())) {
            throw new apiError(403, "Your account is temporarily locked or blocked. Please try again later.");
        }

        //  Update existing user with latest Google info
        user.googleId = googleId;
        user.lastLogin = new Date();
        await user.save();
    } else {
        // New user creation
        user = await User.create({
            email,
            name,
            profilePic: picture,
            googleId,
            isVerified: true,
        });
    }

    // Get client info
    const { ipAddress, userAgent } = getClientInfo(req);

    // Create session
    const session = await Session.create({
        user: user._id,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    const { accessToken, refreshToken } = generateJWTs(user._id, session._id.toString());
    session.refreshToken = refreshToken;
    await session.save();

    setCookies(res, refreshToken, accessToken);

    apiResponse.success(res, "Login successful! Welcome back.", { accessToken, sessionId: session._id, user }, 200);
});


export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const session = await Session.findOne({
                _id: decoded.sessionId,
                user: decoded.id,
                isValid: true
            });

            if (session) {
                session.isValid = false;
                await session.save();
            }
        } catch (err) {
            console.log(err)
            // Do nothing — soft logout
        }
    }

    clearCookies(res);

    return apiResponse.success(res, "Logout successful.");
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { error } = verifyEmailSchema.validate(req.body)
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }
    const { email, token } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (user.isVerified) {
        return apiResponse.success(res, "This email is already verified.")
    }

    // Compare the provided token with the stored hashed token
    const compare = await bcrypt.compare(token, user.verificationToken);

    if (!compare) {
        throw new apiError(401, "Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined

    await user.save();

    await sendVerifiedSuccessEmail(user.email, `${process.env.CLIENT_URL}/home`)

    apiResponse.success(res, "Email verified successfully")
})
export const resendEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new apiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (user.isVerified) {
        return apiResponse.success(res, "This email is already verified.");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 12);

    user.verificationToken = hashedToken;
    user.verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await user.save();

    const url = `${process.env.CLIENT_URL}/verify?email=${user.email}&token=${token}`;
    await sendVerificationEmail(user.email, url)
    return apiResponse.success(res, "Verification email sent successfully.", user.email);
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { error } = forgotPasswordSchema.validate(req.body)
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(404, "No user found with that email");
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token and expiry on user
    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiresAt = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendForgotPasswordEmail(user.email, resetUrl)

    apiResponse.success(res, "Reset password link sent to email", null, 200);
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { error } = resetPasswordSchema.validate(req.body)
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const { password, token } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
        throw new apiError(400, "Token is invalid or expired");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();

    apiResponse.success(res, "Password has been reset successfully", null, 200);
});

export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken
    

    if (!refreshToken) {
        throw new apiError(401, "Refresh token missing")
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new apiError(401, "Invalid or expired refresh token")
    }

    const session = await Session.findOne({
        _id: decoded.sessionId,
        user: decoded.id,
        isValid: true
    })

    if (!session) {
        throw new apiError(401, "Session not found or already invalidated.");
    }
    // Rotate refresh token
    const { accessToken, refreshToken: newRefreshToken } = generateJWTs(decoded.id, session._id);

    // Update session
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // extend 30 days
    await session.save();

    // Set new cookies
    setCookies(res, newRefreshToken, accessToken);

    apiResponse.success(res, "Refreshed successfully", accessToken)
})

export const getSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const sessions = await Session.find({ user: userId }).select("-refreshToken").sort({ createdAt: -1 });
    apiResponse.success(res, "Fetched", sessions, 200)
})

export const deleteAllSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Session.deleteMany({ user: userId });
    clearCookies(res);
    apiResponse.success(res, "Logged out from all sessions", null, 200);
});

export const logoutOtherSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const currentSessionId = req.body.currentSessionId;
    if (!currentSessionId) {
        throw new apiError(400, "Current sessionId is required.")
    }

    // Invalidate all sessions except the current one
    await Session.updateMany(
        { user: userId, _id: { $ne: currentSessionId } }, // Exclude the current session
        { isValid: false }
    );

    apiResponse.success(res, "Logged out from other sessions", null, 200);
});

