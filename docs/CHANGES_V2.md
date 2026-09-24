# WunnaGo prototype — requested interaction update

This revision implements the requested demo changes:

1. Removed the simulated phone/device frame. The app now uses the browser viewport as a mobile-first canvas.
2. Made the start-screen language control functional with English, Spanish and French UI localization.
3. Passed the selected language to browser speech recognition and Claude API prompts.
4. Localized deterministic fallback visitor/host content and the fixed demo experience catalogue so the translator still demonstrates correctly without an API key.
5. Made every WunnaGo wordmark/logo clickable and return to the start screen.
6. Made login fields editable with no validation for the prototype. Any text, invalid text, or blank values proceed.
7. Made the `New here? Sign up` action proceed through the same selected Visitor/Host onboarding flow without validating fields.
