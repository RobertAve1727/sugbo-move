import type { RouteScenario } from "./mapboxDirections";

export type DisplayRoute = RouteScenario & {
  efficiencyScore: number;
  trafficLabel: "Low Traffic" | "Moderate Traffic" | "Heavy Traffic";
  co2DeltaLabel: string;
};

const normalizeScore = (value: number, min: number, max: number): number => {
  if (max === min) {
    return 0;
  }
  return (value - min) / (max - min);
};

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

  const distances = routes.map((route) => route.distanceKm);
  const durations = routes.map((route) => route.durationMin);
  const costs = routes.map((route) => route.fuelCostPhp);
  const co2Values = routes.map((route) => route.co2Kg);

  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const maxCo2 = Math.max(...co2Values);

  return routes.map((route) => {
    const distancePenalty = normalizeScore(route.distanceKm, minDistance, maxDistance);
    const durationPenalty = normalizeScore(route.durationMin, minDuration, maxDuration);
    const costPenalty = normalizeScore(route.fuelCostPhp, minCost, maxCost);

    const efficiencyScore = Math.round(
      (1 - durationPenalty * 0.45 - costPenalty * 0.35 - distancePenalty * 0.2) * 100,
    );

    const co2DeltaPercent = maxCo2 > 0 ? ((maxCo2 - route.co2Kg) / maxCo2) * 100 : 0;
    const co2DeltaLabel =
      co2DeltaPercent >= 0
        ? `-${Math.round(co2DeltaPercent)}% CO2`
        : `+${Math.round(Math.abs(co2DeltaPercent))}% CO2`;

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
  [...routes].sort((routeA, routeB) => routeB.efficiencyScore - routeA.efficiencyScore)[0];
