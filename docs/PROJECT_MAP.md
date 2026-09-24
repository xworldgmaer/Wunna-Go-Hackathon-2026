# Project map

```text
wunnago-prototype/
├── app/
│   ├── api/
│   │   ├── host-profile/route.ts      # Claude: host answers -> structured listing + video script
│   │   ├── scan-id/route.ts           # Claude Vision: ID image -> visible fields (not verification)
│   │   └── visitor-intent/route.ts    # Claude: visitor language -> structured intent + ranked results
│   ├── globals.css                    # Full mobile prototype styling
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── VoiceField.tsx                 # Browser speech recognition with safe demo fallback
│   ├── Wordmark.tsx
│   └── WunnaGoApp.tsx                 # All prototype screens + navigation/state
├── lib/
│   ├── anthropic.ts                   # Server-side Anthropic client only
│   ├── demo.ts                        # Offline/demo fallback values
│   ├── experiences.ts                 # Small synthetic experience catalogue
│   ├── scoring.ts                     # Fit + capacity + exposure ranking
│   └── types.ts
├── public/
│   ├── demo-id.svg                    # Synthetic ID used in demo
│   └── assets/
│       ├── gloria.jpg                 # Image extracted from supplied Figma/PDF export
│       ├── id-front.svg / id-back.svg
│       └── pottery.svg / garden.svg / wood.svg / coast.svg / music.svg
├── docs/
│   ├── DEMO_SCRIPT.md
│   └── PROJECT_MAP.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
