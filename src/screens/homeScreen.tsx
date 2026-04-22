import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppBottomNav from "../components/layout/AppBottomNav";
import AppHeader from "../components/layout/AppHeader";
import type { FuelType, TripRequest, VehicleType } from "../types/trip";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

interface HomeScreenProps {
  tripRequest: TripRequest;
  onTripDraftChange: (trip: TripRequest) => void;
  onFindBestRoute: (trip: TripRequest) => void;
}

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const cebuPlaces = [
  "IT Park, Lahug",
  "Ayala Center Cebu",
  "SM City Cebu",
  "SM Seaside City Cebu",
  "Fuente Osmena Circle, Cebu City",
  "Cebu Business Park",
  "The Mactan Newtown, Lapu-Lapu City",
  "Mactan-Cebu International Airport, Lapu-Lapu City",
  "Colon Street, Cebu City",
  "South Road Properties (SRP), Cebu City",
  "Cebu Doctors' University Hospital, Cebu City",
  "Chong Hua Hospital, Cebu City",
  "Carbon Market, Cebu City",
  "University of San Carlos Talamban Campus",
  "Temple of Leah, Busay",
  "Sirao Flower Garden, Cebu City",
  "Tops Lookout, Busay, Cebu City",
  "Mandaue City Hall",
  "Parkmall, Mandaue City",
  "Lapu-Lapu City Hall",
];

type VehicleOption = {
  id: string;
  nickname: string;
  type: VehicleType;
  plate: string;
  efficiencyKmPerUnit: number;
  fuelType: FuelType;
};

