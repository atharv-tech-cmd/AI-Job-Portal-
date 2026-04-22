import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constant';

export default function VerifyResetOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(90);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
        let timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [email, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/verify-reset-otp`, { email, otp }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || "OTP Verified");
                navigate('/reset-password', { state: { email, otp } }); 
            }
        } catch (error) {
            console.log("OTP verification error:", error);
            toast.error(error.response?.data?.message || "Invalid OTP or something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        try {
            await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            toast.success("OTP Resent!");
            setCountdown(90);
        } catch(e) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] transition-colors duration-200 p-4">
            <form onSubmit={submitHandler} className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="font-bold text-3xl mb-2 text-blue-600">Verify OTP</h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">Enter the 6-digit code sent to <span className="font-bold">{email}</span></p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-[var(--color-text-secondary)] font-medium mb-2 text-sm text-center">6-Digit Code</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} 
                           className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-center text-3xl tracking-[1em] font-mono" 
                           placeholder="------" maxLength="6" required />
                </div>
                
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 shadow-md transition disabled:opacity-50">
                    {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <div className="mt-4 text-center">
                    <button type="button" onClick={handleResend} disabled={countdown > 0} className={`text-sm font-semibold transition ${countdown > 0 ? 'text-[var(--color-text-secondary)] cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}`}>
                        {countdown > 0 ? `Resend code in ${countdown}s` : "Resend OTP"}
                    </button>
                </div>
            </form>
        </div>
    );
}
