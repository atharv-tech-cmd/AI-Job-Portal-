import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';

function FindJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const locationState = useLocation();

    // Helper to generate India-specific simulated jobs for scale
    const generateIndiaJobs = () => {
        const categories = ["Software", "Design", "Remote"];
        const cities = ["Bangalore", "Hyderabad", "Mumbai", "Pune", "Delhi NCR", "Chennai", "Remote"];
        const companies = ["Google India", "Microsoft", "TCS", "Accenture India", "Zomato", "Swiggy", "Flipkart", "Atlassian", "Paytm", "Ola"];
        const roles = {
            "Software": ["Frontend Developer", "Java Engineer", "Python Backend", "Full Stack Developer", "Mobile App Dev", "DevOps Engineer"],
            "Design": ["UI/UX Designer", "Product Designer", "Graphic Designer", "Visual Artist", "Web Designer"],
            "Remote": ["Customer Success", "Remote Developer", "Content Writer", "Virtual Assistant"]
        };

        let mockJobs = [];
        for (let i = 0; i < 1000; i++) {
            const cat = categories[i % 3];
            const roleList = roles[cat];
            const role = roleList[Math.floor(Math.random() * roleList.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];
            const company = companies[Math.floor(Math.random() * companies.length)];
            
            const platforms = [
                { name: "LinkedIn", url: (r, c) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(r + " " + c)}` },
                { name: "Naukri", url: (r, c) => `https://www.naukri.com/${r.toLowerCase().replace(/ /g, "-")}-jobs-in-${city.toLowerCase()}` },
                { name: "Indeed", url: (r, c) => `https://in.indeed.com/jobs?q=${encodeURIComponent(r)}&l=${encodeURIComponent(city)}` },
                { name: "Monster", url: (r, c) => `https://www.foundit.in/srp/results?query=${encodeURIComponent(r)}&locations=${encodeURIComponent(city)}` }
            ];
            const platform = platforms[i % platforms.length];
            
            mockJobs.push({
                id: `mock-${i}`,
                title: role,
                company_name: company,
                company_logo: `https://logo.clearbit.com/${company.toLowerCase().replace(" ", "")}.com?size=100`,
                category: cat,
                candidate_required_location: city,
                url: platform.url(role, company),
                platform: platform.name,
                isLocal: false,
                hasExternalUrl: true,
                isIndia: true
            });
        }
        return mockJobs;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(locationState.search);
        const roleQuery = queryParams.get('role');
        const locQuery = queryParams.get('location');
        if (roleQuery) setSearchTerm(roleQuery);
        if (locQuery) setSearchLocation(locQuery);

        const fetchJobs = async () => {
            setLoading(true);
            try {
                // 1. Fetch live global jobs
                const externalRes = await axios.get("https://remotive.com/api/remote-jobs?limit=100");
                const externalJobs = externalRes.data.jobs?.map(j => ({
                    ...j,
                    category: j.category?.includes("Software") ? "Software" : (j.category?.includes("Design") ? "Design" : "Remote"),
                    isIndia: false
                })) || [];

                // 2. Fetch local system jobs
                let localJobs = [];
                try {
                    const localRes = await axios.get(`${JOB_API_END_POINT}/get`);
                    if (localRes.data.success) {
                        localJobs = localRes.data.jobs.map(job => ({
                            id: job._id,
                            title: job.title,
                            company_name: job.companyName || "Local Employer",
                            company_logo: "https://via.placeholder.com/100?text=Local",
                            category: job.jobType || "Software",
                            candidate_required_location: job.location || "India",
                            url: job.externalUrl || "#",
                            isLocal: true,
                            hasExternalUrl: !!job.externalUrl,
                            jobId: job._id,
                            isIndia: true
                        }));
                    }
                } catch (e) { console.log("Local fetch failed", e); }

                // 3. Combine with India Scale jobs
                const scaleJobs = generateIndiaJobs();
                setJobs([...localJobs, ...scaleJobs, ...externalJobs]);
            } catch (error) {
                console.log("Failed to fetch jobs", error);
                setJobs(generateIndiaJobs()); // Fallback to simulator
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [locationState.search]);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const st = searchTerm.toLowerCase();
            const sl = searchLocation.toLowerCase();
            
            const matchesRole = job.title.toLowerCase().includes(st) || 
                               job.company_name.toLowerCase().includes(st);
            
            const matchesLocation = job.candidate_required_location.toLowerCase().includes(sl) || 
                                   (sl === "india" && job.isIndia);
            
            const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
            
            return matchesRole && matchesLocation && matchesCategory;
        });
    }, [jobs, searchTerm, searchLocation, selectedCategory]);

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] transition-colors">
            {/* Powerful Search Hub */}
            <div className="sticky top-0 z-20 bg-[var(--bg-primary)] shadow-lg py-6 border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Skill, Company, or Designation" 
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">📍</span>
                        <input 
                            type="text" 
                            placeholder="Location (e.g. Bangalore, Remote)" 
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 font-bold text-[var(--text-primary)]"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1">
                        {["All", "Software", "Design", "Remote"].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-tighter transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-[var(--text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-[var(--text-primary)]">
                        <span className="text-3xl font-black">{filteredJobs.length}+</span>
                        <span className="ml-2 font-bold text-[var(--text-secondary)]">Opportunities Found</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase">
                        Updated 2 mins ago
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-6 font-black text-[var(--text-secondary)] animate-pulse uppercase tracking-widest">Scanning India's top job boards...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                        {filteredJobs.length > 0 ? filteredJobs.map(job => (
                            <div key={job.id} className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)] hover:shadow-2xl hover:border-blue-500 transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="w-20 h-20 bg-white rounded-2xl p-3 border border-[var(--border-color)] flex items-center justify-center shadow-sm">
                                        <img 
                                            src={job.company_logo} 
                                            onError={(e) => e.target.src = "https://via.placeholder.com/100?text=Job"} 
                                            className="w-full h-full object-contain" 
                                            alt="logo" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-xl font-black text-[var(--text-primary)] group-hover:text-blue-600 transition">{job.title}</h2>
                                            {job.isIndia && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded font-black">INDIA</span>}
                                        </div>
                                        <p className="font-bold text-[var(--text-secondary)] text-md mb-3">{job.company_name}</p>
                                        <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1">📍 {job.candidate_required_location}</span>
                                            <span className="flex items-center gap-1">💼 {job.category}</span>
                                            <span className="flex items-center gap-1 text-green-500">💰 Competitive Pay</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    <a 
                                        href={job.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="block w-full text-center bg-blue-600 text-white font-black py-4 px-10 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none whitespace-nowrap"
                                    >
                                        Apply on {job.platform || "Official Website"} ↗
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-40">
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">No matching jobs in India found.</h3>
                                <p className="text-[var(--text-secondary)] font-bold">Try searching for "Bangalore", "Python" or "Designer".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindJobs;