const HomeScreen = ({
  tripRequest,
  onTripDraftChange,
  onFindBestRoute,
}: HomeScreenProps) => {
  const latestTripRef = useRef(tripRequest);

  useEffect(() => {
    latestTripRef.current = tripRequest;
  }, [tripRequest]);

  const [availableVehicles] = useState<VehicleOption[]>([
    {
      id: "v1",
      nickname: "Toyota Vios",
      type: "car",
      plate: "GAB 1234",
      efficiencyKmPerUnit: 15.4,
      fuelType: "gasoline",
    },
    {
      id: "v2",
      nickname: "Honda Click",
      type: "motorcycle",
      plate: "VH 7890",
      efficiencyKmPerUnit: 45.2,
      fuelType: "gasoline",
    },
    {
      id: "v3",
      nickname: "Toyota Innova",
      type: "car",
      plate: "KAA 5512",
      efficiencyKmPerUnit: 12.1,
      fuelType: "diesel",
    },
    {
      id: "v4",
      nickname: "Nissan Leaf",
      type: "car",
      plate: "EV 2040",
      efficiencyKmPerUnit: 6.8,
      fuelType: "electric",
    },
  ]);

  const [selectedVehicleId, setSelectedVehicleId] = useState("v1");
  const [activeSuggestionField, setActiveSuggestionField] = useState<
    "destination" | null
  >(null);

  const selectedVehicle = useMemo(
    () =>
      availableVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ??
      availableVehicles[0],
    [availableVehicles, selectedVehicleId],
  );

  const recentTrips = [
    {
      id: 1,
      destination: "IT Park, Lahug",
      route: "Via Salinas Drive",
      tag: "Efficient",
      icon: "work",
    },
    {
      id: 2,
      destination: "Mactan Heights",
      route: "Via CCLEX",
      tag: "Fast",
      icon: "home",
    },
    {
      id: 3,
      destination: "SM Seaside",
      route: "Via SRP",
      tag: "Eco",
      icon: "shopping_bag",
    },
    {
      id: 4,
      destination: "Ayala Center",
      route: "Via Arch. Reyes",
      tag: "Efficient",
      icon: "local_mall",
    },
    {
      id: 5,
      destination: "Cebu Doctors",
      route: "Via Osmeña Blvd",
      tag: "Fast",
      icon: "medical_services",
    },
  ];

  const handleFindBestRoute = () => {
    const normalizedDestination = tripRequest.destination.trim();

    if (!tripRequest.originCoord || !normalizedDestination) {
      return;
    }

    onFindBestRoute({
      origin: tripRequest.origin.trim() || "Current location",
      destination: normalizedDestination,
      originCoord: tripRequest.originCoord ?? null,
      destinationCoord: tripRequest.destinationCoord ?? null,
      vehicleType: selectedVehicle.type,
      fuelType: selectedVehicle.fuelType,
      efficiencyKmPerUnit: selectedVehicle.efficiencyKmPerUnit,
      vehicleLabel: selectedVehicle.nickname,
    });
  };

  const mapCenter: LatLngExpression = useMemo(() => {
    if (tripRequest.originCoord) {
      return [tripRequest.originCoord.lat, tripRequest.originCoord.lng];
    }
    if (tripRequest.destinationCoord) {
      return [
        tripRequest.destinationCoord.lat,
        tripRequest.destinationCoord.lng,
      ];
    }
    return [10.3157, 123.8854];
  }, [tripRequest.destinationCoord, tripRequest.originCoord]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latestTrip = latestTripRef.current;
        const nextOriginCoord = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        onTripDraftChange({
          ...latestTrip,
          origin: "Current location",
          originCoord: nextOriginCoord,
        });
      },
      () => {
        const latestTrip = latestTripRef.current;
        onTripDraftChange({
          ...latestTrip,
          origin: "Current location",
        });
      },
      {
        enableHighAccuracy: true,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onTripDraftChange]);

  const getFilteredSuggestions = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return cebuPlaces.slice(0, 6);
    }

    return cebuPlaces
      .filter((place) => place.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  };

  const destinationSuggestions = useMemo(
    () => getFilteredSuggestions(tripRequest.destination),
    [tripRequest.destination],
  );

  const reverseGeocodeLabel = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = (await response.json()) as {
        display_name?: string;
        name?: string;
      };

      return (
        data.name?.trim() ||
        data.display_name?.split(",")[0]?.trim() ||
        "Pinned location"
      );
    } catch {
      return "Pinned location";
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (event) => {
        const nextCoord = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        };
        const placeLabel = await reverseGeocodeLabel(
          nextCoord.lat,
          nextCoord.lng,
        );

        onTripDraftChange({
          ...tripRequest,
          destination: placeLabel,
          destinationCoord: nextCoord,
        });
      },
    });

    return null;
  };

  return (
    <div className="bg-[#f0f4f8] font-body text-[#1a1c1e] min-h-screen flex flex-col w-full relative">
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <AppHeader />
      </div>

      <div className="fixed inset-0 z-0 opacity-30 grayscale pointer-events-none">
        <img
          alt="Cebu map background"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTbbAu_kL_gdiTVbw-Xvao4vj0ndKZYR7RdbYwmxlat_AGXtluVOJT0Q5ik8FIou60sLGwswwVIYbJ0e4MzbQJ2xnqT54-LQ5E_nvxUTNysnwwM04li1KCJVU2gi33xa05sYUbWz2rcXqoo9qr8jFeMPCZA9YMlRV9QxL__8Biv5gvlBP7xT_7QLAQOm56S7bL-mfIhd43TObkHYEBOAMwlCFH3k6-MUXU2yPud9Uw3qVklA96I2sEkZFWHd12K9vkz2BYDRW7XLKO"
        />
      </div>

      <main className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto px-6 pt-8 pb-32">
        <div className="mb-6">
          <h2 className="font-headline text-3xl leading-tight font-bold text-[#001d3d]">
            Where are we <br />
            <span className="text-[#60778f]">heading today?</span>
          </h2>
        </div>

        <div className="bg-[#e9eef2]/90 backdrop-blur-sm rounded-[24px] p-5 mb-8 shadow-sm">
          <div className="space-y-4 relative">
            <div className="absolute left-[9px] top-6 bottom-6 w-[1.5px] bg-gray-400/30" />
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full border-4 border-[#001d3d] bg-white z-10" />
              <div className="flex-1">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Origin
                </span>
                <div className="w-full bg-white/60 border-none rounded-lg px-3 py-2 text-sm font-bold text-[#001d3d]">
                  {tripRequest.originCoord
                    ? "Current location pinned"
                    : "Detecting current location..."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-[#001d3d] rounded-sm z-10" />
              <div className="flex-1">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Destination
                </span>
                <input
                  className="w-full bg-white/60 border-none rounded-lg px-3 py-2 text-sm font-bold"
                  value={tripRequest.destination}
                  onFocus={() => setActiveSuggestionField("destination")}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setActiveSuggestionField((current) =>
                        current === "destination" ? null : current,
                      );
                    }, 120);
                  }}
                  onChange={(event) =>
                    onTripDraftChange({
                      ...tripRequest,
                      destination: event.target.value,
                      destinationCoord: null,
                    })
                  }
                  placeholder="Search destination..."
                />
                {activeSuggestionField === "destination" &&
                  destinationSuggestions.length > 0 && (
                    <div className="mt-2 bg-white border border-[#dce3ea] rounded-xl shadow-md overflow-hidden">
                      {destinationSuggestions.map((suggestion) => (
                        <button
                          key={`destination-${suggestion}`}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-[#001d3d] hover:bg-[#eef3f8]"
                          onMouseDown={() => {
                            onTripDraftChange({
                              ...tripRequest,
                              destination: suggestion,
                              destinationCoord: null,
                            });
                            setActiveSuggestionField(null);
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 rounded-[24px] p-4 mb-8 border border-[#dce3ea] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#001d3d]">
              Tap Map To Pin Destination
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#60778f]">
              Origin follows your GPS
            </p>
          </div>

          <div className="h-52 rounded-2xl overflow-hidden border border-[#dce3ea]">
            <MapContainer
              center={mapCenter}
              zoom={12}
              scrollWheelZoom
              className="w-full h-full"
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler />

              {tripRequest.originCoord && (
                <Marker
                  position={[
                    tripRequest.originCoord.lat,
                    tripRequest.originCoord.lng,
                  ]}
                />
              )}

              {tripRequest.destinationCoord && (
                <Marker
                  position={[
                    tripRequest.destinationCoord.lat,
                    tripRequest.destinationCoord.lng,
                  ]}
                />
              )}
            </MapContainer>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#001d3d] mb-4">
            Select Your Vehicle
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {availableVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => {
                  setSelectedVehicleId(vehicle.id);
                  onTripDraftChange({
                    ...tripRequest,
                    vehicleType: vehicle.type,
                    fuelType: vehicle.fuelType,
                    efficiencyKmPerUnit: vehicle.efficiencyKmPerUnit,
                    vehicleLabel: vehicle.nickname,
                  });
                }}
                className={`flex flex-col min-w-[220px] p-4 rounded-2xl border-2 transition-all ${
                  selectedVehicleId === vehicle.id
                    ? "bg-white border-[#001d3d] shadow-md"
                    : "bg-white/40 border-transparent text-gray-400"
                }`}
              >
                <div className="w-full flex justify-between items-start mb-2">
                  <span className="material-symbols-outlined">
                    {vehicle.type === "car" ? "directions_car" : "two_wheeler"}
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                      selectedVehicleId === vehicle.id
                        ? "bg-[#001d3d] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {vehicle.fuelType}
                  </div>
                </div>
                <div className="text-sm font-bold text-[#001d3d]">
                  {vehicle.nickname}
                </div>
                <div className="flex justify-between items-center w-full mt-1">
                  <div className="text-[10px] font-bold uppercase opacity-60">
                    {vehicle.plate}
                  </div>
                  <div className="text-[10px] font-bold text-[#60778f]">
                    {vehicle.efficiencyKmPerUnit}{" "}
                    {vehicle.fuelType === "electric" ? "km/kWh" : "km/L"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleFindBestRoute}
          disabled={!tripRequest.originCoord || !tripRequest.destination.trim()}
          className="w-full h-14 bg-[#001d3d] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl mb-10 hover:bg-[#002d5d] active:scale-95 transition-all"
        >
          Find Best Route
        </button>

        <div className="flex flex-col">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Recent Trips
          </h3>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white/80 p-4 rounded-xl flex justify-between items-center border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">
                      {trip.icon}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#001d3d]">
                      {trip.destination}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      {trip.route}
                    </div>
                  </div>
                </div>
                <div className="text-[9px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase">
                  {trip.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="w-full bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <AppBottomNav activeTab="explore" onRoutes={handleFindBestRoute} />
      </div>
    </div>
  );
};

export default HomeScreen;
