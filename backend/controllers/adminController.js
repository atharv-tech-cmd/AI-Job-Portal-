import { User } from '../models/userModel.js';
import { Job } from '../models/jobModel.js';
// testing..
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const recruiters = await User.countDocuments({ role: 'recruiter' });
        const seekers = await User.countDocuments({ role: 'jobseeker' });

        return res.status(200).json({
            stats: {
                totalUsers,
                totalJobs,
                recruiters,
                seekers
            },
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Admin Stats Error", success: false });
    }
};
