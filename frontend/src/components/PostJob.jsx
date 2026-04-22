import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { JOB_API_END_POINT } from '../utils/constant';

function PostJob() {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        companyName: "",
        externalUrl: ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to post job");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl grid grid-cols-2 gap-4">
                <h1 className="col-span-2 font-bold text-2xl mb-4 text-blue-600">Post a New Job</h1>
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Job Title</label>
                    <input type="text" name="title" value={input.title} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>
                
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Company Name</label>
                    <input type="text" name="companyName" value={input.companyName} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea name="description" value={input.description} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" rows="3" required></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Requirements (comma separated)</label>
                    <input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Salary (in LPA)</label>
                    <input type="number" name="salary" value={input.salary} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Location</label>
                    <input type="text" name="location" value={input.location} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Job Type</label>
                    <input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Experience Level (in years)</label>
                    <input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" required />
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">External Job URL (Optional)</label>
                    <input type="url" name="externalUrl" value={input.externalUrl} onChange={changeEventHandler} className="w-full border p-2 rounded focus:outline-blue-500" placeholder="https://company.com/careers/job-123" />
                </div>
                
                <button type="submit" className="col-span-2 mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    Publish Tech Job 🚀
                </button>
            </form>
        </div>
    );
}

export default PostJob;
