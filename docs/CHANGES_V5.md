# WunnaGo v5 changes — persistent microphone listening

The microphone implementation was updated because browser Web Speech recognition can end a session automatically after a short pause, even when the user did not tap Stop.

## What changed

- `SpeechRecognition.continuous` is now enabled.
- If the browser still ends a recognition session after silence, WunnaGo automatically starts a fresh session after a short delay.
- Listening only ends when the user taps the microphone again, or when a non-recoverable error occurs (permission denied, no microphone, unsupported language, or network failure).
- `no-speech` is treated as recoverable instead of stopping the microphone.
- Interim speech is displayed live while only final recognition results are carried between restarted sessions.
- The restart logic avoids duplicate words when a new browser recognition session begins.
- Manual stopping/aborting no longer surfaces a false microphone error.

## Demo advice

For the most reliable live demo, use current Chrome or Edge on HTTPS or localhost, grant microphone permission before the pitch, and test once on the exact presentation device/network.
