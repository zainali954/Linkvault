import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        },
        minlength: 6,
    },
    googleId: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: "https://defaultprofilepic.com/default.png",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user", 
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiresAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpiresAt: {
        type: Date,
        default: null,
    },
    failedAttempts: {
        type: Number,
        default: 0, // Track failed login attempts
    },
    lastFailedTime: {
        type: Date,
        default: null, // Timestamp of the last failed login attempt
    },
    lockUntil: {
        type: Date,
        default: null, // Timestamp until the account is locked
    },
    lastLogin: {
        type: Date,
        default: null, 
    },
    isBlocked: {
        type: Boolean, default: false
    },

}, { timestamps: true })

// pre-save hook to hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

// method to compare password
userSchema.methods.comparePassword = function(givenPassword){
    return bcrypt.compare(givenPassword, this.password)
}


//method to reset failed attempts
userSchema.methods.resetFailedAttempts = function(){
    this.failedAttempts = 0;
    this.lockUntil = null;
    return this.save();
}

// method to lock account
userSchema.methods.lockAccount = function(duration){
    const lockUntil = new Date(Date.now() + duration) ;// in ms
    this.lockUntil = lockUntil;
    return this.save();
}
const userModel = mongoose.model("User", userSchema)
export default userModel;