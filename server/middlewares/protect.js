import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import apiError from "../utils/apiError.js";

const protect = asyncHandler(async (req, res, next) => {
  // ✅ Get accessToken from cookie instead of Authorization header
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new apiError(401, "Unauthorized. No access token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new apiError(401, 'Unauthorized. Token has expired.');
    } else if (err.name === 'JsonWebTokenError') {
      throw new apiError(401, 'Unauthorized. Invalid token.');
    } else {
      throw new apiError(401, 'Unauthorized. Authentication failed.');
    }
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new apiError(401, "User no longer exists.");
  }

  req.user = user;
  next();
});

export default protect;
