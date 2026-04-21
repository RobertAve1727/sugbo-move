import type { FuelType, TripRequest, VehicleType } from "../types/trip";
import type { RouteScenario } from "./mapboxDirections";

type FuelProfile = {
  phpPerUnit: number;
  kgCo2PerUnit: number;
};

type TrafficLevel = "low" | "moderate" | "high";

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

const averageSpeedLimitKph = 35;

const movingEmissionFactorsKgPerKm = {
  carGasoline: 0.17,
  carDiesel: 0.155,
  motorcycleGasoline: 0.08,
  electricVehicle: 0.045,
} as const;

const idlingRateLitersPerHour: Record<TrafficLevel, number> = {
  low: 0.2,
  moderate: 0.6,
  high: 1.2,
};

const roundTo = (value: number, digits: number): number => {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
};

const resolveMovingEmissionFactor = (
  vehicleType: VehicleType,
  fuelType: FuelType,
): number => {
  if (fuelType === "electric") {
    return movingEmissionFactorsKgPerKm.electricVehicle;
  }

  if (vehicleType === "motorcycle") {
    return movingEmissionFactorsKgPerKm.motorcycleGasoline;
  }

  if (fuelType === "diesel") {
    return movingEmissionFactorsKgPerKm.carDiesel;
  }

  return movingEmissionFactorsKgPerKm.carGasoline;
};

const resolveTrafficLevel = (
  idleHours: number,
  estimatedHours: number,
): TrafficLevel => {
  const idleShare = estimatedHours > 0 ? idleHours / estimatedHours : 0;

  if (idleShare >= 0.35) {
    return "high";
  }

  if (idleShare >= 0.15) {
    return "moderate";
  }

  return "low";
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
  const movingEmissionFactor = resolveMovingEmissionFactor(
    vehicleType,
    fuelType,
  );
  const isElectricVehicle = fuelType === "electric";

  return routes.map((route) => {
    const estimatedHours = route.durationMin / 60;
    const freeFlowHours = route.distanceKm / averageSpeedLimitKph;
    const idleHours = Math.max(0, estimatedHours - freeFlowHours);

    const trafficLevel = resolveTrafficLevel(idleHours, estimatedHours);
    const idleFuelBurn = isElectricVehicle
      ? 0
      : idleHours * idlingRateLitersPerHour[trafficLevel];

    const movingFuelBurn = route.distanceKm / safeEfficiency;
    const consumedUnits = movingFuelBurn + idleFuelBurn;

    const movingCo2Kg = route.distanceKm * movingEmissionFactor;
    const idlingCo2Kg = isElectricVehicle
      ? 0
      : idleFuelBurn * fuelProfile.kgCo2PerUnit;
    const totalCo2Kg = movingCo2Kg + idlingCo2Kg;

    return {
      ...route,
      fuelConsumedUnits: roundTo(consumedUnits, 3),
      fuelCostPhp: roundTo(consumedUnits * fuelProfile.phpPerUnit, 0),
      co2Kg: roundTo(totalCo2Kg, 2),
    };
  });
};
