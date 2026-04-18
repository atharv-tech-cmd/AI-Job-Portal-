import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://ai-job-portal-glq9.onrender.com/api/v1/user/forgot-password", { email }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/reset-password");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="font-bold text-2xl mb-6 text-center text-blue-600">Forgot Password</h1>
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Enter your Account Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                           className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                           placeholder="account@gmail.com" required />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                    Send OTP to Email
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
