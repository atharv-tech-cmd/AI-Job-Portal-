import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "jobseeker"
    });
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOtpPassword, setShowOtpPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success && res.data.requires2FA) {
                toast.success(res.data.message);
                setShowOTP(true);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    const submitOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/user/verify-login", { email: input.email, otp }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                toast.success(res.data.message);
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
        <div className="flex items-center justify-center min-h-screen bg-[#030305] relative overflow-hidden p-4">
            {/* Background Details */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')" }}>
            </div>

            <div className="z-10 w-full max-w-md">
                <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <span className="text-3xl">{showOTP ? '✉️' : '🚀'}</span>
                        </div>
                        <h1 className="font-extrabold text-3xl mb-2 text-white">
                            {showOTP ? 'Security Verification' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-400 font-medium">
                            {showOTP ? `Enter the 6-digit code sent to ${input.email}` : 'Access your professional workspace'}
                        </p>
                    </div>

                    {!showOTP ? (
                        <form onSubmit={submitLogin} className="space-y-5">
                            <div>
                                <label className="block text-gray-300 font-medium mb-1.5 text-sm">Email Address</label>
                                <input type="email" name="email" value={input.email} onChange={changeEventHandler} 
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" 
                                    placeholder="Enter your email" required />
                            </div>
                            
                            <div>
                                <label className="block text-gray-300 font-medium mb-1.5 text-sm">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={input.password} onChange={changeEventHandler} 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" 
                                        placeholder="••••••••" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300">
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <label className="block text-gray-300 font-medium mb-3 text-sm">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition ${input.role === 'jobseeker' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                                        <input type="radio" name="role" value="jobseeker" checked={input.role === 'jobseeker'} onChange={changeEventHandler} className="hidden"/>
                                        <span className="font-semibold text-sm">Candidate</span>
                                    </label>
                                    <label className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition ${input.role === 'recruiter' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-white/10 hover:border-white/30 text-gray-400'}`}>
                                        <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="hidden"/>
                                        <span className="font-semibold text-sm">Recruiter</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6">
                                <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition">
                                    Forgot Password?
                                </Link>
                                <Link to="/" className="text-sm text-gray-400 hover:text-white font-medium transition">
                                    Create account &rarr;
                                </Link>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition duration-300 disabled:opacity-70">
                                {loading ? 'Authenticating...' : 'Secure Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={submitOTP} className="space-y-6">
                            <div>
                                <label className="block text-center text-gray-300 font-medium mb-3 text-sm">6-Digit OTP</label>
                                <div className="relative">
                                    <input type={showOtpPassword ? "text" : "password"} name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white text-center text-3xl font-mono tracking-[0.5em] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner" 
                                        placeholder="------" maxLength="6" required />
                                    <button type="button" onClick={() => setShowOtpPassword(!showOtpPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300">
                                        {showOtpPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition duration-300 disabled:opacity-70">
                                {loading ? 'Verifying...' : 'Complete Login'}
                            </button>

                            <button 
                                type="button" 
                                onClick={() => setShowOTP(false)} 
                                className="w-full text-sm text-gray-400 hover:text-white transition mt-2"
                            >
                                &larr; Back to login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
