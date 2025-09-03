"use server";

import { OpenAI } from "openai";
import api from "../lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const text = response.choices[0].message.content;
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    // Fallback data
    return {
      salaryRanges: [
        { role: "Frontend Developer", min: 60000, max: 120000, median: 85000, location: "US" },
        { role: "Backend Developer", min: 70000, max: 140000, median: 95000, location: "US" },
        { role: "Full Stack Developer", min: 65000, max: 130000, median: 90000, location: "US" },
        { role: "DevOps Engineer", min: 80000, max: 150000, median: 110000, location: "US" },
        { role: "Data Scientist", min: 85000, max: 160000, median: 115000, location: "US" }
      ],
      growthRate: 15,
      demandLevel: "High",
      topSkills: ["JavaScript", "Python", "React", "Node.js", "AWS"],
      marketOutlook: "Positive",
      keyTrends: ["AI Integration", "Cloud Computing", "Remote Work", "Microservices", "DevOps"],
      recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL", "Machine Learning"]
    };
  }
};

export async function getIndustryInsights() {
  try {
    const response = await api.get('/user/dashboard/public');
    const user = response.data;
    
    const insights = await generateAIInsights(user.profile?.industry || 'Technology');
    
    return insights;
  } catch (error) {
    throw new Error("Failed to get industry insights");
  }
}