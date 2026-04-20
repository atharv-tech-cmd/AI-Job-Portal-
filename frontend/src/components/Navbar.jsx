import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import { USER_API_END_POINT } from '../utils/constant';

function Navbar() {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });
            if (res.data.success) {
                localStorage.removeItem("user");
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className="bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm transition-colors">
            <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)]">
                        Job<span className="text-blue-600">Portal</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6 font-semibold text-[var(--color-text-secondary)]">
                    {user ? (
                        <>
                            <Link to="/home" className="hover:text-blue-600 transition">Home</Link>
                            {user.role === 'recruiter' && (
                                <Link to="/post-job" className="hover:text-blue-600 transition">Post Job</Link>
                            )}
                            <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
                            <Link to="/ai-analyzer" className="hover:text-purple-600 text-purple-700 transition">AI Tool ✨</Link>
                            <Link to="/admin" className="hover:text-red-600 text-red-700 transition tracking-wide text-sm bg-red-100 px-3 py-1 rounded-full uppercase">Admin 👑</Link>
                            
                            <div className="flex items-center gap-3 ml-4">
                                <ThemeToggle />
                                <button onClick={logoutHandler} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition hover:shadow-lg font-bold">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 ml-4">
                            <ThemeToggle />
                            <Link to="/login" className="px-5 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                Login
                            </Link>
                            <Link to="/" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:shadow-lg">
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
