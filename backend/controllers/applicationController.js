import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: "pending"
        });

        return res.status(201).json({
            message: "Applied successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'created_by',
                    options: { sort: { createdAt: -1 } }
                }
            });

        if (!application) {
            return res.status(404).json({ message: "No applications found.", success: false });
        }
        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        // Verify the user is the recruiter of this job
        const job = await Job.findById(jobId);
        if(!job){
             return res.status(404).json({ message: "Job not found.", success: false });
        }
        if (job.created_by.toString() !== req.id) {
             return res.status(403).json({ message: "Unauthorized.", success: false });
        }

        const applications = await Application.find({ job: jobId }).populate({
            path: 'applicant',
            options: { sort: { createdAt: -1 } }
        });

        if (!applications) {
            return res.status(404).json({ message: "No applicants found.", success: false });
        }

        return res.status(200).json({ job, applications, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
             return res.status(400).json({ message: "Status is required.", success: false });
        }

        const application = await Application.findById(applicationId);
        if(!application){
             return res.status(404).json({ message: "Application not found.", success: false });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ message: "Status updated successfully.", success: true });

    } catch (error) {
         console.log(error);
         return res.status(500).json({ message: "Server error", success: false });
    }
}
