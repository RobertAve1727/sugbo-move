import type { RouteScenario } from "./mapboxDirections";

export const fallbackRoutes: RouteScenario[] = [
  {
    id: "routeA",
    name: "Route A",
    corridor: "Via Inner City",
    distanceKm: 12.4,
    durationMin: 22,
    fuelCostPhp: 55,
    co2Kg: 1.88,
    geometry: [
      [123.9082, 10.3279],
      [123.9115, 10.3116],
      [123.9761, 10.3156],
    ],
  },
  {
    id: "routeB",
    name: "Route B",
    corridor: "Via Mandaue",
    distanceKm: 14.8,
    durationMin: 28,
    fuelCostPhp: 65,
    co2Kg: 2.24,
    geometry: [
      [123.9082, 10.3279],
      [123.9356, 10.3368],
      [123.9761, 10.3156],
    ],
  },
  {
    id: "routeC",
    name: "Route C",
    corridor: "Via SRP-CCLEX",
    distanceKm: 17.2,
    durationMin: 40,
    fuelCostPhp: 76,
    co2Kg: 2.61,
    geometry: [
      [123.9082, 10.3279],
      [123.8688, 10.2769],
      [123.9761, 10.3156],
    ],
  },
];
