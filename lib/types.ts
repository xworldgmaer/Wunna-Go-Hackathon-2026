export type Interest =
  | "food and drink"
  | "craft and making"
  | "music and dance"
  | "quiet and slow"
  | "nature and hikes"
  | "history and heritage"
  | "sports and games"
  | "fishing and sea"
  | "art and photography";

export type VisitorIntent = {
  summary: string;
  inferredInterests: string[];
  maxDurationMinutes: number | null;
  budgetUsd: number | null;
  pace: "quiet" | "relaxed" | "active" | "any";
  accessibilityNeeds: string[];
  experienceStyle: string[];
  avoid: string[];
};

export type Experience = {
  id: string;
  title: string;
  host: string;
  parish: string;
  price: number;
  duration: number;
  description: string;
  shortDescription: string;
  interests: string[];
  pace: "quiet" | "relaxed" | "active";
  accessibility: string[];
  weeklyCapacity: number;
  bookedThisWeek: number;
  recentExposure: number;
  rating: number;
  reviews: number;
  image: string;
  fallbackImage?: string;
  reviewQuote: string;
  reviewer: string;
};

export type RankedExperience = Experience & {
  score: number;
  matchPercent: number;
  reasons: string[];
};

export type HostProfile = {
  title: string;
  summary: string;
  category: string;
  interests: string[];
  durationMinutes: number;
  groupSize: number;
  pace: "quiet" | "relaxed" | "active";
  setting: string;
  culturalThemes: string[];
  accessibilityQuestions: string[];
  safetyFlags: string[];
  recordingScript: string;
};

export type IdExtraction = {
  documentType: string;
  fullName: string;
  country: string;
  dateOfBirth: string;
  expiryDate: string;
  documentNumberMasked: string;
  confidenceNote: string;
};
