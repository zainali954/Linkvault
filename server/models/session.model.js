import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
    default: "pending" 
  },
  userAgent: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true 
});

// Optional: Auto-delete expired sessions (MongoDB TTL Index)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//  Hash refresh token before save
sessionSchema.pre("save", async function (next) {
  if (this.isModified("refreshToken")) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 12);
  }
  next();
});

//  Method to compare raw token
sessionSchema.methods.compareToken = function (incomingToken) {
  return bcrypt.compare(incomingToken, this.refreshToken);
};

const Session = mongoose.model("Session", sessionSchema);
export default Session;
