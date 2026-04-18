# Stack — Peptide Protocol Tracker

A PWA for tracking peptide protocols. v1 is local-only (no backend, no account) — data lives in your browser.

## What you get

- Curated protocol library (4 seeded stacks)
- Dose logger with injection-site rotation map
- Reconstitution calculator (U-100 syringe units)
- Vial inventory with remaining-amount tracking
- Export all data as JSON

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Running tests

```bash
npm test
```

Reconstitution math is covered by unit tests. They must all pass.

## Install on iOS

On iPhone, open the deployed URL in Safari, tap Share, tap Add to Home Screen. The app will launch full-screen from your home screen.

## Tech stack

- Next.js 14 (app router)
- TypeScript (strict)
- Tailwind CSS
- next-pwa for service worker + manifest
- vitest for unit tests

## Disclaimer

Educational and tracking use only. Not medical advice. Consult a licensed provider before starting any protocol.
