# WunnaGo v4 changes

## Experience imagery

The non-Gloria discovery cards now use relevant photographic placeholder imagery rather than text-only SVG placeholders:

- Janelle: pottery / clay workshop
- Omar: garden / fresh herbs
- Keisha: woodworking / craft workshop
- Island Day: beach cookout
- Marcus: music rehearsal

The photos are loaded from Pexels at runtime. Every card still has the original local SVG as an automatic fallback, so a failed photo request will not leave a blank card during the demo.

Photo source pages:
- Pottery: Pexels photo 4706135
- Garden: Pexels photo 32140331
- Woodworking: Pexels photo 7496747
- Beach cookout: Pexels photo 9629967
- Music rehearsal: Pexels photo 6270139

## Shorter titles and name fitting

Experience titles were shortened so they read naturally on narrow mobile screens:

- Pottery with Janelle
- Garden with Omar
- Woodcraft with Keisha
- Coast cookout
- Rehearsal with Marcus

Spanish and French versions were shortened as well.

The discovery card now gives the experience title and price separate layout space, clamps the title to two lines, and keeps the price visible. Host names are constrained with ellipsis if a future name is unusually long. The booking heading uses the same mobile-safe treatment and stacks on very narrow screens.
