import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "jobseeker"
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/user/register", input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/verify-email", { state: { email: input.email } });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Signup failed");
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
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight drop-shadow-md">
                        Power up your <br/>
                        <span className="text-blue-300">Career Journey.</span>
                    </h1>
                    <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium">
                        Join our AI-powered job portal today. Build your profile, let Google Gemini analyze your skills, and match with world-class opportunities in seconds.
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm font-semibold text-blue-100 bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm w-max">
                        <div className="flex -space-x-4">
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-800" src="https://i.pravatar.cc/100?img=1" alt="user"/>
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-800" src="https://i.pravatar.cc/100?img=2" alt="user"/>
                            <img className="w-10 h-10 rounded-full border-2 border-indigo-800" src="https://i.pravatar.cc/100?img=3" alt="user"/>
                        </div>
                        <p>Over 10,000+ professionals hired.</p>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500 font-medium font-medium">Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition">Log in here &rarr;</Link></p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                            <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} 
                                   className="block w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 focus:ring-1 outline-none transition shadow-sm bg-gray-50" 
                                   placeholder="John Doe" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                            <input type="email" name="email" value={input.email} onChange={changeEventHandler} 
                                   className="block w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 focus:ring-1 outline-none transition shadow-sm bg-gray-50" 
                                   placeholder="john@example.com" required />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" value={input.password} onChange={changeEventHandler} 
                                       className="block w-full rounded-xl border border-gray-300 px-4 py-3.5 pr-10 text-gray-900 focus:border-blue-600 focus:ring-blue-600 focus:ring-1 outline-none transition shadow-sm bg-gray-50" 
                                       placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.579 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Registering as a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 text-sm font-bold transition duration-200 ${input.role === 'jobseeker' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="jobseeker" checked={input.role === 'jobseeker'} onChange={changeEventHandler} className="sr-only"/>
                                    Candidate 👨‍💻
                                </label>
                                <label className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 text-sm font-bold transition duration-200 ${input.role === 'recruiter' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                                    <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="sr-only"/>
                                    Recruiter 🏢
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-4 text-md font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                            {loading ? "Creating account..." : "Start your journey"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
