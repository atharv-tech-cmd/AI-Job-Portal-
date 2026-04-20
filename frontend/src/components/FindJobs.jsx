import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';

function FindJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch external jobs
                const externalRes = await axios.get("https://remotive.com/api/remote-jobs?limit=30");
                const externalJobs = externalRes.data.jobs || [];

                // Fetch local jobs hosted on our backend
                let localJobs = [];
                try {
                    const localRes = await axios.get(`${JOB_API_END_POINT}/get`);
                    if (localRes.data.success) {
                        localJobs = localRes.data.jobs.map(job => ({
                            id: job._id,
                            title: job.title,
                            company_name: job.companyName || "Local Employer",
                            company_logo: "https://via.placeholder.com/100?text=Local",
                            category: job.jobType || "General",
                            candidate_required_location: job.location || "Remote",
                            url: "#", // Local job doesn't have an external apply link yet
                            isLocal: true,
                            jobId: job._id
                        }));
                    }
                } catch (e) {
                    console.log("Failed to fetch local jobs", e);
                }

                setJobs([...localJobs, ...externalJobs]);
            } catch (error) {
                console.log("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = async (e, job) => {
        if (job.isLocal) {
            e.preventDefault();
            try {
                const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${job.jobId}`, {}, {
                    withCredentials: true
                });
                if (res.data.success) {
                    toast.success(res.data.message || `Successfully applied to ${job.title}!`);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to apply");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-6xl mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Discover Real <span className="text-blue-600">Global Jobs</span></h1>
                <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto font-medium">
                    Live job openings fetched directly from external global remote portals & Local Recruiters. Search by role, company, or keyword.
                </p>
                <div className="max-w-2xl mx-auto relative">
                    <input 
                        type="text" 
                        placeholder="Search for 'Frontend', 'Google', 'Python'..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-6 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none text-lg shadow-lg font-bold"
                    />
                    <span className="absolute right-6 top-4 text-2xl">🔍</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
                    <p className="text-xl text-blue-600 font-bold animate-pulse">Scraping job boards...</p>
                </div>
            ) : (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.length > 0 ? filteredJobs.map(job => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t-4 border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 border border-gray-100 flex items-center justify-center">
                                        <img src={job.company_logo || "https://via.placeholder.com/100?text=Logo"} alt="logo" className="w-full h-full object-contain"/>
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-lg text-gray-900 leading-tight">{job.title}</h2>
                                        <p className="text-blue-600 font-black text-sm uppercase tracking-wide mt-1">{job.company_name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6 mt-4">
                                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-md font-bold">{job.category}</span>
                                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-md font-bold">{job.candidate_required_location}</span>
                                </div>
                            </div>
                            
                            <a 
                                href={job.url} 
                                target={job.isLocal ? "_self" : "_blank"} 
                                rel="noreferrer" 
                                onClick={(e) => handleApply(e, job)}
                                className="block w-full text-center bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition shadow-lg"
                            >
                                Apply Directly 🚀
                            </a>
                        </div>
                    )) : (
                        <div className="col-span-full text-center text-gray-500 text-2xl font-black mt-10">No jobs found matching your search term.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FindJobs;
