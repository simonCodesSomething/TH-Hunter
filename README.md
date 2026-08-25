# Hot Wheels Hunter (MVP)

A cross-platform Expo app for identifying Treasure Hunt (TH) and Super Treasure
Hunt (STH) Hot Wheels cars while shopping, and tracking which ones you've found.

## What's in this MVP

- **Browse screen** — search + filter (All / TH / STH) over a bundled dataset
  of cars, each with ID tips.
- **Found checklist** — tap a card to mark it found; persists on-device with
  AsyncStorage, no backend or login required.
- **Cheat sheet screen** — quick reference on how to visually tell TH and STH
  cars apart, and general shopping tips.

## Getting started

```bash
cd hotwheels-hunter
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a
simulator/emulator, or `w` for a web preview.

## Before you ship

1. **Replace the placeholder dataset.** `src/data/thstData.json` has 3 sample
   entries. Swap in the real current-year TH/STH list with accurate names,
   series, and case letters.
2. **Add real photos.** The dataset currently has no `image` field wired up —
   only `imageKey: "placeholder"`. Photograph the cars yourself (see the note
   on Mattel image rights from earlier in this conversation) and either:
   - drop images in `src/assets/cars/` and reference them with `require()`, or
   - host them yourself and swap in image URLs.
3. **App icon & splash.** `app.json` points to `src/assets/icon.png`, which
   doesn't exist yet — add your own icon before building for the stores.
4. **Update `bundleIdentifier` / `package`** in `app.json` to your own
   reverse-domain identifiers before submitting to the App Store / Play Store.

## Suggested next milestones (post-MVP)

- Barcode scanning to cross-reference a specific car against the dataset.
- Crowdsourced "spotted near me" sightings (needs a backend).
- Push notification when a new year's TH/STH list is added.
- Price/value lookup integration.
