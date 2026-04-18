# Stack

Peptide protocol tracker. Pick a stack, log injections, track outcomes. Local-only (AsyncStorage) — no backend, no auth.

Built with Expo SDK 51 + React Native + Expo Router v3 + TypeScript.

## Run locally

```
npm install
npm run dev
```

Opens Expo web preview on port 5000.

On Replit, the Mobile App template auto-detects the Expo config and opens the phone-frame preview with "Simulate on Web" and "Try on device" buttons.

## Test

```
npm test
```

Runs the reconstitution calculator math tests.

## Structure

- `app/` — Expo Router screens
- `components/` — shared RN components
- `content/stacks.ts` — seeded stack data
- `lib/storage.ts` — typed AsyncStorage wrapper
- `lib/reconstitution.ts` — pure math for the calculator
