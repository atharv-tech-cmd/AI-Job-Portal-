import { GoogleGenerativeAI } from '@google/generative-ai';
import { User } from '../models/userModel.js';
import { Job } from '../models/jobModel.js';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const generateWithRetry = async (ai, modelList, prompt, pdfBase64, textContent = null) => {
    let lastError;
    const key = process.env.GEMINI_API_KEY;

    // Phase 1: Try the explicitly provided high-performance models
    for (const modelName of modelList) {
        try {
            console.log(`[AI FAST-PATH] Attempting ${modelName}...`);
            const genModel = ai.getGenerativeModel({ model: `models/${modelName}` }, { apiVersion: 'v1beta' });
            const contentParts = [prompt];
            if (pdfBase64) contentParts.push({ inlineData: { data: pdfBase64, mimeType: 'application/pdf' } });
            if (textContent) contentParts.push(`Text Context: ${textContent}`);
            
            const result = await genModel.generateContent(contentParts);
            const response = await result.response;
            return response;
        } catch (error) {
            lastError = error;
            console.error(`[AI SKIP] ${modelName} failed or busy.`);
            // No wait, jump to next model immediately for <5s response
            if (error.message?.includes('404')) break;
        }
    }

    // Phase 2: Self-Healing / Permanent Fix. If all hardcoded models fail,
    // fetch the actual list of available models from the user's account.
    try {
        console.log("[AI] Entering Self-Healing mode. Fetching account model list...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        const availableModels = data.models
            ?.filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name);

        if (availableModels && availableModels.length > 0) {
            console.log(`[AI] Self-Heal: trying ${availableModels[0]}`);
            const genModel = ai.getGenerativeModel({ model: availableModels[0] }, { apiVersion: 'v1beta' });
            const result = await genModel.generateContent([prompt, ...(pdfBase64 ? [{inlineData:{data:pdfBase64, mimeType:'application/pdf'}}] : []), ...(textContent ? [textContent] : [])]);
            return await result.response;
        }
    } catch (e) {
        console.error("[AI] Self-Heal failed:", e.message);
    }

    throw lastError; 
};

export const analyzeResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || !user.profile.resume) {
            return res.status(400).json({ message: "Please upload your Resume first.", success: false });
        }

        const resumePath = path.resolve("uploads", user.profile.resume);
        if (!fs.existsSync(resumePath)) {
             return res.status(400).json({ message: "Resume file not found on server.", success: false });
        }

        const ext = path.extname(user.profile.resume).toLowerCase();
        let pdfBase64 = null;
        let textContent = null;

        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(resumePath);
            pdfBase64 = dataBuffer.toString("base64");
        } else if (ext === '.docx' || ext === '.doc') {
            const result = await mammoth.extractRawText({ path: resumePath });
            textContent = result.value;
        } else {
            // Assume text-based for others like .txt, .md
            textContent = fs.readFileSync(resumePath, 'utf8');
        }

        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const prompt = `
        You are an elite SDE Recruitment Specialist and ATS Performance Auditor. 
        Analyze the attached candidate's resume with extremely high precision.
        
        TASKS:
        1. Calculate a DYNAMIC ATS Score (0-100) based on Software Engineering industry standards (Experience, Tech Stack, Education, Formatting). Be VERY critical and objective. Do NOT give high scores unless the resume is exceptional.
        2. Identify 4-5 high-impact tech skills or certifications (e.g., System Design, Kubernetes, AWS, Go) currently missing from their profile based on their career stage.
        3. Suggest 3 specific SDE roles (e.g., "Senior Backend Engineer", "Full-stack Developer", "SRE") that align with their experience.
        4. Identify 5-6 critical shortcomings including formatting issues, vague bullet points, skill gaps, and summary quality.
        
        FORMAT:
        Provide your analysis strictly in raw JSON format.
        Schema:
        {
            "score": <integer>,
            "missingSkills": ["<skill 1>", "<skill 2>", ...],
            "suggestedRoles": ["<role 1>", "<role 2>", ...],
            "shortcomings": ["<shortcoming 1>", "<shortcoming 2>", ...]
        }
        `;

        const response = await generateWithRetry(ai, ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'], prompt, pdfBase64, textContent);
        const responseText = response.text();
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
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
        const errorMessage = error.message || "Unknown error";
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
            return res.status(429).json({ 
                message: "AI Capacity Reached: You've hit the Gemini Free Tier limit. Please wait 60 seconds and try again.", 
                success: false 
            });
        }
        return res.status(500).json({ message: "AI processing failed: " + errorMessage, success: false });
    }
};

export const generateResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user || !user.profile.resume) {
            return res.status(400).json({ message: "Please upload your Resume first.", success: false });
        }

        const resumePath = path.resolve("uploads", user.profile.resume);
        if (!fs.existsSync(resumePath)) {
             return res.status(400).json({ message: "Resume file not found on server.", success: false });
        }

        const ext = path.extname(user.profile.resume).toLowerCase();
        let pdfBase64 = null;
        let textContent = null;

        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(resumePath);
            pdfBase64 = dataBuffer.toString("base64");
        } else if (ext === '.docx' || ext === '.doc') {
            const result = await mammoth.extractRawText({ path: resumePath });
            textContent = result.value;
        } else {
            textContent = fs.readFileSync(resumePath, 'utf8');
        }

        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const prompt = `
        You are a FAANG-level Senior Resume Engineer. 
        Your goal is to transform the provided resume data into a HIGH-CONVERTING, PREMIUM SDE RESUME.
        
        Context Recommendation: If the resume contains academic patterns (like GLA University specific formats), preserve the core strengths but elevate them to global tech standards.
        
        STRICT GUIDELINES:
        1. STRUCTURE: 
           - [PHOTO PLACEHOLDER] at the top right.
           - Professional Header (Name, Linktree, GitHub, LinkedIn).
           - Executive Summary (Max 3 lines, tech-heavy).
           - Technical Skills (Mastery-based categorization).
           - Professional Experience (Bullet points MUST start with action verbs and include metrics/impact).
           - Project Section (Link to GitHub, tech stack used, complexity explained).
           - Education & Achievements.
        2. VERBIAGE: 
           - Use "Engineered", "Orchestrated", "Spearheaded" instead of "Worked on".
           - Quantify EVERYTHING (e.g., "Reduced bundle size by 40%", "Optimized API response time by 200ms").
        3. FORMAT: 
           - Use clean Markdown with clear headings and proper spacing.
           - Ensure the tone is extremely professional yet modern.
        
        OUTPUT: 
        Only the Markdown content. Do not include any meta-talk or introductory greetings.
        `;

        const response = await generateWithRetry(ai, ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro-latest'], prompt, pdfBase64, textContent);
        const generatedMarkdown = response.text().trim();

        return res.status(200).json({ 
            generatedResume: generatedMarkdown,
            success: true 
        });

    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "Unknown error";
        if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota')) {
            return res.status(429).json({ 
                message: "AI Capacity Reached: You've hit the Gemini Free Tier limit. Please wait 60 seconds and try again.", 
                success: false 
            });
        }
        return res.status(500).json({ message: "AI processing failed: " + errorMessage, success: false });
    }
};
