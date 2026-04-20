import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';

function Profile() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        bio: "",
        skills: "",
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
                // Update local storage user if returned
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
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 py-10 space-y-10">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl grid grid-cols-2 gap-4">
                <h1 className="col-span-2 font-black text-3xl mb-4 text-blue-600 border-b pb-4">Profile Settings</h1>
                
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                    <input type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition" />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-bold mb-1">Email</label>
                    <input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition" />
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Bio</label>
                    <textarea name="bio" value={input.bio} onChange={changeEventHandler} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition" rows="3"></textarea>
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Skills (comma separated)</label>
                    <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 outline-none transition" placeholder="e.g. HTML, CSS, React" />
                </div>

                <div className="col-span-2 mt-2">
                    <label className="block text-gray-700 font-bold mb-1">Upload Resume (PDF/DOC)</label>
                    <input type="file" onChange={fileHandler} className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 focus:border-blue-500 outline-none transition" accept="application/pdf,.doc,.docx" />
                </div>
                
                <button type="submit" className="col-span-2 mt-6 w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-lg shadow-blue-500/30">
                    Save Profile Changes 💾
                </button>
            </form>

            {/* Applied Jobs Section */}
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
                <h2 className="font-black text-2xl mb-6 text-gray-800 border-b pb-4">Application History 📑</h2>
                {appliedJobs.length === 0 ? (
                    <p className="text-gray-500 font-medium">You haven't applied to any local jobs yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-200 text-gray-700 uppercase tracking-widest text-xs">
                                    <th className="p-4 font-bold">Company</th>
                                    <th className="p-4 font-bold">Job Role</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Date Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appliedJobs.map((app) => (
                                    <tr key={app._id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                                        <td className="p-4 font-bold text-blue-600">{app.job?.companyName || "Unknown"}</td>
                                        <td className="p-4 font-medium text-gray-800">{app.job?.title || "Deleted Job"}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                                app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 font-medium whitespace-nowrap">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
