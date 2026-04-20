import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { PasswordPanel, isPasswordStrong } from './PasswordPanel';

import { USER_API_END_POINT } from '../utils/constant';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // We expect email and otp to be passed from the VerifyResetOtp step
    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const [input, setInput] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleGeneratePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let generatedPassword = "";
        
        // Ensure at least 1 of each required character type
        generatedPassword += "A"; // Uppercase
        generatedPassword += "B"; // Uppercase
        generatedPassword += "a"; // Lowercase
        generatedPassword += "b"; // Lowercase
        generatedPassword += "1"; // Number
        generatedPassword += "!"; // Special
        
        for (let i = 0, n = charset.length; i < length - 6; ++i) {
            generatedPassword += charset.charAt(Math.floor(Math.random() * n));
        }

        // Shuffle
        generatedPassword = generatedPassword.split('').sort(function(){return 0.5-Math.random()}).join('');
        
        setInput(prev => ({
            ...prev,
            newPassword: generatedPassword,
            confirmPassword: generatedPassword
        }));

        toast.success("Strong password generated and applied!", { icon: '🔑' });
    };

    const isMatch = input.newPassword === input.confirmPassword;
    const isStrong = isPasswordStrong(input.newPassword);
    const canSubmit = isStrong && isMatch;

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // If email or otp missing, it will likely fail on backend. 
        if (!email || !otp) {
            toast.error("Missing email or OTP verification verification data.");
            return;
        }

        setLoading(true);
        try {
            // Include otp here since backend usually requires it to finalize reset
            const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
                email,
                otp,
                newPassword: input.newPassword
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Password reset! Please log in.");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error resetting password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] transition-colors duration-200 p-4">
            <form onSubmit={submitHandler} className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl mb-2 text-green-600">New Password</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Create a new secure password</p>
                </div>
                
                <div className="flex justify-end mb-4">
                    <button type="button" onClick={handleGeneratePassword} className="text-sm font-semibold text-blue-600 hover:text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition flex items-center gap-1.5">
                        ✨ Generate Secure Password
                    </button>
                </div>
                
                <div className="mb-4">
                    <label className="block text-[var(--color-text-secondary)] font-medium mb-2 text-sm">New Password</label>
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="newPassword" value={input.newPassword} onChange={changeEventHandler} 
                               className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 pr-10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" 
                               placeholder="Enter new strong password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-secondary)] hover:text-gray-400">
                            👁️
                        </button>
                    </div>
                </div>
                
                <div className="mb-6">
                    <PasswordPanel password={input.newPassword} />
                </div>
                
                <div className="mb-6">
                    <label className="block text-[var(--color-text-secondary)] font-medium mb-2 text-sm">Confirm Password</label>
                    <div className="relative">
                        <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={input.confirmPassword} onChange={changeEventHandler} 
                               className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 pr-10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" 
                               placeholder="Confirm new password" required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-secondary)] hover:text-gray-400">
                            👁️
                        </button>
                    </div>
                </div>
                
                <button type="submit" disabled={!canSubmit || loading} className="w-full bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Resetting..." : "Set New Password"}
                </button>
            </form>
        </div>
    );
}
