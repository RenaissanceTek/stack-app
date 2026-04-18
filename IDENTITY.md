# IDENTITY.md — stack-app

## What This Is

**Name:** stack-app
**Type:** Native mobile app (Expo + React Native) — shows in Replit's Mobile App template with phone-frame preview
**Stack:** Expo SDK 51 + React Native + TypeScript + Expo Router v3
**Deploy target:** Replit mobile template (phone-frame preview). Later: EAS Build → TestFlight → App Store.
**Status:** v2 rebuild 2026-04-18 — switched from Next.js PWA to Expo/React Native after v1 did not match Replit's mobile-app experience.

---

## Why Expo (not Next.js PWA)

The v1 was a Next.js PWA. Technically installable on iOS home screen, but in Replit it rendered as a normal web preview — not the phone-frame "Mobile App" experience the user wanted (reference: their prior "ONE WAY FIT APP" Replit project showed a phone mockup, "Simulate on Web", "Try on device").

Replit's Mobile App template = Expo + React Native + Expo Router, running `expo start --web` for preview. That is what this project now targets.

## Purpose

The product. Users pick a peptide stack, log injections, track outcomes. v2 is local-only (AsyncStorage, no backend, no auth) — we ship, validate, then add backend.

## Core features (v2 scope — port from v1 Next.js version)

1. **Onboarding** — splash with disclaimer, acknowledge to continue, pick a stack or start blank. Sets `onboarded:true` in AsyncStorage.
2. **Protocol library** — browse 4 seeded stacks (same data as stack-landing's `content/stacks.ts`).
3. **Stack detail** — full stack info + "Make this my active stack" button.
4. **Home / Dashboard** — today's scheduled doses, recent logs, streak counter.
5. **Dose logger** — peptide, dose amount+unit, site dropdown, datetime (default now), notes.
6. **Reconstitution calculator** — vial mg + bac water ml → volume (ml) + U-100 units for target dose. MUST include pure-function math with unit tests.
7. **Inventory** — list of vials, remaining mg auto-computed from logs.
8. **Injection site map** — simple body diagram (front view) with dots from recent logs.
9. **Settings** — units toggle, dark/light mode, export data (JSON), reset.

## Navigation

Bottom tab bar with 5 tabs: Home, Library, Log, Inventory, More (More = settings + sites + reconstitution).

## Data model (AsyncStorage)

Same shape as v1 localStorage — just storage adapter swapped:

```ts
type Peptide = { id, name, category, halfLifeHours? }
type SeedStack = { id, name, goal, summary, peptides[], timelineWeeks[], sources[] }
type LogEntry = { id, timestamp, peptideName, doseAmount, unit: 'mg'|'mcg', site, notes? }
type Vial = { id, peptideName, totalMg, remainingMg, bacWaterMl, reconstitutedAt?, expiresAt? }
```

Persist under `stack:v1:<key>` keys.

---

## Replit Mobile App template requirements

- `.replit` runs `npm run dev` where dev starts Expo web preview on port 5000, binding 0.0.0.0.
- `app.json` with Expo config — name, slug, version, icon placeholder.
- `package.json` with expo, react-native, expo-router, react-native-safe-area-context, @react-native-async-storage/async-storage.
- No browser-only APIs (no `window`, no `document`, no `localStorage`). Use React Native equivalents.

---

## Non-negotiables

- **No medical advice.** Splash disclaimer on first launch.
- **Reconstitution math must be correct.** Unit tests required.
- **Works offline.** It's a tracker; no network dep for core features.
- **No analytics, no tracking.**
- **No emojis in UI or code.**
- **No fake social proof / fake user counts.**

---

## File conventions

- `app/` — Expo Router screens (`_layout.tsx`, `(tabs)/*`, `onboarding.tsx`, `stack/[id].tsx`)
- `components/` — RN components
- `lib/storage.ts` — typed AsyncStorage wrapper
- `lib/reconstitution.ts` + `lib/reconstitution.test.ts`
- `content/stacks.ts` — same shape as stack-landing
- `.replit`, `replit.nix`, `app.json`, `package.json`
