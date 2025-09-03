"use server";

import { OpenAI } from "openai";
import api from "../lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function saveResume(content) {
  try {
    const response = await api.post('/resume/save', { content });
    return response.data;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  try {
    const response = await api.get('/resume/history');
    return response.data;
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw new Error("Failed to fetch resume");
  }
}

export async function improveWithAI({ current, type }) {
  const prompt = `
    As an expert resume writer, improve the following ${type} description.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const improvedContent = response.choices[0].message.content.trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}