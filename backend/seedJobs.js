import mongoose from "mongoose";
import dotenv from "dotenv";
import { Job } from "./models/jobModel.js";
import { User } from "./models/userModel.js";

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected for seeding");

        // Try to get a user to set as the creator, or if no users exist, it might fail slightly 
        // if required, but user must exist since they just registered to test AI
        const adminUser = await User.findOne({}) || null;
        const creatorId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        const dummyJobs = [
            {
                title: "Frontend Developer",
                description: "Looking for an expert React developer for building awesome UIs.",
                requirements: ["React", "JavaScript", "Tailwind CSS", "Redux"],
                salary: 12,
                location: "Bangalore",
                jobType: "Full-time",
                experienceLevel: 2,
                companyName: "Google India",
                created_by: creatorId,
            },
            {
                title: "Backend Engineer",
                description: "Seeking a Node.js backend developer.",
                requirements: ["Node.js", "Express", "MongoDB", "AWS"],
                salary: 15,
                location: "Remote",
                jobType: "Full-time",
                experienceLevel: 3,
                companyName: "Amazon Dev Center",
                created_by: creatorId,
            },
            {
                title: "Software Engineer",
                description: "Full stack engineer required.",
                requirements: ["JavaScript", "React", "Node.js", "System Design"],
                salary: 14,
                location: "Pune",
                jobType: "Full-time",
                experienceLevel: 1,
                companyName: "Microsoft",
                created_by: creatorId,
            },
            {
                title: "Data Scientist",
                description: "Python and Machine Learning expert.",
                requirements: ["Python", "TensorFlow", "SQL", "Machine Learning"],
                salary: 18,
                location: "Hyderabad",
                jobType: "Full-time",
                experienceLevel: 4,
                companyName: "Meta",
                created_by: creatorId,
            }
        ];

        // insert
        await Job.insertMany(dummyJobs);
        console.log("Dummy Jobs successfully added to Database!");

        process.exit(0);
    } catch (err) {
        console.log("Error seeding:", err);
        process.exit(1);
    }
}

seedDB();
