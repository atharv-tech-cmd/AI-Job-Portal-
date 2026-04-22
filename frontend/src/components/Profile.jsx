import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [input, setInput] = useState({
        fullname: user.fullname || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null
    });
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAppliedJobs(res.data.application);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAppliedJobs();
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileHandler = (e) => {
        setInput({ ...input, file: e.target.files[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                if (res.data.user) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--bg-secondary)] p-4 py-12 space-y-12">
            
            <div className="w-full max-w-4xl bg-[var(--bg-primary)] p-10 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full -mr-20 -mt-20"></div>
                
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-[var(--text-primary)]">My <span className="text-blue-600">Profile</span></h1>
                    <p className="font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-widest text-xs">Professional Workspace</p>
                </header>

                <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Full Name</label>
                        <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Email Address</label>
                        <input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]" />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Professional Bio</label>
                        <textarea name="bio" value={input.bio} onChange={changeEventHandler} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]" rows="3"></textarea>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Core Skills</label>
                        <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]" placeholder="React, Node.js, Python..." />
                    </div>

                    <div className="md:col-span-2 p-8 bg-blue-600/5 rounded-3xl border-2 border-dashed border-blue-600/20 text-center">
                        <h3 className="text-sm font-black text-blue-600 uppercase mb-4 tracking-widest">Resume Management</h3>
                        <input type="file" onChange={fileHandler} className="w-full text-xs font-bold text-[var(--text-secondary)]" accept=".pdf,.doc,.docx" />
                        {user.profile?.resume && (
                            <div className="mt-4 inline-flex items-center gap-3 bg-[var(--bg-primary)] px-4 py-2 rounded-full border border-[var(--border-color)] shadow-sm">
                                <span className="text-[10px] font-black text-[var(--text-secondary)] truncate max-w-[150px]">Current: {user.profile.resume}</span>
                                <a href={`http://localhost:8000/uploads/${user.profile.resume}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-600 hover:underline">View 📄</a>
                            </div>
                        )}
                    </div>
                    
                    <button type="submit" className="md:col-span-2 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 text-lg uppercase tracking-widest">
                        Sync Profile Data
                    </button>
                </form>
            </div>

            {/* Application Overview Link */}
            <div className="w-full max-w-4xl text-center pb-20">
                <Link to="/my-applications" className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-[var(--border-color)] shadow-xl hover:scale-[1.02] transition-all group">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition">📊</div>
                    <div className="text-left">
                        <h2 className="text-xl font-black text-[var(--text-primary)]">Track Selection Status</h2>
                        <p className="text-[var(--text-secondary)] font-bold text-sm">You have {appliedJobs.length} active applications. Check selection status now.</p>
                    </div>
                    <div className="ml-8 text-blue-600 font-black text-2xl">→</div>
                </Link>
            </div>

        </div>
    );
}

export default Profile;

