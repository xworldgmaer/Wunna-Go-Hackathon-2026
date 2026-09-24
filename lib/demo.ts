import type { HostProfile, IdExtraction, VisitorIntent } from "./types";

export const demoVisitorIntent: VisitorIntent = {
  summary: "Local, relaxed and personal, with a preference for food and shorter experiences.",
  inferredInterests: ["food and drink", "quiet and slow", "history and heritage"],
  maxDurationMinutes: 120,
  budgetUsd: 30,
  pace: "relaxed",
  accessibilityNeeds: ["low physical exertion"],
  experienceStyle: ["personal", "authentic", "small-group"],
  avoid: ["long high-intensity tours"]
};

export const demoHostProfile: HostProfile = {
  title: "Make fishcakes with Gloria",
  summary:
    "Pull up at Gloria's stall, learn how she seasons and fries a batch of traditional Bajan fishcakes, then eat them hot from the pan.",
  category: "Food & Drink",
  interests: ["food and drink", "history and heritage", "quiet and slow"],
  durationMinutes: 30,
  groupSize: 4,
  pace: "relaxed",
  setting: "local food stall",
  culturalThemes: ["Barbadian cooking", "everyday food culture"],
  accessibilityQuestions: ["Is step-free access available at the stall?"],
  safetyFlags: ["hot oil / cooking surface — host supervision required"],
  recordingScript:
    "Hi, I'm Gloria. I've been making fishcakes for more than 15 years. Come pull up by my stall and I'll show you how I season, mix and fry a proper batch. We'll keep it small and relaxed, and best of all, you get to eat them hot from the pan."
};

export const demoIdExtraction: IdExtraction = {
  documentType: "Demo national ID",
  fullName: "Gloria Sample",
  country: "Barbados",
  dateOfBirth: "1981-06-14",
  expiryDate: "2031-06-14",
  documentNumberMasked: "•••• 4821",
  confidenceNote: "Demo extraction only — ready for host confirmation, not government verification."
};
