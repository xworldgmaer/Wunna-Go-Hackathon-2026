# WunnaGo finalist demo flow

This prototype is optimized for a short live hackathon demonstration. It intentionally mixes working AI features with safe demo fallbacks.

## 1. Visitor journey (about 90 seconds)

1. Select **Visitor** and log in.
2. Keep **food and drink**, **craft and making**, and **history and heritage** selected.
3. Tap the microphone and say something like:
   > I'm with my mum, nothing too strenuous. We have about two hours and want something local and relaxed, maybe food, under thirty dollars.
4. Press **Continue**.
5. Point out that WunnaGo visibly considers **interests, time/pace, host capacity and recent exposure**.
6. On the discovery card, explain the **Why WunnaGo picked this** box.
7. Swipe to show that a very popular high-exposure experience can rank below a better-fitting lower-exposure host.
8. Open Gloria's experience and select a date/time.

## 2. Host journey (about 2 minutes)

1. Return to login, select **Host**, and log in.
2. On the ID screen, use **Use demo ID**. This is document field extraction only; do not describe it as government/KYC verification.
3. Confirm the extracted synthetic fields.
4. Answer the three host questions by voice. Suggested answers:
   - What do you make or do? "I make fishcakes at my stall and I can show people how I season and fry them."
   - How long? "I've been doing it for over 15 years."
   - What should a visitor expect? "Small groups, relaxed, about half an hour. We make a batch together and eat them hot from the pan."
5. Press **Next** and show Claude converting the answers into a structured listing.
6. Point out that accessibility questions and safety flags are **for host review**, not auto-published facts.
7. Approve the profile and open **get your script and record** to show the generated 30–60 second host script.

## 3. Judge-friendly explanation

- AI is doing extraction, classification and matching rather than acting as a generic chatbot.
- The ranking deliberately uses visitor fit plus capacity and recent exposure; review count is not the primary ranking signal.
- The prototype falls back to deterministic demo data if the API is unavailable, so the live demonstration does not depend on venue Wi‑Fi.
