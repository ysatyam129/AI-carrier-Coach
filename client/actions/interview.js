"use server";

import { OpenAI } from "openai";
import api from "../lib/auth";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuiz() {
  const prompt = `
    Generate 10 technical interview questions for a software professional.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const text = response.choices[0].message.content;
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  try {
    const questionResults = questions.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

    let improvementTip = null;
    if (wrongAnswers.length > 0) {
      const improvementPrompt = `
        Based on these wrong answers in technical interview, provide a concise improvement tip.
        Focus on knowledge gaps. Keep under 2 sentences and make it encouraging.
      `;

      const tipResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: improvementPrompt }],
        temperature: 0.7,
        max_tokens: 100
      });

      improvementTip = tipResponse.choices[0].message.content.trim();
    }

    const assessment = await api.post('/interview/quiz/result', {
      quizScore: score,
      questions: questionResults,
      category: "Technical",
      improvementTip,
    });

    return assessment.data;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  try {
    const response = await api.get('/interview/performance');
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}