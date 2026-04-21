# Sugbo Move

Traffic-aware route comparison app for Cebu, built with React + TypeScript + Vite.

## Architecture

- Frontend: React + Vite (`src/`)
- Backend API: Express server (`server/index.js`)
- Map provider: Mapbox Directions API with `mapbox/driving-traffic`

Mapbox tokens are now backend-only. The browser calls `/api/routes/compare`, and the Express server calls Mapbox.

## Dynamic Trip Flow

The Home screen now sends user-entered `origin` and `destination` to Route Comparison.
Route Comparison fetches live route alternatives and computes all metrics dynamically per trip.

Dynamic values now include:
- Distance (km)
- Estimated travel time (minutes)
- Fuel cost (PHP) based on distance and vehicle efficiency
- CO2 output estimate
- Best-balance recommendation score

## Setup

1. Create a local env file from `.env.example`.
2. Add your backend env values:

```env
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
PORT=8787
```

3. Install dependencies:

```bash
npm install
```

4. Start frontend + backend together:

```bash
npm run dev:full
```

## Notes

- Vite proxies `/api` to `http://localhost:8787` in development.
- If the backend cannot reach Mapbox, Route Comparison falls back to local estimates.
- Backend route comparison endpoint: `POST /api/routes/compare`.
