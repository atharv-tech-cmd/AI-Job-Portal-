import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { USER_API_END_POINT } from '../utils/constant';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const isSubmitting = useRef(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        try {
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/verify-reset-otp', { state: { email } });
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to send OTP");
            isSubmitting.current = false;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] transition-colors duration-200 p-4">
            <form onSubmit={handleSubmit} className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl mb-2 text-blue-600">Forgot Password</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">We'll send a verification code to your email</p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-[var(--color-text-secondary)] font-medium mb-2 text-sm">Enter your Account Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                           className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" 
                           placeholder="account@gmail.com" required />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 shadow-md transition">
                    Send OTP to Email
                </button>
            </form>
        </div>
    );
}
