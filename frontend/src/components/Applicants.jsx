import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { APPLICATION_API_END_POINT } from '../utils/constant';

function Applicants() {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setApplicants(res.data.applications);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load applicants");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id]);

    const statusHandler = async (status, appId) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${appId}/update`, { status }, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                // Update local state
                setApplicants(applicants.map(app => 
                    app._id === appId ? { ...app, status: status.toLowerCase() } : app
                ));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] p-8 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[var(--color-text)]">Applicants ({applicants.length})</h1>
                    <p className="text-[var(--color-text-secondary)] font-medium">Review candidates and manage their application status.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-blue-600 font-bold animate-pulse">Loading candidates...</div>
                ) : (
                    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl overflow-hidden border border-[var(--color-border)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white uppercase tracking-widest text-xs font-black">
                                    <th className="p-5">Full Name</th>
                                    <th className="p-5">Email</th>
                                    <th className="p-5">Resume</th>
                                    <th className="p-5">Date</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--color-text)]">
                                {applicants.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-center text-[var(--color-text-secondary)] font-medium">
                                            No applications received for this job yet.
                                        </td>
                                    </tr>
                                ) : (
                                    applicants.map((app) => (
                                        <tr key={app._id} className="border-b border-[var(--color-border)] hover:bg-slate-100/30 transition">
                                            <td className="p-5">
                                                <div className="font-bold">{app.applicant?.fullname}</div>
                                                <div className="text-xs text-gray-500 max-w-[200px] truncate">{app.applicant?.profile?.bio}</div>
                                            </td>
                                            <td className="p-5 font-medium">{app.applicant?.email}</td>
                                            <td className="p-5">
                                                {app.applicant?.profile?.resume ? (
                                                    <a 
                                                        href={`http://localhost:8000/uploads/${app.applicant.profile.resume}`} 
                                                        target="_blank" rel="noreferrer"
                                                        className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 italic">Not Uploaded</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-sm text-[var(--color-text-secondary)]">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => statusHandler('Accepted', app._id)}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => statusHandler('Rejected', app._id)}
                                                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
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

export default Applicants;
