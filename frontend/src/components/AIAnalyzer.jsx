import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import { USER_API_END_POINT } from '../utils/constant';

function AIAnalyzer() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [generatingResume, setGeneratingResume] = useState(false);
    const [generatedResumeText, setGeneratedResumeText] = useState(null);

    React.useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                toast("AI is taking longer than usual... Please check your internet or wait 10 more seconds.", {
                    icon: '⏳',
                    duration: 5000
                });
            }, 15000);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const analyzeResumeHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${USER_API_END_POINT}/ai-analyze`, {
                withCredentials: true
            });
            if (res.data.success) {
                setResult(res.data);
                toast.success("AI Analysis Complete!");
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 429) {
                toast.error("AI Rate Limit: Please wait 60 seconds for the next scan.", {
                    duration: 6000,
                    icon: '⏳'
                });
            } else {
                toast.error(error.response?.data?.message || "Failed to analyze resume");
            }
        } finally {
            setLoading(false);
        }
    };

    const generateResumeHandler = async () => {
        setGeneratingResume(true);
        try {
            const res = await axios.get(`${USER_API_END_POINT}/ai-generate-resume`, {
                withCredentials: true
            });
            if (res.data.success) {
                setGeneratedResumeText(res.data.generatedResume);
                toast.success("AI Generated New Resume!");
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 429) {
                toast.error("Generation Capacity Reached: Wait 60s and try again.", {
                    duration: 6000,
                    icon: '⚠️'
                });
            } else {
                toast.error(error.response?.data?.message || "Failed to generate resume");
            }
        } finally {
            setGeneratingResume(false);
        }
    };

    const downloadResume = () => {
        if (!generatedResumeText) return;
        
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            
            // Header Accent
            doc.setFillColor(37, 99, 235); // Royal Blue
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            // Resume Title
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("CURRICULUM VITAE", 20, 25);
            
            // Subtitle
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("AI OPTIMIZED BY JOBPORTAL", 20, 32);

            // Photo Placeholder Section
            doc.setFillColor(240, 240, 240);
            doc.roundedRect(pageWidth - 50, 10, 30, 35, 3, 3, 'F');
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(8);
            doc.text("PLACE PHOTO", pageWidth - 46, 28);
            
            // Body Content
            doc.setTextColor(33, 33, 33);
            doc.setFontSize(10);
            
            const lines = doc.splitTextToSize(generatedResumeText, pageWidth - 40);
            let yPos = 55;
            
            lines.forEach(line => {
                // If it's a heading (starts with # or matches common section names)
                const isHeading = line.startsWith('#') || line.toUpperCase() === line && line.length > 3;
                
                if (isHeading) {
                    yPos += 5;
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(37, 99, 235);
                    doc.setFontSize(12);
                    doc.text(line.replace(/#/g, '').trim(), 20, yPos);
                    yPos += 2;
                    doc.setDrawColor(200, 200, 200);
                    doc.line(20, yPos, pageWidth - 20, yPos);
                    yPos += 6;
                } else {
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(60, 60, 60);
                    doc.setFontSize(10);
                    doc.text(line, 20, yPos);
                    yPos += 6;
                }

                // Page overflow handling
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
            });
            
            doc.save("ai-optimized-professional-resume.pdf");
            toast.success("Premium Resume Downloaded! 📄✨");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-3xl font-bold text-blue-700 mb-4">Gemini AI Resume Analyzer</h1>
                    <p className="text-gray-600 mb-6">Let our AI scan your uploaded resume and recommend the perfect jobs.</p>
                    <button 
                        onClick={analyzeResumeHandler} 
                        disabled={loading}
                        className={`font-bold py-3 px-8 rounded-full text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-lg'}`}
                    >
                        {loading ? "Scanning Resume with AI..." : "Start AI Scanning ✨"}
                    </button>
                </div>

                {result && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 transition-all hover:shadow-blue-100 flex flex-col items-center">
                            <h2 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-widest">ATS Match Score 🚀</h2>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * result.analysis.score) / 100} className={`${result.analysis.score >= 80 ? 'text-green-500' : result.analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} />
                                </svg>
                                <div className="absolute text-4xl font-black text-gray-900">{result.analysis.score} <span className="text-xs text-gray-400">%</span></div>
                            </div>
                            <p className="mt-6 text-sm font-bold text-gray-500 text-center">
                                {result.analysis.score >= 80 ? "SDE READY! (High FAANG Probability)" : result.analysis.score >= 50 ? "DECENT Match. Needs Optimization." : "POOR Match. Rewrite Required."}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
                            <h2 className="text-xl font-bold mb-4">Missing Skills to Learn 📈</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {result.analysis.missingSkills?.map((skill, index) => (
                                    <li key={index} className="font-medium text-red-600">{skill}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                            <h2 className="text-xl font-bold mb-4">Resume Shortcomings & Areas for Improvement ⚠️</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                                {result.analysis.shortcomings?.map((issue, index) => (
                                    <li key={index} className="font-medium text-yellow-700">{issue}</li>
                                )) || <li>No major shortcomings found!</li>}
                            </ul>
                            
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                                <h3 className="text-xl font-bold text-blue-800 mb-3">Fix These Automatically with AI</h3>
                                <p className="text-gray-600 mb-4">Let our AI rewrite your resume based on your current profile to fix these issues and create an ATS-friendly resume instantly.</p>
                                <button 
                                    onClick={generateResumeHandler} 
                                    disabled={generatingResume}
                                    className={`font-bold py-3 px-8 rounded-full text-white transition ${generatingResume ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105 shadow-lg'}`}
                                >
                                    {generatingResume ? "Generating Resume..." : "Generate New AI Resume 🚀"}
                                </button>
                            </div>
                        </div>

                        {generatedResumeText && (
                           <div className="md:col-span-2 bg-slate-900 text-slate-50 p-8 rounded-2xl shadow-2xl border-t-8 border-teal-500 overflow-x-auto relative group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div>
                                        <h2 className="text-3xl font-black text-teal-400">Your AI Optimized Resume</h2>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">SDE FAANG Standard Formatting</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedResumeText);
                                                toast.success("Resume Copied to Clipboard!");
                                            }}
                                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-xl transition shadow-lg border border-slate-600"
                                        >
                                            📋 Copy
                                        </button>
                                        <button
                                            onClick={downloadResume}
                                            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-xl transition shadow-lg flex items-center gap-2"
                                        >
                                            📥 Download PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200">
                                        {generatedResumeText}
                                    </pre>
                                </div>
                           </div>
                        )}

                        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                            <h2 className="text-xl font-bold mb-4">Jobs Matched For You 💼</h2>
                            {result.matchedJobs?.length === 0 ? (
                                <p className="text-gray-500">No perfectly matching jobs found right now.</p>
                            ) : (
                                <div className="space-y-4">
                                    {result.matchedJobs?.map((job) => (
                                        <div key={job._id} className="border p-4 rounded hover:bg-gray-50 transition border-l-4 border-l-green-400">
                                            <h3 className="font-bold text-lg">{job.title}</h3>
                                            <p className="text-sm text-gray-600">{job.companyName} | ₹{job.salary} LPA</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIAnalyzer;
