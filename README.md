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

## Supabase REST connection

Copy [`.env.example`](.env.example) to `.env` and set the Supabase project URL
and anonymous key from **Project Settings > API**. Expo exposes variables with
the `EXPO_PUBLIC_` prefix to the app at build time. Restart Expo after changing
the file.

## Supabase cars table

1. Open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
2. Generate the import file with `npm run export:cars`.
3. In Supabase, open the `cars` table, choose **Import data from CSV**, and select [`supabase/cars.csv`](supabase/cars.csv).

The schema enables read access for the app's anonymous and authenticated clients.
Keep write access restricted to the Supabase dashboard or server-side tooling.

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
