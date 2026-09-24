import { NextResponse } from "next/server";
import { firstText, getAnthropic, MODEL } from "@/lib/anthropic";
import { demoIdExtraction } from "@/lib/demo";
import type { IdExtraction } from "@/lib/types";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentType: { type: "string" },
    fullName: { type: "string" },
    country: { type: "string" },
    dateOfBirth: { type: "string" },
    expiryDate: { type: "string" },
    documentNumberMasked: { type: "string" },
    confidenceNote: { type: "string" }
  },
  required: [
    "documentType",
    "fullName",
    "country",
    "dateOfBirth",
    "expiryDate",
    "documentNumberMasked",
    "confidenceNote"
  ]
};

const supported = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const client = getAnthropic();
  let extracted: IdExtraction = demoIdExtraction;
  let mode: "claude" | "demo-fallback" = "demo-fallback";

  try {
    const form = await request.formData();
    const image = form.get("image");

    if (client && image instanceof File && supported.has(image.type)) {
      const bytes = Buffer.from(await image.arrayBuffer());
      const base64 = bytes.toString("base64");

      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 700,
        system:
          "You are performing document field extraction for a hackathon prototype. This is NOT identity verification. Extract only fields visibly present. If a value is unreadable, return 'Unreadable'. Mask document numbers except the final four visible characters. Never claim authenticity or government validation.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: image.type,
                  data: base64
                }
              },
              {
                type: "text",
                text: "Extract the visible identity-document fields. State clearly in confidenceNote that this is extraction only and needs host/manual confirmation."
              }
            ]
          }
        ],
        output_config: {
          format: { type: "json_schema", schema }
        }
      } as any);

      extracted = JSON.parse(firstText(message)) as IdExtraction;
      mode = "claude";
    }
  } catch (error) {
    console.error("scan-id Claude call failed; using demo fallback", error);
  }

  return NextResponse.json({ extracted, mode });
}
