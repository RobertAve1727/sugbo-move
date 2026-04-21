import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8787;

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

const FUEL_PRICE_PER_LITER_PHP = 68;
const VEHICLE_EFFICIENCY_KM_PER_LITER = 15.4;
const CO2_KG_PER_LITER_GASOLINE = 2.31;

const METRO_CEBU_BBOX = "123.75,10.18,124.02,10.42";

app.use(cors());
app.use(express.json());

const normalizeNumber = (value, digits = 1) => Number(value.toFixed(digits));

const toFuelCostPhp = (distanceKm) => {
  const litersUsed = distanceKm / VEHICLE_EFFICIENCY_KM_PER_LITER;
  return litersUsed * FUEL_PRICE_PER_LITER_PHP;
};

const toCo2Kg = (distanceKm) => {
  const litersUsed = distanceKm / VEHICLE_EFFICIENCY_KM_PER_LITER;
  return litersUsed * CO2_KG_PER_LITER_GASOLINE;
};

const parseCoordinate = (value) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const lat = Number(value.lat);
  const lng = Number(value.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
};

const geocodeAddress = async (address) => {
  const requestGeocode = async (useMetroCebuScope) => {
    const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
    url.searchParams.set("q", address);
    url.searchParams.set("limit", "1");
    url.searchParams.set("proximity", "123.8854,10.3157");
    url.searchParams.set("country", "ph");

    if (useMetroCebuScope) {
      url.searchParams.set("bbox", METRO_CEBU_BBOX);
    }

    url.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN ?? "");

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload.features?.[0] ?? null;
  };

  // Prefer Metro Cebu matches first to avoid accidental far-away geocodes.
  let feature = await requestGeocode(true);

  if (!feature) {
    feature = await requestGeocode(false);
  }

  if (!feature || !Array.isArray(feature.geometry?.coordinates)) {
    throw new Error(`No coordinate result for ${address}.`);
  }

  return {
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
    label: feature.properties?.full_address ?? feature.properties?.name ?? address,
  };
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/routes/compare", async (req, res) => {
  try {
    if (!MAPBOX_ACCESS_TOKEN) {
      return res.status(500).json({
        error: "MAPBOX_ACCESS_TOKEN is missing on backend.",
      });
    }

    const origin = String(req.body?.origin ?? "").trim();
    const destination = String(req.body?.destination ?? "").trim();
    const originCoord = parseCoordinate(req.body?.originCoord);
    const destinationCoord = parseCoordinate(req.body?.destinationCoord);

    if (!origin || !destination) {
      return res.status(400).json({
        error: "Both origin and destination are required.",
      });
    }

    const [originPoint, destinationPoint] = await Promise.all([
      originCoord
        ? Promise.resolve({
            ...originCoord,
            label: origin,
          })
        : geocodeAddress(origin),
      destinationCoord
        ? Promise.resolve({
            ...destinationCoord,
            label: destination,
          })
        : geocodeAddress(destination),
    ]);

    const fetchDirections = async (profile) => {
      const profileUrl = new URL(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${originPoint.lng},${originPoint.lat};${destinationPoint.lng},${destinationPoint.lat}`,
      );

      profileUrl.searchParams.set("alternatives", "true");
      profileUrl.searchParams.set("overview", "full");
      profileUrl.searchParams.set("geometries", "geojson");
      profileUrl.searchParams.set("steps", "false");
      profileUrl.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN);

      const response = await fetch(profileUrl);
      const rawText = await response.text();

      let payload;
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = { message: rawText };
      }

      return {
        ok: response.ok,
        status: response.status,
        payload,
      };
    };

    let directionsResult = await fetchDirections("driving-traffic");

    // Mapbox can return 422 for traffic profile on some waypoint pairs; retry with driving.
    if (!directionsResult.ok && directionsResult.status === 422) {
      directionsResult = await fetchDirections("driving");
    }

    if (!directionsResult.ok) {
      return res.status(directionsResult.status).json({
        error: "Mapbox directions call failed.",
        details: directionsResult.payload?.message ?? directionsResult.payload,
      });
    }

    const routePayload = directionsResult.payload;
    const mapboxRoutes = Array.isArray(routePayload.routes) ? routePayload.routes.slice(0, 3) : [];

    if (!mapboxRoutes.length) {
      return res.status(404).json({
        error: "No routes found for this trip.",
      });
    }

    const results = mapboxRoutes.map((route, index) => {
      const distanceKm = route.distance / 1000;
      const durationMin = route.duration / 60;
      const summary = route.legs?.[0]?.summary?.trim();

      return {
        id: [`routeA`, `routeB`, `routeC`][index] ?? `route${index + 1}`,
        name: `Route ${String.fromCharCode(65 + index)}`,
        corridor: summary && summary.length > 0 ? `Via ${summary}` : `Alternative ${index + 1}`,
        distanceKm: normalizeNumber(distanceKm, 1),
        durationMin: normalizeNumber(durationMin, 0),
        fuelCostPhp: normalizeNumber(toFuelCostPhp(distanceKm), 0),
        co2Kg: normalizeNumber(toCo2Kg(distanceKm), 2),
        geometry: route.geometry?.coordinates ?? [],
      };
    });

    return res.json({
      origin: originPoint.label,
      destination: destinationPoint.label,
      routes: results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Sugbo Move API listening on http://localhost:${port}`);
});
