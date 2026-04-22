import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant';

function ApplicationStatus() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setApplications(res.data.application);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return 'bg-green-500 text-white';
            case 'rejected': return 'bg-red-500 text-white';
            case 'pending': return 'bg-orange-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getProgress = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return '100%';
            case 'rejected': return '100%';
            case 'pending': return '50%';
            default: return '0%';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Application <span className="text-blue-600">Tracking</span></h1>
                    <p className="text-[var(--text-secondary)] font-bold mt-2">Check your selection status and recruitment progress with real-time updates.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 font-black text-[var(--text-secondary)]">Fetching your status...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-[var(--card-bg)] p-12 rounded-3xl border border-[var(--border-color)] text-center">
                        <div className="text-6xl mb-6">📑</div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)]">No applications yet</h2>
                        <p className="text-[var(--text-secondary)] font-bold mt-2">Apply for local jobs to track your progress here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] group-hover:text-blue-600 transition">{app.job?.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="font-bold text-[var(--text-secondary)] mb-4">{app.job?.companyName || "Company"}</p>
                                        
                                        {/* Status Timeline UI */}
                                        <div className="relative pt-1 max-w-sm">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                        Process Completion
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black inline-block text-blue-600">
                                                        {getProgress(app.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                                                <div style={{ width: getProgress(app.status) }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span className="text-xs font-black text-[var(--text-secondary)] uppercase">Verified Application ID</span>
                                        <span className="font-mono text-sm bg-[var(--bg-secondary)] px-3 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)]">
                                            {app._id.substring(0, 8).toUpperCase()}...
                                        </span>
                                        <p className="text-xs text-gray-500 mt-2 font-bold">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                {app.status === 'accepted' && (
                                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl flex items-center gap-4 animate-bounce">
                                        <span className="text-2xl">🎉</span>
                                        <p className="text-green-700 dark:text-green-400 font-black text-sm">Congratulations! You have been shortlisted for this role. The recruiter will contact you shortly.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApplicationStatus;
