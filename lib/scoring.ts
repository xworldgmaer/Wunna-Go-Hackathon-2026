import type { Experience, RankedExperience, VisitorIntent } from "./types";

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

export function rankExperiences(
  items: Experience[],
  explicitInterests: string[],
  intent: VisitorIntent
): RankedExperience[] {
  const wanted = new Set(
    [...explicitInterests, ...intent.inferredInterests].map((x) => x.toLowerCase())
  );

  return items
    .map((experience) => {
      const overlap = experience.interests.filter((tag) => wanted.has(tag.toLowerCase())).length;
      const interestFit = wanted.size ? overlap / Math.max(1, Math.min(3, wanted.size)) : 0.45;

      const durationFit = intent.maxDurationMinutes
        ? experience.duration <= intent.maxDurationMinutes
          ? 1
          : clamp(1 - (experience.duration - intent.maxDurationMinutes) / 120)
        : 0.75;

      const budgetFit = intent.budgetUsd
        ? experience.price <= intent.budgetUsd
          ? 1
          : clamp(1 - (experience.price - intent.budgetUsd) / 60)
        : 0.75;

      const paceFit = intent.pace === "any" || intent.pace === experience.pace ? 1 : 0.55;
      const capacityRemaining = clamp(
        (experience.weeklyCapacity - experience.bookedThisWeek) / experience.weeklyCapacity
      );
      const exposureBoost = 1 - experience.recentExposure;

      // Deliberately avoids review-count popularity as a primary signal.
      // Fit dominates. Capacity and exposure create dispersal pressure.
      const score =
        interestFit * 0.42 +
        durationFit * 0.14 +
        budgetFit * 0.1 +
        paceFit * 0.1 +
        capacityRemaining * 0.12 +
        exposureBoost * 0.12;

      const reasons: string[] = [];
      if (overlap > 0) reasons.push(`matches ${experience.interests.find((t) => wanted.has(t))}`);
      if (intent.maxDurationMinutes && experience.duration <= intent.maxDurationMinutes)
        reasons.push(`${experience.duration} mins fits your time`);
      if (intent.budgetUsd && experience.price <= intent.budgetUsd)
        reasons.push(`within your $${intent.budgetUsd} budget`);
      if (capacityRemaining >= 0.5) reasons.push("host has capacity");
      if (experience.recentExposure <= 0.25) reasons.push("lower recent exposure");
      if (intent.pace !== "any" && intent.pace === experience.pace)
        reasons.push(`${experience.pace} pace`);

      return {
        ...experience,
        score,
        matchPercent: Math.round(72 + clamp(score, 0, 1) * 27),
        reasons: reasons.slice(0, 4)
      };
    })
    .sort((a, b) => b.score - a.score);
}
