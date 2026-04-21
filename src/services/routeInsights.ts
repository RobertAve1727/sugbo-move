import type { RouteScenario } from "./mapboxDirections";

export type DisplayRoute = RouteScenario & {
  efficiencyScore: number;
  trafficLabel: "Low Traffic" | "Moderate Traffic" | "Heavy Traffic";
  co2DeltaLabel: string;
};

const scoringWeights = {
  travelTime: 0.24,
  totalDistance: 0.12,
  fuelConsumption: 0.2,
  fuelCost: 0.16,
  carbonEmissionRate: 0.2,
  congestionLevel: 0.08,
} as const;

const normalizeScore = (value: number, min: number, max: number): number => {
  if (max === min) {
    return 0;
  }
  return (value - min) / (max - min);
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const trafficFromDuration = (
  durationMin: number,
  fastestDurationMin: number,
): DisplayRoute["trafficLabel"] => {
  const ratio = durationMin / fastestDurationMin;

  if (ratio <= 1.15) {
    return "Low Traffic";
  }
  if (ratio <= 1.35) {
    return "Moderate Traffic";
  }
  return "Heavy Traffic";
};

export const buildDisplayRoutes = (routes: RouteScenario[]): DisplayRoute[] => {
  if (!routes.length) {
    return [];
  }

  const maxCo2Kg = Math.max(...routes.map((route) => route.co2Kg));
  const minCo2Kg = Math.min(...routes.map((route) => route.co2Kg));
  const co2Spread = maxCo2Kg - minCo2Kg;

  const durations = routes.map((route) => route.durationMin);
  const distances = routes.map((route) => route.distanceKm);
  const consumptions = routes.map(
    (route) => route.fuelConsumedUnits ?? route.distanceKm / 10,
  );
  const costs = routes.map((route) => route.fuelCostPhp);
  const emissionRates = routes.map(
    (route) => route.co2Kg / Math.max(0.1, route.distanceKm),
  );
  const fastestDuration = Math.min(...durations);
  const congestionLevels = durations.map(
    (duration) => (duration - fastestDuration) / Math.max(1, fastestDuration),
  );

  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minConsumption = Math.min(...consumptions);
  const maxConsumption = Math.max(...consumptions);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const minEmissionRate = Math.min(...emissionRates);
  const maxEmissionRate = Math.max(...emissionRates);
  const minCongestion = Math.min(...congestionLevels);
  const maxCongestion = Math.max(...congestionLevels);
  return routes.map((route) => {
    const durationPenalty = normalizeScore(
      route.durationMin,
      minDuration,
      maxDuration,
    );
    const distancePenalty = normalizeScore(
      route.distanceKm,
      minDistance,
      maxDistance,
    );
    const fuelConsumption = route.fuelConsumedUnits ?? route.distanceKm / 10;
    const fuelConsumptionPenalty = normalizeScore(
      fuelConsumption,
      minConsumption,
      maxConsumption,
    );
    const costPenalty = normalizeScore(route.fuelCostPhp, minCost, maxCost);
    const emissionRate = route.co2Kg / Math.max(0.1, route.distanceKm);
    const emissionRatePenalty = normalizeScore(
      emissionRate,
      minEmissionRate,
      maxEmissionRate,
    );
    const congestionLevel =
      (route.durationMin - fastestDuration) / Math.max(1, fastestDuration);
    const congestionPenalty = normalizeScore(
      congestionLevel,
      minCongestion,
      maxCongestion,
    );

    const weightedPenalty =
      durationPenalty * scoringWeights.travelTime +
      distancePenalty * scoringWeights.totalDistance +
      fuelConsumptionPenalty * scoringWeights.fuelConsumption +
      costPenalty * scoringWeights.fuelCost +
      emissionRatePenalty * scoringWeights.carbonEmissionRate +
      congestionPenalty * scoringWeights.congestionLevel;

    const efficiencyScore = Math.round((1 - clamp01(weightedPenalty)) * 100);

    // Primary metric: reduction versus highest-emission route in current options.
    // Fallback metric: emission intensity versus gasoline-car baseline when routes are near-identical.
    const reductionPercent =
      maxCo2Kg > 0 ? ((maxCo2Kg - route.co2Kg) / maxCo2Kg) * 100 : 0;
    const co2IntensityKgPerKm = route.co2Kg / Math.max(0.1, route.distanceKm);
    const gasolineCarBaselineKgPerKm = 0.17;
    const intensityPercent =
      (co2IntensityKgPerKm / gasolineCarBaselineKgPerKm) * 100;

    const displayPercent =
      co2Spread < 0.01 ? intensityPercent : reductionPercent;
    const normalizedPercent =
      Math.abs(displayPercent) < 0.005 ? 0 : displayPercent;
    const co2DeltaLabel = `${normalizedPercent.toFixed(2)}% CO2`;

    return {
      ...route,
      efficiencyScore,
      trafficLabel: trafficFromDuration(route.durationMin, minDuration),
      co2DeltaLabel,
    };
  });
};

export const getRecommendedRoute = (
  routes: DisplayRoute[],
): DisplayRoute | undefined =>
  [...routes].sort(
    (routeA, routeB) => routeB.efficiencyScore - routeA.efficiencyScore,
  )[0];
