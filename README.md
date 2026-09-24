# WunnaGo finalist prototype

A mobile-first Next.js prototype based on the supplied WunnaGo Figma screens. It demonstrates the parts that matter most in a live judging environment: voice-to-intent, AI-assisted host onboarding, fair-discovery ranking, booking interaction, and ID field extraction.

## What actually works

- Visitor / Host role selection and screen flow.
- Visitor interest selection (up to five).
- Browser voice input (where Web Speech Recognition is available).
- Claude converts free-form visitor language into structured preferences.
- A deterministic recommendation layer ranks a small synthetic catalogue by **fit + capacity + recent exposure**, not raw popularity.
- Swipeable experience cards and a functioning demo booking interaction.
- Host ID image upload/camera capture. Claude Vision extracts visible fields only.
- Host voice/text answers are converted by Claude into a structured listing, tags, questions, safety flags and a short video script.
- Demo fallbacks keep the presentation working when there is no API key, the network drops, or speech recognition is unavailable.

## Important: API key safety

Keep the Anthropic key **server-side only**. Do not paste the key into this README, GitHub, Figma, browser code, or any `NEXT_PUBLIC_...` variable.

1. Copy `.env.example` to `.env.local`.
2. Put the team key in `.env.local`:

```bash
ANTHROPIC_API_KEY=your_real_team_key_here
ANTHROPIC_MODEL=claude-sonnet-5
```

`.env.local` is ignored by Git.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production build

```bash
npm run typecheck
npm run build
npm start
```

## Deploy to Vercel

1. Push this folder to a private GitHub repository (without `.env.local`).
2. Import the repository into Vercel.
3. Add `ANTHROPIC_API_KEY` and optionally `ANTHROPIC_MODEL` in **Project Settings -> Environment Variables**.
4. Deploy.

## Demo-safe behavior

The API routes use Claude when a valid `ANTHROPIC_API_KEY` is available. If it is missing or a Claude request fails, they return polished deterministic fallback data instead. The interface labels the result as `Claude live` or `Demo fallback` so you can be transparent during judging.

The ID flow is **document field extraction, not identity verification**. Use `Use demo ID` during the presentation unless you have explicit permission to process another person's document.

## Where to change things

- Add/edit experiences: `lib/experiences.ts`
- Change ranking weights: `lib/scoring.ts`
- Change Claude prompts/schemas: `app/api/*/route.ts`
- Change visual design: `app/globals.css`
- Change screen flow/copy: `components/WunnaGoApp.tsx`

See `docs/DEMO_SCRIPT.md` for a suggested live presentation flow and `docs/PROJECT_MAP.md` for the directory map.

## Prototype interaction notes

- The app now runs directly as a **mobile-first full-viewport interface**. There is no simulated phone bezel/frame.
- The language selector on the start screen switches the interface between **English, Spanish and French**. The selected language also changes browser speech recognition and is sent to Claude so live AI summaries/listings are returned in that language. Demo fallback content is localized too.
- Tap the **WunnaGo logo** from any screen to return to the start screen.
- Authentication is intentionally mocked for the hackathon demonstration: **any email/password values, including blank fields, can proceed**. Both `LOGIN` and `New here? Sign up` advance according to the selected Visitor/Host role.

## Real microphone / speech-to-text

The microphone buttons now request the device microphone and use the browser's Web Speech API to transcribe speech directly into the active field. Tap once to start and tap again to stop.

For microphone access, run the app from `http://localhost:3000` during local development or deploy it over **HTTPS**. The browser will ask for microphone permission the first time. SpeechRecognition is not supported equally in every browser, so Chrome/Chromium is the safest presentation browser. If speech recognition is unavailable, the field remains typeable and the prototype offers an explicit demo-text fallback rather than silently pretending that speech was recognized.

## Experience card imagery and mobile title fitting

The demo catalogue now uses relevant photographic placeholder images for pottery, gardening, woodworking, a beach cookout and a music rehearsal. These are remote Pexels images with local SVG fallbacks, so a failed photo request will still show a designed experience image instead of a blank card.

Experience titles have also been shortened and the discovery/booking headings are constrained for narrow phones. Titles can use up to two lines while the price remains visible, and unusually long host names truncate safely rather than breaking the card layout.

## v5 microphone reliability

Voice fields now use persistent listening. If the browser's speech-recognition service ends after a pause, the app automatically opens another recognition session until the user taps the microphone to stop. See `docs/CHANGES_V5.md`.


## v6 navigation fix
The visitor bottom navigation is fixed to the bottom of the visible screen on Discover and Booking, including mobile safe-area handling.
