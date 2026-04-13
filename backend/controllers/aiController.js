import { GoogleGenAI } from '@google/genai';
import { User } from '../models/userModel.js';
import { Job } from '../models/jobModel.js';
import fs from 'fs';
import path from 'path';

const generateWithRetry = async (ai, modelList, prompt, pdfBase64) => {
    let lastError;
    for (const model of modelList) {
        for (let i = 0; i < 3; i++) {
            try {
                console.log(`[AI] Requesting model: ${model} (Attempt ${i + 1})`);
                return await ai.models.generateContent({
                    model: model,
                    contents: [
                        prompt,
                        {
                            inlineData: {
                                data: pdfBase64,
                                mimeType: 'application/pdf'
                            }
                        }
                    ]
                });
            } catch (error) {
                lastError = error;
                const errMsg = (error.message || JSON.stringify(error)).toLowerCase();
                const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('demand') || errMsg.includes('unavailable') || errMsg.includes('overloaded');
                
                if (isTransient && i < 2) {
                    const delay = 2000 * (i + 1);
                    console.log(`[AI] Model ${model} is overloaded. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.log(`[AI] Generating with ${model} failed.`);
                    break; 
                }
            }
        }
    }
    throw lastError; 
};

export const analyzeResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || !user.profile.resume) {
            return res.status(400).json({ message: "Please upload your Resume (PDF) first.", success: false });
        }

        if (!user.profile.resume.toLowerCase().endsWith('.pdf')) {
            return res.status(400).json({ 
                message: "Invalid file format! The AI only supports .pdf files.", 
                success: false 
            });
        }

        const resumePath = path.resolve("uploads", user.profile.resume);
        
        if (!fs.existsSync(resumePath)) {
             return res.status(400).json({ message: `File not found: ${resumePath}`, success: false });
        }

        let pdfBase64 = "";
        try {
            const dataBuffer = fs.readFileSync(resumePath);
            // DIRECT AI CONVERSION (NO THIRD PARTY PDF CRAP)
            pdfBase64 = dataBuffer.toString("base64");
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Error reading file: " + err.message, success: false });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        You are an expert HR Analyst. Analyze the attached candidate's resume (PDF).
        Read the resume thoroughly and calculate an ATS score out of 100 based on their experience, education, and skills.
        Identify 3-4 key industry skills that are missing from their profile but usually required for their target roles.
        Suggest 2-3 job roles (like "Frontend Developer", "Data Scientist") that best fit this profile.
        Identify 3-4 specific shortcomings, weaknesses, formatting errors, or lacking areas in this resume that are hurting their chances.
        
        Provide your analysis strictly in raw JSON format exactly like this schema (do NOT use my example values, generate real ones based on the resume):
        {
            "score": <calculated integer score between 0 and 100>,
            "missingSkills": ["<skill 1>", "<skill 2>"],
            "suggestedRoles": ["<role 1>", "<role 2>"],
            "shortcomings": ["<shortcoming 1>", "<shortcoming 2>"]
        }
        `;

        const response = await generateWithRetry(ai, ['gemini-2.5-flash'], prompt, pdfBase64);

        const cleanedText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const aiAnalysis = JSON.parse(cleanedText);

        const suggestedRoles = aiAnalysis.suggestedRoles || [];
        
        const roleQueries = suggestedRoles.map(role => ({ title: { $regex: role, $options: "i" } }));
        
        let suggestedJobs = [];
        if (roleQueries.length > 0) {
            suggestedJobs = await Job.find({ $or: roleQueries }).limit(5);
        }

        return res.status(200).json({ 
            analysis: aiAnalysis, 
            matchedJobs: suggestedJobs,
            success: true 
        });

    } catch (error) {
        console.log(error);
        const errMsg = error.message ? error.message : "Temporary AI server overload. Please try again in a minute.";
        return res.status(500).json({ message: "AI processing failed: " + errMsg, success: false });
    }
};

export const generateResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || !user.profile.resume) {
            return res.status(400).json({ message: "Please upload your Resume (PDF) first.", success: false });
        }

        const resumePath = path.resolve("uploads", user.profile.resume);
        if (!fs.existsSync(resumePath)) {
             return res.status(400).json({ message: `File not found: ${resumePath}`, success: false });
        }

        let pdfBase64 = "";
        try {
            const dataBuffer = fs.readFileSync(resumePath);
            pdfBase64 = dataBuffer.toString("base64");
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Error reading file: " + err.message, success: false });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        You are an expert Resume Writer and Career Coach. I have attached my current resume.
        Please generate a new, highly optimized, ATS-friendly resume for me. 
        Focus on fixing shortcomings, enhancing bullet points with action verbs, and structuring it properly.
        Your output should be ONLY the generated resume text in Markdown format.
        Do not include any chat filler, just the markdown resume.
        Use sections like Contact Info, Summary, Experience, Education, Skills, and Projects.
        `;

        const response = await generateWithRetry(ai, ['gemini-2.5-flash'], prompt, pdfBase64);

        const generatedMarkdown = response.text.trim();

        return res.status(200).json({ 
            generatedResume: generatedMarkdown,
            success: true 
        });

    } catch (error) {
        console.log(error);
        const errMsg = error.message ? error.message : "Temporary AI server overload. Please try again in a minute.";
        return res.status(500).json({ message: "AI processing failed: " + errMsg, success: false });
    }
};
