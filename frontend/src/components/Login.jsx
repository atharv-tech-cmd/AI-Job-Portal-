import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { PasswordPanel } from './PasswordPanel';

import { USER_API_END_POINT } from '../utils/constant';

export default function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "jobseeker"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Rate limiting state
    const [failCount, setFailCount] = useState(0);
    const [lockedUntil, setLockedUntil] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let interval;
        if (lockedUntil) {
            interval = setInterval(() => {
                const remaining = lockedUntil - Date.now();
                if (remaining <= 0) {
                    setLockedUntil(null);
                    setFailCount(0);
                    setTimeLeft(0);
                    clearInterval(interval);
                } else {
                    setTimeLeft(Math.ceil(remaining / 1000));
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [lockedUntil]);

    const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        if (isLocked) return;

        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                if (res.data.requires2FA) {
                    toast.success(res.data.message);
                    navigate("/verify-login", { state: { email: input.email } });
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login Failed");
            const newCount = failCount + 1;
            setFailCount(newCount);
            if (newCount >= 5) {
                setLockedUntil(Date.now() + 15 * 60 * 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] transition-colors duration-200 p-4">
            <div className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="font-extrabold text-3xl mb-2 text-[var(--color-text)]">
                        Welcome Back
                    </h1>
                    <p className="text-[var(--color-text-secondary)] font-medium">
                        Access your professional workspace
                    </p>
                </div>

                <form onSubmit={submitLogin} className="space-y-5">
                    <div>
                        <label className="block text-[var(--color-text-secondary)] font-medium mb-1.5 text-sm">Email Address</label>
                        <input type="email" name="email" value={input.email} onChange={changeEventHandler} 
                            className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text)] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner" 
                            placeholder="Enter your email" required />
                    </div>
                    
                    <div>
                        <label className="block text-[var(--color-text-secondary)] font-medium mb-1.5 text-sm">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" value={input.password} onChange={changeEventHandler} 
                                className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 pr-10 text-[var(--color-text)] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner" 
                                placeholder="••••••••" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-secondary)] hover:text-gray-400">
                                👁️
                            </button>
                        </div>
                        <PasswordPanel password={input.password} />
                    </div>
                    
                    <div className="pt-2">
                        <label className="block text-[var(--color-text-secondary)] font-medium mb-3 text-sm">Account Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition ${input.role === 'jobseeker' ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'border-[var(--color-border)] hover:border-gray-300 text-[var(--color-text-secondary)]'}`}>
                                <input type="radio" name="role" value="jobseeker" checked={input.role === 'jobseeker'} onChange={changeEventHandler} className="hidden"/>
                                <span className="font-semibold text-sm">Candidate</span>
                            </label>
                            <label className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition ${input.role === 'recruiter' ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'border-[var(--color-border)] hover:border-gray-300 text-[var(--color-text-secondary)]'}`}>
                                <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="hidden"/>
                                <span className="font-semibold text-sm">Recruiter</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-semibold transition">
                            Forgot Password?
                        </Link>
                        <Link to="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium transition">
                            Create account &rarr;
                        </Link>
                    </div>
                    
                    <button type="submit" disabled={loading || isLocked} className="w-full mt-4 bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLocked ? `Locked. Try again in ${~~(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}` : loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
