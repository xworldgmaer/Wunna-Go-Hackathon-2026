from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic
import json
import os

load_dotenv()
app = FastAPI()
client = anthropic.Anthropic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    text = next((b.text for b in response.content if b.type == "text"), "")
    return {"reply": text}


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

LISTINGS_FILE = "listings.json"

def load_listings():
    if not os.path.exists(LISTINGS_FILE):
        return []
    with open(LISTINGS_FILE) as f:
        return json.load(f)

def write_listings(data):
    with open(LISTINGS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def save_listing(listing):
    data = load_listings()
    listing.setdefault("times_shown", 0)
    data.append(listing)
    write_listings(data)


@app.post("/api/generate-listing")
def generate_listing(req: TranscriptRequest):
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": EXTRACTION_PROMPT + req.transcript}
        ]
    )
    raw = next((b.text for b in response.content if b.type == "text"), "").strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        listing = json.loads(raw)
    except json.JSONDecodeError as e:
        print("---- RAW CLAUDE OUTPUT THAT FAILED TO PARSE (generate-listing) ----")
        print(raw)
        print("---------------------------------------------------------------------")
        raise HTTPException(status_code=500, detail=f"Could not parse Claude's response as JSON: {str(e)}")

    listing["host_name"] = req.host_name
    save_listing(listing)
    return listing


@app.get("/api/listings")
def get_listings():
    return load_listings()


class MatchRequest(BaseModel):
    intent: str
    interests: list[str] = []


MATCH_PROMPT_TEMPLATE = """You are matching a visitor's request to a set of local host experiences in Barbados.

Visitor's free-text request: "{intent}"
Visitor's selected interest tags (may be empty): {interests}

Here are the available host listings, as JSON:
{listings_json}

Rank the listings by genuine fit to what the visitor actually wants — not just keyword overlap. Read the visitor's intent for meaning, tone, and what they're hoping to feel, not just topics mentioned.

Return ONLY a JSON array, ranked best match first, in this exact shape — no preamble, no markdown fences:

[
  {{
    "title": "must exactly match a listing's title field above",
    "reason": "one short sentence, written TO the visitor, explaining why this fits what they asked for. Be specific to what they said, not generic.",
    "fit_score": integer from 1-5, where 5 is an excellent fit
  }}
]

Include every listing provided, even weak matches (give those a low fit_score and an honest reason, e.g. "less of a fit — this is quiet and slow, not high energy"). Do not invent listings that are not in the data provided.
"""

@app.post("/api/match")
def match_listings(req: MatchRequest):
    all_listings = load_listings()
    if not all_listings:
        return []

    lean_listings = [
        {
            "title": l.get("title"),
            "host_type": l.get("host_type"),
            "description": l.get("description"),
            "duration_minutes": l.get("duration_minutes"),
            "location_type": l.get("location_type"),
            "suitable_for": l.get("suitable_for", []),
            "physical_demand": l.get("physical_demand"),
        }
        for l in all_listings
    ]

    prompt = MATCH_PROMPT_TEMPLATE.format(
        intent=req.intent,
        interests=json.dumps(req.interests),
        listings_json=json.dumps(lean_listings, indent=2)
    )

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    raw = next((b.text for b in response.content if b.type == "text"), "").strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        ranked = json.loads(raw)
    except json.JSONDecodeError as e:
        print("---- RAW CLAUDE OUTPUT THAT FAILED TO PARSE (match) ----")
        print(raw)
        print("----------------------------------------------------------")
        raise HTTPException(status_code=500, detail=f"Could not parse match response: {str(e)}")

    by_title = {l["title"]: l for l in all_listings}
    results = []
    for r in ranked:
        full = by_title.get(r.get("title"))
        if not full:
            continue
        exposure_bonus = 0.3 if full.get("times_shown", 0) == 0 else 0.0
        results.append({
            **full,
            "reason": r.get("reason", ""),
            "fit_score": r.get("fit_score", 3),
            "adjusted_score": r.get("fit_score", 3) + exposure_bonus
        })

    results.sort(key=lambda x: x["adjusted_score"], reverse=True)

    shown_titles = {r["title"] for r in results}
    for l in all_listings:
        if l["title"] in shown_titles:
            l["times_shown"] = l.get("times_shown", 0) + 1
    write_listings(all_listings)

    return results


class ScriptRequest(BaseModel):
    title: str


SCRIPT_PROMPT_TEMPLATE = """Write a short, warm, natural script for a Barbadian host to read aloud while recording a 30-45 second intro video for visitors browsing an app.

It should be first person, casual and genuine like talking to someone who just walked up, not a sales pitch or an ad. About 70-90 words. No stage directions, no headers, just the words to say.

Base it on this experience:
{listing_json}

Return ONLY the script text, nothing else.
"""

@app.post("/api/host-script")
def host_script(req: ScriptRequest):
    all_listings = load_listings()
    match = next((l for l in all_listings if l.get("title") == req.title), None)
    if not match:
        raise HTTPException(status_code=404, detail="Listing not found")

    lean = {
        "title": match.get("title"),
        "host_name": match.get("host_name"),
        "host_type": match.get("host_type"),
        "description": match.get("description"),
        "duration_minutes": match.get("duration_minutes"),
        "what_to_bring": match.get("what_to_bring"),
    }

    prompt = SCRIPT_PROMPT_TEMPLATE.format(listing_json=json.dumps(lean, indent=2))

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    text = next((b.text for b in response.content if b.type == "text"), "").strip()
    return {"script": text}


class TranslateRequest(BaseModel):
    text: str
    target_language: str
    context: str = "casual, warm tourism listing"

@app.post("/api/translate")
def translate(req: TranslateRequest):
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""Translate the following into {req.target_language}. 
Context: {req.context}. 
Keep the warmth and informality of the original — this is not a legal or technical document, 
it's a personal invitation from a local host to a visitor. 
Return ONLY the translated text, nothing else.

Text: {req.text}"""
        }]
    )
    text = next((b.text for b in response.content if b.type == "text"), "")
    return {"translated": text.strip()}