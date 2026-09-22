from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic
import json

load_dotenv()
app = FastAPI()
client = anthropic.Anthropic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for a hackathon demo; tighten later if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
def test():
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=100,
        messages=[{"role": "user", "content": "Say hello in one sentence."}]
    )
    return {"reply": response.content[0].text}


class TranscriptRequest(BaseModel):
    transcript: str
    host_name: str = ""


EXTRACTION_PROMPT = """You are helping turn a spoken description from a Barbadian host into a structured experience listing for visitors.

The host spoke freely about what they do. Extract the following as JSON only — no preamble, no markdown fences, just the raw JSON object:

{
  "title": "short, inviting title for the experience",
  "host_type": "one of: fisherman, home cook, craftsperson, gardener, musician, mechanic, farmer, other",
  "description": "2-3 sentences in warm, inviting language, written in third person",
  "duration_minutes": integer estimate based on what they described,
  "location_type": "home, workshop, boat, garden, outdoors, other",
  "best_time": "e.g. early morning, afternoon, evening — infer from context if mentioned",
  "what_to_bring": "brief list or 'nothing needed'",
  "suitable_for": ["tags like: families, solo travelers, food lovers, culture seekers, adventurous"],
  "physical_demand": "low, moderate, high",
  "fee_note": "extract if mentioned, else 'ask host'",
  "confidence_flags": ["list anything you had to guess or infer rather than the host stating directly"]
}

Only include information the host actually conveyed or reasonably implied. Do not invent specifics they didn't mention. If something is genuinely unclear, put it in confidence_flags rather than guessing silently.

Transcript:
"""

@app.post("/api/generate-listing")
def generate_listing(req: TranscriptRequest):
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": EXTRACTION_PROMPT + req.transcript}
        ]
    )
    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    listing = json.loads(raw)
    listing["host_name"] = req.host_name
    return listing