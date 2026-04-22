import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/admin/stats`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-2xl font-bold text-blue-600 animate-pulse">Loading Admin Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                <div className="bg-white p-8 rounded-xl shadow-lg border-b-4 border-gray-800 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Admin Dashboard 👑</h1>
                    <p className="text-gray-500 font-medium">Live platform analytics and user insights.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-xl shadow-xl text-white transform hover:-translate-y-2 transition duration-300">
                        <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total Users</div>
                        <div className="text-6xl font-black">{stats?.totalUsers || 0}</div>
                        <div className="mt-4 text-blue-100 text-sm font-medium border-t border-blue-400 pt-3 opacity-90">Registered Accounts</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-800 p-8 rounded-xl shadow-xl text-white transform hover:-translate-y-2 transition duration-300">
                        <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Total Jobs</div>
                        <div className="text-6xl font-black">{stats?.totalJobs || 0}</div>
                        <div className="mt-4 text-purple-200 text-sm font-medium border-t border-purple-400 pt-3 opacity-90">Active Job Postings</div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-8 rounded-xl shadow-xl text-white transform hover:-translate-y-2 transition duration-300">
                        <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Job Seekers</div>
                        <div className="text-6xl font-black">{stats?.seekers || 0}</div>
                        <div className="mt-4 text-green-100 text-sm font-medium border-t border-green-400 pt-3 opacity-90">Looking for opportunities</div>
                    </div>

                    <div className="bg-gradient-to-br from-rose-500 to-red-700 p-8 rounded-xl shadow-xl text-white transform hover:-translate-y-2 transition duration-300">
                        <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Recruiters</div>
                        <div className="text-6xl font-black">{stats?.recruiters || 0}</div>
                        <div className="mt-4 text-red-100 text-sm font-medium border-t border-red-400 pt-3 opacity-90">Hiring managers on platform</div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;
