import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { JOB_API_END_POINT } from '../utils/constant';

function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                // Assuming there's a /getadminjobs route or filter
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    // Filter jobs created by the current recruiter if not already filtered by backend
                    const user = JSON.parse(localStorage.getItem('user'));
                    const myJobs = res.data.jobs.filter(job => job.created_by._id === user._id || job.created_by === user._id);
                    setJobs(myJobs);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminJobs();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] p-8 transition-colors">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
                    <div>
                        <h1 className="text-3xl font-black text-[var(--color-text)]">My Published Jobs</h1>
                        <p className="text-[var(--color-text-secondary)] font-medium mt-1">Manage your active postings and track applicants.</p>
                    </div>
                    <Link to="/post-job" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                        + Post New Job
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-blue-600 font-bold animate-pulse">Loading jobs...</div>
                ) : (
                    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--color-border)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-600 text-white uppercase tracking-widest text-xs font-black">
                                    <th className="p-5">Job Title</th>
                                    <th className="p-5">Company</th>
                                    <th className="p-5">Date</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--color-text)]">
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-[var(--color-text-secondary)] font-medium">
                                            No jobs posted yet. Start by creating one!
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job._id} className="border-b border-[var(--color-border)] hover:bg-blue-50/50 transition">
                                            <td className="p-5 font-bold">{job.title}</td>
                                            <td className="p-5 font-semibold text-blue-600">{job.companyName}</td>
                                            <td className="p-5 text-sm text-[var(--color-text-secondary)]">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-5 text-right">
                                                <button 
                                                    onClick={() => navigate(`/admin/jobs/${job.id || job._id}/applicants`)}
                                                    className="bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-lg text-sm font-bold hover:opacity-80 transition"
                                                >
                                                    View Applicants 👥
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminJobs;
