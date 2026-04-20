import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [showOtpPassword, setShowOtpPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Email is missing. Please sign up again.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("https://ai-job-portal-glq9.onrender.com/api/v1/user/verify-email", { email, otp }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Email verified successfully!");
                const { accessToken, user } = res.data;
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    // Navigate to dashboard by role
                    navigate(user.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/jobseeker', { replace: true });
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)] transition-colors duration-200 flex-col md:flex-row p-4 md:p-0">
            <div className="hidden md:flex md:w-1/2 bg-blue-600 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&fit=crop')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 w-full max-w-lg mx-auto text-center">
                    <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/20 shadow-2xl mx-auto">
                        <span className="text-4xl text-black">✉️</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
                        Verify your <br/>
                        <span className="text-blue-300">Email Address.</span>
                    </h1>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[var(--color-bg)] text-[var(--color-text)]">
                <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Verify Email</h2>
                        <p className="text-[var(--color-text-secondary)] font-medium">Enter the OTP sent to <span className="font-bold text-[var(--color-text)]">{email || "your email"}</span></p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-[var(--color-text-secondary)] font-medium mb-3 text-sm text-center">Verification Code (OTP)</label>
                            <div className="relative">
                                <input 
                                    type={showOtpPassword ? "text" : "password"} 
                                    name="otp" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-4 pr-12 text-[var(--color-text)] text-center text-3xl font-mono tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner" 
                                    placeholder="------" 
                                    maxLength="6"
                                    required 
                                />
                                <button type="button" onClick={() => setShowOtpPassword(!showOtpPassword)} className="absolute inset-y-0 right-4 flex items-center text-[var(--color-text-secondary)] hover:text-gray-400">
                                    👁️
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || otp.length !== 6} 
                            className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
