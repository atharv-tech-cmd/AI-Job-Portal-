import { Job } from "../models/jobModel.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experienceLevel, companyName, externalUrl } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !companyName) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel,
            companyName,
            externalUrl,
            created_by: userId
        });

        return res.status(201).json({ message: "New job created successfully.", job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({ path: "created_by" }).sort({ createdAt: -1 });
        
        if (!jobs) return res.status(404).json({ message: "Jobs not found.", success: false });
        
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
