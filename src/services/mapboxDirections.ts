import axios from "axios";
import type { TripRequest } from "../types/trip";

export type RouteScenario = {
  id: "routeA" | "routeB" | "routeC";
  name: string;
  corridor: string;
  distanceKm: number;
  durationMin: number;
  fuelCostPhp: number;
  fuelConsumedUnits?: number;
  co2Kg: number;
  geometry: [number, number][];
};

export type RouteComparisonResult = {
  origin: string;
  destination: string;
  routes: RouteScenario[];
};

export const fetchTrafficRouteComparisons = async (
  tripRequest: TripRequest,
): Promise<RouteComparisonResult> => {
  const { data } = await axios.post<RouteComparisonResult>(
    "/api/routes/compare",
    {
      origin: tripRequest.origin,
      destination: tripRequest.destination,
      originCoord: tripRequest.originCoord,
      destinationCoord: tripRequest.destinationCoord,
    },
    {
      timeout: 20000,
    },
  );

  return data;
};
