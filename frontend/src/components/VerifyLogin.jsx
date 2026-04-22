import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constant';

export default function VerifyLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(90);

    useEffect(() => {
        if (!email) {
            navigate("/login");
            return;
        }
        let timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [email, navigate]);

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        try {
            // Re-use forgot password for resending login OTP (or dedicated)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }); 
            if (res.data.success) {
                toast.success("OTP Resent!");
                setCountdown(90);
            }
        } catch (error) {
            toast.error("Failed to resend OTP");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/verify-login`, { email, otp }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Logged in!");
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)] transition-colors duration-200 items-center justify-center p-4">
            <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto text-3xl">
                        🔐
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-[var(--color-text)]">Security Check</h2>
                    <p className="text-[var(--color-text-secondary)] font-medium">Enter the login OTP sent to <br/><span className="font-bold text-[var(--color-text)]">{email}</span></p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-[var(--color-text-secondary)] font-medium mb-3 text-sm text-center">Verification Code</label>
                        <div className="relative">
                            <input 
                                type={showOtp ? "text" : "password"} 
                                name="otp" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-4 pr-12 text-[var(--color-text)] text-center text-3xl font-mono tracking-[0.5em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner" 
                                placeholder="------" 
                                maxLength="6"
                                required 
                            />
                            <button type="button" onClick={() => setShowOtp(!showOtp)} className="absolute inset-y-0 right-4 flex items-center text-[var(--color-text-secondary)]">
                                👁️
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || otp.length !== 6} 
                        className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 shadow-md transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Login to Account"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={countdown > 0}
                                className={`font-bold transition ${
                                    countdown > 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-blue-600 hover:text-blue-800"
                                }`}
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
