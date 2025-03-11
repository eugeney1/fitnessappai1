import axios from "axios";
import { GEMINI_API_KEY } from "@env";  

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function askGemini(prompt) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,  
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        return response.data.candidates[0]?.content.parts[0].text || "No response from Gemini AI.";
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        return "Error communicating with Gemini AI.";
    }
}
