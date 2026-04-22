import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using Key:", key.substring(0, 5) + "...");
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const res = await axios.get(url);
        console.log("Available Models:");
        res.data.models.forEach(m => {
            console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods})`);
        });
    } catch (e) {
        console.error("Failed to list models:", e.response?.data || e.message);
    }
}

listModels();
