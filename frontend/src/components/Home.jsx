import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <main className="min-h-screen bg-[#030305] text-white overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] animate-blob animation-delay-4000"></div>
                
                {/* Dotted Overlay for texture */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
                     style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')" }}>
                </div>
            </div>

            {/* Hero Section */}
            <header className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center z-10">
                <div className="animate-fade-in-up">
                    <span className="inline-flex items-center gap-2 bg-indigo-950/40 text-indigo-300 border border-indigo-700/50 px-6 py-2 rounded-full text-sm font-bold tracking-widest mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        {user?.role === 'recruiter' ? 'RECRUITER SUITE' : 'JOBSEEKER PORTAL'}
                    </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black mt-2 mb-8 tracking-tighter leading-[1.1] animate-fade-in-up animation-delay-100">
                    <span className="text-white drop-shadow-2xl">Own Your</span> <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                        Future Career.
                    </span>
                </h1>
                
                <p className="text-gray-300 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed mb-12 animate-fade-in-up animation-delay-200">
                    {user?.role === 'recruiter' 
                        ? "Empowering companies with AI-driven applicant tracking. Source, analyze, and hire the top 1% of tech talent instantly."
                        : `Welcome back, ${user?.fullname || "Guest"}. Discover your market value and leverage Gemini AI to build a portfolio recruiters can't ignore.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
                    <Link to={user?.role === 'recruiter' ? "/post-job" : "/find-jobs"} className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1">
                        {user?.role === 'recruiter' ? 'Post a New Job' : 'Explore Openings'}
                    </Link>
                    <Link to="/ai-analyzer" className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1">
                        Try AI Analyzer ✨
                    </Link>
                </div>
            </header>

            {/* Floating Visuals Component */}
            <section className="w-full max-w-7xl mx-auto relative h-[400px] mb-32 hidden md:block z-10 px-6">
                <div className="absolute left-[10%] top-10 animate-float w-64 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/50 border border-white/10 group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="tech workspace" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <p className="absolute bottom-4 left-4 font-bold text-sm text-gray-200">Top Tier Companies</p>
                </div>
                
                <div className="absolute left-[35%] top-[-40px] animate-float-delayed w-80 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-white/10 z-20 group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="coding interface" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-indigo-600 rounded-full px-3 py-1 text-xs font-bold">+2.4k Jobs</div>
                </div>

                <div className="absolute right-[10%] top-20 animate-float w-64 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/50 border border-white/10 group cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="developer screen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <p className="absolute bottom-4 left-4 font-bold text-sm text-gray-200">AI Verified Profiles</p>
                </div>
            </section>

            {/* Dashboard Cards Section */}
            <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-32 z-10 relative">
                
                {/* AI Card */}
                <article className="group bg-white/[0.02] border border-white/10 hover:border-indigo-500/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04]">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 text-white group-hover:text-indigo-400 transition-colors">AI Analyzer</h2>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed min-h-[60px]">
                        Let our integrated Gemini AI scan your stack, review your resume, and assign you a market match score instantly.
                    </p>
                    <Link to="/ai-analyzer" className="flex items-center justify-center w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300">
                        Launch Analyzer 🚀
                    </Link>
                </article>

                {/* Profile Card */}
                <article className="group bg-white/[0.02] border border-white/10 hover:border-blue-500/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04]">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl">📝</span>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 text-white group-hover:text-blue-400 transition-colors">My Profile</h2>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed min-h-[60px]">
                        Keep your professional bio, technical skills, and active Resume (PDF) completely up to date for recruiters.
                    </p>
                    <Link to="/profile" className="flex items-center justify-center w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-all duration-300">
                        Update Repository 📁
                    </Link>
                </article>

                {/* Conditional Card (Recruiter or Jobseeker) */}
                {user?.role === 'recruiter' ? (
                    <article className="group bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04]">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl">💼</span>
                        </div>
                        <h2 className="text-3xl font-extrabold mb-4 text-white group-hover:text-emerald-400 transition-colors">Post Job</h2>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed min-h-[60px]">
                            Have a prestigious tech opening? Drop a live job posting on the platform instantly and source top talent.
                        </p>
                        <Link to="/post-job" className="flex items-center justify-center w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all duration-300">
                            Create Posting ✍️
                        </Link>
                    </article>
                ) : (
                    <article className="group bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04]">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h2 className="text-3xl font-extrabold mb-4 text-white group-hover:text-emerald-400 transition-colors">Find Jobs</h2>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed min-h-[60px]">
                            Browse hundreds of fresh tech roles seamlessly. Filter by stack, experience, and instantly apply.
                        </p>
                        <Link to="/find-jobs" className="flex items-center justify-center w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all duration-300">
                            Start Searching 🎯
                        </Link>
                    </article>
                )}
            </section>
        </main>
    );
}

export default Home;
