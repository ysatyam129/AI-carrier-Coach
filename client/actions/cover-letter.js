"use server";

import { OpenAI } from "openai";
import api from "../lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCoverLetter(data) {
  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting
    6. Include specific examples of achievements
    
    Format the letter professionally.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;

    const coverLetter = await api.post('/skills/cover-letter', {
      ...data,
      content
    });

    return coverLetter.data;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  try {
    const response = await api.get('/skills/cover-letters');
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cover letters");
  }
}

export async function getCoverLetter(id) {
  try {
    const response = await api.get(`/skills/cover-letter/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch cover letter");
  }
}

export async function deleteCoverLetter(id) {
  try {
    const response = await api.delete(`/skills/cover-letter/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete cover letter");
  }
}