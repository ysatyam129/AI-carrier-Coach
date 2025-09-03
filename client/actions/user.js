"use server";

import api from "../lib/auth";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  try {
    // Generate insights for new industry if needed
    if (data.industry) {
      await generateAIInsights(data.industry);
    }

    const response = await api.put('/user/profile', {
      industry: data.industry,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  try {
    const response = await api.get('/user/dashboard');
    const user = response.data;

    return {
      isOnboarded: !!user?.profile?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}