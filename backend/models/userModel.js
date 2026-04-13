import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['jobseeker', 'recruiter', 'admin'], required: true },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        profilePhoto: { type: String, default: "" }
    },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);
