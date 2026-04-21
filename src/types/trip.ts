export type TripCoordinate = {
  lat: number;
  lng: number;
};

export type TripRequest = {
  origin: string;
  destination: string;
  originCoord?: TripCoordinate | null;
  destinationCoord?: TripCoordinate | null;
};
