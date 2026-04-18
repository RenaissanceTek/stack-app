# IDENTITY.md — stack-app

## What This Is

**Name:** stack-app
**Type:** Installable PWA (progressive web app) — the actual Stack tracker
**Stack:** Next.js 14 (app router) + Tailwind CSS + TypeScript + PWA manifest + next-pwa for service worker
**Deploy target:** Replit (via GitHub import). Later: wrap in Capacitor/React Native for App Store.
**Status:** v1 build in progress — 2026-04-18

---

## Purpose

The product. Users pick a peptide stack, log injections, track outcomes, compare to community. v1 is local-only (localStorage, no backend, no auth) — we ship, validate, then add backend.

## Core features (v1)

1. **Onboarding** — pick a stack from the library, or start blank.
2. **Protocol library** — browse/filter 3-4 seeded stacks (same data shape as `stack-landing/content/stacks.ts`).
3. **Stack dashboard** — active stack view: today's scheduled doses, progress chart, streak.
4. **Dose logger** — one-tap log: peptide, dose (mg/mcg), injection site, time, notes. Stored in localStorage.
5. **Reconstitution calculator** — vial mg + bacteriostatic water ml → units on U-100 syringe for target dose. This must be **bulletproof** (math errors = user harm). Include worked examples.
6. **Inventory** — list of vials, amount remaining, expiration.
7. **Injection site map** — body diagram with dots showing last N injection sites (rotation reminder).
8. **Settings** — dark mode, units (mg/mcg), export data (JSON download).

## PWA requirements

- `manifest.json` with icons (192, 512, maskable), theme color, standalone display mode.
- Service worker via `next-pwa` (offline shell, cached assets).
- iOS meta tags: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, apple-touch-icon.
- Installable from mobile Safari: "Add to Home Screen" flow works.

## Data model (v1, localStorage)

```ts
type Peptide = { id, name, category, halfLifeHours }
type Stack = { id, name, description, peptides: {peptideId, dose, frequency, unit}[], sources: string[] }
type LogEntry = { id, timestamp, peptideId, doseAmount, unit, site, notes? }
type Vial = { id, peptideId, totalMg, remainingMg, bacWaterMl, reconstitutedAt, expiresAt }
```

Persist as JSON under `stack:v1:<key>` in localStorage.

---

## Non-negotiables

- **No medical advice.** Splash on first launch: "For educational/tracking use. Consult a licensed provider before any protocol."
- **Reconstitution math must be correct.** Unit tests for the calculator.
- **Offline-first.** Nothing should break if user has no network (it's a tracker).
- **No analytics trackers on v1** — we have no backend. Privacy-by-default.
- **No crashes on empty state.** First-time users must see clean empty states, not errors.

---

## File conventions

- `app/` — app router pages (`/`, `/library`, `/stack/[id]`, `/log`, `/tools/reconstitution`, `/inventory`, `/settings`)
- `components/`
- `lib/storage.ts` — localStorage wrapper, typed.
- `lib/reconstitution.ts` — pure math, with tests.
- `content/stacks.ts` — seeded protocol library (same shape as landing page).
- `public/manifest.json`, `public/icons/*`
- `.replit` + `replit.nix`
