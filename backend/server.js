// sds
// changes by atharv
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import path from "path";
dotenv.config();

const app = express();

app.use("/uploads", express.static(path.resolve("uploads")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ai-job-portal-ruby.vercel.app'],
    credentials: true
}));

const PORT = process.env.PORT || 8000;

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
