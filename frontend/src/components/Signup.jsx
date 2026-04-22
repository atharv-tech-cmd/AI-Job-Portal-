import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { PasswordPanel, isPasswordStrong } from './PasswordPanel';

import { USER_API_END_POINT } from '../utils/constant';

export default function Signup() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        skills: "",
        companyName: "",
        companyWebsite: "",
        password: "",
        confirmPassword: "",
        role: "jobseeker"
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const isRecruiter = input.role === 'recruiter';

    const handleGeneratePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let generatedPassword = "";
        
        generatedPassword += "A"; 
        generatedPassword += "B"; 
        generatedPassword += "a"; 
        generatedPassword += "b"; 
        generatedPassword += "1"; 
        generatedPassword += "!"; 
        
        for (let i = 0, n = charset.length; i < length - 6; ++i) {
            generatedPassword += charset.charAt(Math.floor(Math.random() * n));
        }

        generatedPassword = generatedPassword.split('').sort(function(){return 0.5-Math.random()}).join('');
        
        setInput(prev => ({
            ...prev,
            password: generatedPassword,
            confirmPassword: generatedPassword
        }));

        toast.success("Strong password generated!", { icon: '🔑' });
    };
    
    // Validation
    const passwordsMatch = input.password === input.confirmPassword;
    const strong = isPasswordStrong(input.password);
    const requiredFilled = input.fullname && input.email && input.password && input.confirmPassword && (isRecruiter ? input.companyName : true);
    const canSubmit = requiredFilled && strong && passwordsMatch;

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Include optional fields appropriately based on backend's expectation or just send them
            const payload = { ...input };
            const res = await axios.post(`${USER_API_END_POINT}/register`, payload, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/verify-email", { state: { email: input.email } });
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message?.includes("already exists")) {
                toast.error("An account with this email already exists. Log in instead →");
            } else {
                toast.error(error.response?.data?.message || "Signup failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)] flex-col md:flex-row transition-colors">
            
            <div className="hidden md:flex md:w-1/2 bg-blue-600 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&fit=crop')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 w-full max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/20 shadow-2xl">
                        <span className="text-4xl text-black">🚀</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
                        Power up <br/>
                        <span className="text-blue-300">Your Journey.</span>
                    </h1>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[var(--color-card)] text-[var(--color-text)]">
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-6">
                        <h2 className="text-4xl font-extrabold tracking-tight mb-2">Create Account</h2>
                        <p className="text-[var(--color-text-secondary)] font-medium">Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition">Log in here &rarr;</Link></p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                          Fields marked <span style={{ color: '#ef4444' }}>*</span> are required
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1.5">Registering as a... <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 text-sm font-bold transition ${!isRecruiter ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}>
                                    <input type="radio" name="role" value="jobseeker" checked={!isRecruiter} onChange={changeEventHandler} className="sr-only"/>
                                    Candidate
                                </label>
                                <label className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 text-sm font-bold transition ${isRecruiter ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'}`}>
                                    <input type="radio" name="role" value="recruiter" checked={isRecruiter} onChange={changeEventHandler} className="sr-only"/>
                                    Recruiter
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5">Full Name <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                            <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} 
                                   className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] focus:border-blue-600 outline-none" placeholder="John Doe" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5">Email address <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                            <input type="email" name="email" value={input.email} onChange={changeEventHandler} 
                                   className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] focus:border-blue-600 outline-none" placeholder="john@example.com" required />
                        </div>

                        {isRecruiter ? (
                            <>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5">Company Name <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                                    <input type="text" name="companyName" value={input.companyName} onChange={changeEventHandler} className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5">Company Website <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 400 }}>(optional)</span></label>
                                    <input type="url" name="companyWebsite" value={input.companyWebsite} onChange={changeEventHandler} className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5">Phone Number <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 400 }}>(optional)</span></label>
                                    <input type="tel" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5">Skills <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 400 }}>(optional)</span></label>
                                    <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} placeholder="e.g. React, Node.js" className="block w-full rounded-xl border px-4 py-3 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" />
                                </div>
                            </>
                        )}
                        
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-bold">Password <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                                <button type="button" onClick={handleGeneratePassword} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition font-bold uppercase transition">
                                    ✨ Suggest Strong
                                </button>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" value={input.password} onChange={changeEventHandler} 
                                       className="block w-full rounded-xl border px-4 py-3 pr-10 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-secondary)]">
                                    👁️
                                </button>
                            </div>
                            <PasswordPanel password={input.password} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5">Confirm Password <span style={{ color: '#ef4444', fontWeight: 600 }}>*</span></label>
                            <div className="relative">
                                <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={input.confirmPassword} onChange={changeEventHandler} 
                                       className="block w-full rounded-xl border px-4 py-3 pr-10 bg-[var(--color-bg-input)] text-[var(--color-text)] border-[var(--color-border)] outline-none" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-secondary)]">
                                    👁️
                                </button>
                            </div>
                            {input.confirmPassword && !passwordsMatch && (
                                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <button type="submit" disabled={!canSubmit || loading} className="w-full mt-4 rounded-xl bg-blue-600 px-4 py-3.5 text-md font-bold text-white shadow-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
