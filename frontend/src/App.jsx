import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import PostJob from './components/PostJob';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AIAnalyzer from './components/AIAnalyzer';
import AdminDashboard from './components/AdminDashboard';
import FindJobs from './components/FindJobs';
import VerifyEmail from './components/VerifyEmail';

function App() {
  return (
    <BrowserRouter>
      <Toaster />  
      <Navbar />
      <Routes>
         <Route path="/" element={<Signup />} />
         <Route path="/login" element={<Login />} />
         <Route path="/verify-email" element={<VerifyEmail />} />
         <Route path="/home" element={<Home />} />
         <Route path="/post-job" element={<PostJob />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/ai-analyzer" element={<AIAnalyzer />} />
         <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/find-jobs" element={<FindJobs />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;
