import { NextResponse } from "next/server";
import { firstText, getAnthropic, MODEL } from "@/lib/anthropic";
import { demoHostProfile } from "@/lib/demo";
import type { HostProfile } from "@/lib/types";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    category: { type: "string" },
    interests: { type: "array", items: { type: "string" } },
    durationMinutes: { type: "integer" },
    groupSize: { type: "integer" },
    pace: { type: "string", enum: ["quiet", "relaxed", "active"] },
    setting: { type: "string" },
    culturalThemes: { type: "array", items: { type: "string" } },
    accessibilityQuestions: { type: "array", items: { type: "string" } },
    safetyFlags: { type: "array", items: { type: "string" } },
    recordingScript: { type: "string" }
  },
  required: [
    "title",
    "summary",
    "category",
    "interests",
    "durationMinutes",
    "groupSize",
    "pace",
    "setting",
    "culturalThemes",
    "accessibilityQuestions",
    "safetyFlags",
    "recordingScript"
  ]
};

export async function POST(request: Request) {
  const body = await request.json();
  const what = String(body.what || "").trim();
  const howLong = String(body.howLong || "").trim();
  const expect = String(body.expect || "").trim();
  const language = typeof body.language === "string" ? body.language : "English";
  const client = getAnthropic();

  let profile: HostProfile = demoHostProfile;
  let mode: "claude" | "demo-fallback" = "demo-fallback";

  if (client) {
    try {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 1100,
        system:
          `You turn a Caribbean host's informal answers into a clear, warm WunnaGo micro-experience listing. Preserve the host's meaning and voice; do not invent credentials, history, precise accessibility claims, or safety guarantees. Infer useful tags and surface uncertainties as questions. Keep the experience short and personal. Produce a 30-60 second recording script in plain language that sounds natural aloud. Write all user-facing text in ${language}. Keep pace as one of the required English enum values quiet, relaxed, or active.`,
        messages: [
          {
            role: "user",
            content: [
              `What do you make or do? ${what || "I make fishcakes at my stall."}`,
              `How long have you been doing this? ${howLong || "Over 15 years."}`,
              `What should a visitor expect? ${expect || "I show a small group how I season and fry them, then we eat them hot."}`
            ].join("\n")
          }
        ],
        output_config: {
          format: { type: "json_schema", schema }
        }
      } as any);

      profile = JSON.parse(firstText(message)) as HostProfile;
      mode = "claude";
    } catch (error) {
      console.error("host-profile Claude call failed; using demo fallback", error);
    }
  }

  return NextResponse.json({ profile, mode });
}
