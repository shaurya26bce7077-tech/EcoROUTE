# EcoRoute — India-wide Hackathon MVP

EcoRoute is a no-auth, location-based surplus food exchange demo. Stores/donors post surplus food and consumers discover and claim it.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Supabase setup

This version does not use Supabase Auth.

1. Create your Supabase project.
2. Run `supabase/schema.sql` once.
3. Run `supabase/seed.sql` once for demo data.
4. Create `.env.local` from `.env.example`.
5. Add your Supabase URL and anon key.

If you already ran an older EcoRoute schema, do not blindly run this schema over it. For a clean hackathon database, drop `claims` and `listings`, then run `schema.sql` and `seed.sql` in separate SQL Editor queries.

## India-wide demo

The map opens on India and includes demo surplus listings across major cities. Use the city buttons to jump to a city or **Near me** to use the browser's location and show listings within 50 km of the user.

The current demo dataset is intentionally small. A production version should use PostGIS proximity/bounding-box queries and load only listings inside the current map viewport.

## New demo features: directions + reliability

1. Run your existing database first.
2. In Supabase SQL Editor, run `supabase/update_reliability.sql` once.
3. Start the app with `npm install` and `npm run dev`.

After claiming food, the user gets **Get directions** which opens Google Maps with the restaurant's latitude/longitude as the destination.

The no-auth hackathon prototype also gives each browser a persistent anonymous consumer ID. A new consumer starts at **100% reliability**. A completed pickup adds 2 points (up to 100), while a no-show removes 20 points. The **My claims** page shows the score and claim history.

For a production version, the pickup/no-show action should be confirmed by the store rather than self-reported, and the browser ID should be replaced by authenticated user accounts.
