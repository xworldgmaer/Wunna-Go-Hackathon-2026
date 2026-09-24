import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

export function firstText(message: Anthropic.Message): string {
  const block = message.content.find((part) => part.type === "text");
  if (!block || block.type !== "text") throw new Error("Claude returned no text block.");
  return block.text;
}
