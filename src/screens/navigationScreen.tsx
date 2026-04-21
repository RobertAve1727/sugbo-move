import { useEffect, useMemo, useRef, useState } from "react";
import { LatLngBounds, latLngBounds } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppHeader from "../components/layout/AppHeader";
import AppBottomNav from "../components/layout/AppBottomNav";
import type { TripRequest } from "../types/trip";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

type NavigationContext = {
  source: "recos" | "routes";
  action: "wait" | "goNow";
  routeName?: string;
  routeGeometry?: [number, number][];
} | null;

interface NavigationScreenProps {
  tripRequest: TripRequest;
  navigationContext: NavigationContext;
  onBack: () => void;
}

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

const FitRouteBounds = ({ bounds }: { bounds: LatLngBounds | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, { padding: [24, 24] });
  }, [bounds, map]);

  return null;
};

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

const bearingBetweenPoints = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number => {
  const dLon = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

const NavigationScreen = ({
  tripRequest,
  navigationContext,
  onBack,
}: NavigationScreenProps) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const lastPositionRef = useRef<[number, number] | null>(null);
  const [headingDeg, setHeadingDeg] = useState<number>(0);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported on this device.");
      return;
    }

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setCurrentPosition(nextPosition);
        const previousPosition = lastPositionRef.current;
        if (previousPosition) {
          const derivedHeading = bearingBetweenPoints(
            previousPosition[0],
            previousPosition[1],
            nextPosition[0],
            nextPosition[1],
          );
          setHeadingDeg(derivedHeading);
        }

        lastPositionRef.current = nextPosition;
        setLocationError(null);
      },
      () => {
        setLocationError(
          "Unable to read your live location. Enable location permissions.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 12000,
      },
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

  const mapCenter: LatLngExpression = useMemo(() => {
    if (currentPosition) {
      return currentPosition;
    }

    if (tripRequest.originCoord) {
      return [tripRequest.originCoord.lat, tripRequest.originCoord.lng];
    }

    return [10.3157, 123.8854];
  }, [currentPosition, tripRequest.originCoord]);

  const routePath = useMemo(() => {
    if (!navigationContext?.routeGeometry?.length) {
      return [] as [number, number][];
    }

    return navigationContext.routeGeometry.map(
      (point) => [point[1], point[0]] as [number, number],
    );
  }, [navigationContext?.routeGeometry]);

  const routeBounds = useMemo(() => {
    if (!routePath.length && !currentPosition) {
      return null;
    }

    const points = [...routePath];

    if (currentPosition) {
      points.push(currentPosition);
    }

    return latLngBounds(points);
  }, [currentPosition, routePath]);

  const headingLabel = `${Math.round(headingDeg)}°`;
  const directionHint =
    navigationContext?.action === "wait"
      ? "Wait Mode engaged. Start moving when congestion eases."
      : "Go Now mode engaged. Follow heading in real time.";

  return (
    <div className="min-h-dvh bg-[#f7f9fb] flex flex-col text-[#0f172a]">
      <AppHeader onMenuClick={onBack} />

      <main className="flex-1 px-4 pt-6 pb-28 max-w-md w-full mx-auto space-y-4">
        <div className="bg-[#001d3d] text-white rounded-2xl p-4 shadow-lg">
          <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
            Live Navigation
          </p>
          <h2 className="text-xl font-bold mt-1">
            {tripRequest.destination || "Destination"}
          </h2>
          <p className="text-xs text-white/80 mt-2">{directionHint}</p>
          <p className="text-xs text-white/70 mt-1">
            Source: {navigationContext?.source ?? "route"} | Route:{" "}
            {navigationContext?.routeName ?? "Recommended"}
          </p>
        </div>

        {locationError && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700">
            {locationError}
          </div>
        )}

        <div className="rounded-2xl overflow-hidden border border-[#d8e1ea] shadow-sm h-80">
          <MapContainer
            center={mapCenter}
            zoom={16}
            className="w-full h-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {currentPosition && <Marker position={currentPosition} />}

            {routePath.length > 0 && (
              <Polyline
                pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.85 }}
                positions={routePath}
              />
            )}

            {currentPosition &&
              routePath.length === 0 &&
              tripRequest.destinationCoord && (
                <Polyline
                  pathOptions={{ color: "#0ea5e9", weight: 5, opacity: 0.8 }}
                  positions={[
                    currentPosition,
                    [
                      tripRequest.destinationCoord.lat,
                      tripRequest.destinationCoord.lng,
                    ],
                  ]}
                />
              )}

            {currentPosition && <RecenterMap center={currentPosition} />}
            {routeBounds && <FitRouteBounds bounds={routeBounds} />}
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-[#d8e1ea] p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
              Current Heading
            </p>
            <p className="text-2xl font-black text-[#001d3d] mt-1">
              {headingLabel}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#d8e1ea] p-4">
            <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
              Mode
            </p>
            <p className="text-sm font-bold text-[#001d3d] mt-2 uppercase">
              {navigationContext?.action === "wait" ? "Wait" : "Go Now"}
            </p>
          </div>
        </div>
      </main>

      <AppBottomNav activeTab="routes" onExplore={onBack} />
    </div>
  );
};

export default NavigationScreen;
