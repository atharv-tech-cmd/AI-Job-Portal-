import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

async function testModels() {
    console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`\nTesting Model: ${modelName} on v1beta...`);
            const modelBeta = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });
            const resultBeta = await modelBeta.generateContent("Hi");
            console.log(`✅ ${modelName} works on v1beta! Response: ${resultBeta.response.text().substring(0, 10)}...`);
            return modelName;
        } catch (e) {
            console.warn(`❌ ${modelName} failed on v1beta: ${e.message}`);
        }

        try {
            console.log(`Testing Model: ${modelName} on v1...`);
            const modelV1 = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
            const resultV1 = await modelV1.generateContent("Hi");
            console.log(`✅ ${modelName} works on v1! Response: ${resultV1.response.text().substring(0, 10)}...`);
            return modelName;
        } catch (e) {
            console.warn(`❌ ${modelName} failed on v1: ${e.message}`);
        }
    }
}

testModels().then(m => console.log("\nBest model found:", m)).catch(console.error);
