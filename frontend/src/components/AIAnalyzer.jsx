import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AIAnalyzer() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [generatingResume, setGeneratingResume] = useState(false);
    const [generatedResumeText, setGeneratedResumeText] = useState(null);

    const analyzeResumeHandler = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/ai-analyze", {
                withCredentials: true
            });
            if (res.data.success) {
                setResult(res.data);
                toast.success("AI Analysis Complete!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to analyze resume");
        } finally {
            setLoading(false);
        }
    };

    const generateResumeHandler = async () => {
        setGeneratingResume(true);
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/ai-generate-resume", {
                withCredentials: true
            });
            if (res.data.success) {
                setGeneratedResumeText(res.data.generatedResume);
                toast.success("AI Generated New Resume!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to generate resume");
        } finally {
            setGeneratingResume(false);
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
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
                            <h2 className="text-xl font-bold mb-4">Your AI Score 🎯</h2>
                            <div className="flex items-center justify-center">
                                <div className="text-5xl font-extrabold text-blue-600">{result.analysis.score}/100</div>
                            </div>
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
                           <div className="md:col-span-2 bg-slate-900 text-slate-50 p-6 rounded-lg shadow-md border-t-4 border-teal-500 overflow-x-auto">
                                <h2 className="text-xl font-bold mb-4 text-teal-400">Your AI Generated Resume</h2>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedResumeText);
                                        toast.success("Resume Copied to Clipboard!");
                                    }}
                                    className="mb-4 bg-teal-600 hover:bg-teal-500 text-white py-1 px-4 rounded text-sm transition"
                                >
                                    Copy to Clipboard
                                </button>
                                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed p-4 bg-slate-800 rounded border border-slate-700">
                                    {generatedResumeText}
                                </pre>
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
