import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from the signup redirect state, or default to empty
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Email is missing. Please sign up again.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/user/verify-email", { email, otp }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 bg-blue-600 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&fit=crop')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 w-full max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/20 shadow-2xl">
                        <span className="text-4xl">✉️</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
                        Verify your <br/>
                        <span className="text-blue-300">Email Address.</span>
                    </h1>
                    <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium">
                        We've sent a 6-digit verification code to your email. Enter it below to unlock your account and start your journey.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Verify Email</h2>
                        <p className="text-gray-500 font-medium">Enter the OTP sent to {email ? <span className="font-bold text-gray-800">{email}</span> : "your email"}</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Verification Code (OTP)</label>
                            <div className="relative">
                                <input 
                                    type={showOtp ? "text" : "password"} 
                                    name="otp" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    className="block w-full rounded-xl border border-gray-300 px-4 py-3.5 pr-12 text-gray-900 focus:border-blue-600 focus:ring-blue-600 focus:ring-1 outline-none transition shadow-sm bg-gray-50 text-center tracking-widest text-2xl font-mono" 
                                    placeholder="------" 
                                    maxLength="6"
                                    required 
                                />
                                <button type="button" onClick={() => setShowOtp(!showOtp)} className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700">
                                    {showOtp ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full rounded-xl bg-blue-600 px-4 py-4 text-md font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? "Verifying..." : "Verify Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
