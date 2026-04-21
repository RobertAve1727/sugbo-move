import type { FuelType, TripRequest, VehicleType } from "../types/trip";
import type { RouteScenario } from "./mapboxDirections";

type FuelProfile = {
  phpPerUnit: number;
  kgCo2PerUnit: number;
};

const fuelProfiles: Record<FuelType, FuelProfile> = {
  gasoline: {
    phpPerUnit: 67,
    kgCo2PerUnit: 2.31,
  },
  diesel: {
    phpPerUnit: 64,
    kgCo2PerUnit: 2.68,
  },
  electric: {
    phpPerUnit: 11,
    kgCo2PerUnit: 0,
  },
};

const defaultEfficiencyByVehicle: Record<VehicleType, number> = {
  car: 14,
  motorcycle: 40,
};

const roundTo = (value: number, digits: number): number => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

export const applyVehicleMetrics = (
  routes: RouteScenario[],
  tripRequest: TripRequest,
): RouteScenario[] => {
  const vehicleType = tripRequest.vehicleType ?? "car";
  const fuelType = tripRequest.fuelType ?? "gasoline";

  const efficiencyKmPerUnit =
    tripRequest.efficiencyKmPerUnit ?? defaultEfficiencyByVehicle[vehicleType];

  const safeEfficiency = Math.max(0.1, efficiencyKmPerUnit);
  const fuelProfile = fuelProfiles[fuelType];

  return routes.map((route) => {
    const consumedUnits = route.distanceKm / safeEfficiency;

    return {
      ...route,
      fuelCostPhp: roundTo(consumedUnits * fuelProfile.phpPerUnit, 0),
      co2Kg: roundTo(consumedUnits * fuelProfile.kgCo2PerUnit, 2),
    };
  });
};
