export type TripCoordinate = {
  lat: number;
  lng: number;
};

export type VehicleType = "car" | "motorcycle";

export type FuelType = "gasoline" | "diesel" | "electric";

export type TripRequest = {
  origin: string;
  destination: string;
  originCoord?: TripCoordinate | null;
  destinationCoord?: TripCoordinate | null;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  efficiencyKmPerUnit?: number;
  vehicleLabel?: string;
};
