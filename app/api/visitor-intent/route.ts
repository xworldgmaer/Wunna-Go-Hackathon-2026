import { NextResponse } from "next/server";
import { firstText, getAnthropic, MODEL } from "@/lib/anthropic";
import { demoVisitorIntent } from "@/lib/demo";
import { experiences } from "@/lib/experiences";
import { rankExperiences } from "@/lib/scoring";
import type { VisitorIntent } from "@/lib/types";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    inferredInterests: { type: "array", items: { type: "string" } },
    maxDurationMinutes: { anyOf: [{ type: "integer" }, { type: "null" }] },
    budgetUsd: { anyOf: [{ type: "number" }, { type: "null" }] },
    pace: { type: "string", enum: ["quiet", "relaxed", "active", "any"] },
    accessibilityNeeds: { type: "array", items: { type: "string" } },
    experienceStyle: { type: "array", items: { type: "string" } },
    avoid: { type: "array", items: { type: "string" } }
  },
  required: [
    "summary",
    "inferredInterests",
    "maxDurationMinutes",
    "budgetUsd",
    "pace",
    "accessibilityNeeds",
    "experienceStyle",
    "avoid"
  ]
};

export async function POST(request: Request) {
  const body = await request.json();
  const interests = Array.isArray(body.interests) ? body.interests.map(String) : [];
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const language = typeof body.language === "string" ? body.language : "English";
  const client = getAnthropic();

  let intent: VisitorIntent = demoVisitorIntent;
  let mode: "claude" | "demo-fallback" = "demo-fallback";

  if (client) {
    try {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 700,
        system:
          `You interpret visitor intent for WunnaGo, a Caribbean micro-experience discovery prototype. Extract practical preferences from natural language. Do not invent strict constraints that were not stated. Map inferredInterests toward this canonical English vocabulary when appropriate: food and drink, craft and making, music and dance, quiet and slow, nature and hikes, history and heritage, sports and games, fishing and sea, art and photography. Keep inferredInterests in that English vocabulary for matching, but write the summary in ${language}.`,
        messages: [
          {
            role: "user",
            content: `Selected interests: ${interests.join(", ") || "none"}\nOpen-ended visitor note: ${note || "No extra note provided."}`
          }
        ],
        output_config: {
          format: { type: "json_schema", schema }
        }
      } as any);

      intent = JSON.parse(firstText(message)) as VisitorIntent;
      mode = "claude";
    } catch (error) {
      console.error("visitor-intent Claude call failed; using demo fallback", error);
    }
  }

  const ranked = rankExperiences(experiences, interests, intent).slice(0, 5);
  return NextResponse.json({ intent, ranked, mode });
}
