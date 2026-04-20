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
import VerifyResetOtp from './components/VerifyResetOtp';
import VerifyLogin from './components/VerifyLogin';
import AdminJobs from './components/AdminJobs';
import Applicants from './components/Applicants';

import Footer from './components/Footer';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Toaster />  
        <Navbar />
        <main className="flex-grow">
          <Routes>
             <Route path="/" element={<Signup />} />
             <Route path="/login" element={<Login />} />
             <Route path="/verify-login" element={<VerifyLogin />} />
             <Route path="/verify-email" element={<VerifyEmail />} />
             <Route path="/home" element={<Home />} />
             <Route path="/post-job" element={<PostJob />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
             <Route path="/reset-password" element={<ResetPassword />} />
             <Route path="/ai-analyzer" element={<AIAnalyzer />} />
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/jobs" element={<AdminJobs />} />
             <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
             <Route path="/find-jobs" element={<FindJobs />} />
             <Route path="/dashboard/recruiter" element={<Home />} />
             <Route path="/dashboard/jobseeker" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
