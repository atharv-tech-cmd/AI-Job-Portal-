import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;
        
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email.", success: false });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and include an uppercase, lowercase, number, and special character.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 60 * 1000;

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            verificationOTP: otp,
            verificationOTPExpires: otpExpires,
            isVerified: false
        });
        const message = `Welcome to the Job Portal! Your Email Verification OTP is ${otp}. It is valid for 60 seconds.`;

        try {
            await sendEmail({
                email: newUser.email,
                subject: "Job Portal Email Verification OTP",
                message,
            });
        } catch (emailError) {
            console.log("Email sending failed:", emailError);
            // We can still proceed but user won't get email. Ideally, they can request a new OTP later.
        }

        return res.status(201).json({ message: "Account created successfully. Please check your email for the verification OTP.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email address before logging in.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = otp;
        user.verificationOTPExpires = Date.now() + 60 * 1000;
        await user.save();

        const message = `Your Login Verification OTP is ${otp}. It is valid for 60 seconds.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Job Portal Login Verification OTP",
                message,
            });
        } catch (emailError) {
            console.log("Email sending failed:", emailError);
            return res.status(500).json({ message: "Failed to send OTP email", success: false });
        }

        return res.status(200).json({
            message: `Login OTP sent to ${user.email}`,
            success: true,
            requires2FA: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, bio, skills } = req.body;
        const file = req.file;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        
        const userId = req.id; 
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        
        if (!user.profile) {
            user.profile = {};
        }

        if (fullname) user.fullname = fullname;
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "This email is already used by another account.", success: false });
            }
            user.email = email;
        }
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;

        if (file) {
            user.profile.resume = file.filename;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({ message: "Profile updated successfully.", user, success: true });
    } catch (error) {
        console.log("UPDATE PROFILE ERR:", error);
        return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
}


export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 60 * 1000;
        await user.save();
        const message = `Your Password Reset OTP is ${otp}. It is valid for 60 seconds.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Job Portal Password Reset OTP",
                message,
            });
            res.status(200).json({ message: `OTP sent to ${user.email}`, success: true });
        } catch (error) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.log(error);
            return res.status(500).json({ message: "Email sending failed", success: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        
        const user = await User.findOne({
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long and include an uppercase, lowercase, number, and special character.", success: false });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset completely successful", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required.", success: false });
        }
        
        const user = await User.findOne({
            email,
            verificationOTP: otp,
            verificationOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully. You can now login.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required.", success: false });
        }
        
        const user = await User.findOne({
            email,
            verificationOTP: otp,
            verificationOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired login OTP", success: false });
        }

        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpsOnly: true,
            sameSite: 'strict'
        }).json({
            message: `Welcome back ${user.fullname}!`,
            user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
