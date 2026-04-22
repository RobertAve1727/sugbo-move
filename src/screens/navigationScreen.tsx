import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppBottomNav from "../components/layout/AppBottomNav";
import type { TripRequest } from "../types/trip";
import { fetchTrafficRouteComparisons } from "../services/mapboxDirections";

// --- TYPES & INTERFACES ---
type NavigationContext = {
  source: "recos" | "routes";
  action: "wait" | "goNow";
  routeName?: string;
  routeGeometry?: [number, number][];
} | null;

interface NavigationScreenProps {
  tripRequest: TripRequest;
  navigationContext: NavigationContext | null;
  onBack: () => void;
  onNavigateToRecos: () => void; // Must be here!
}

const UserLocationIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class='marker-pin'></div><div class='pulse'></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const DestinationIcon = L.divIcon({
  className: "custom-destination-icon",
  html: `<div class='destination-pin'></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const MapFollower = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16, { animate: true });
  }, [center, map]);
  return null;
};

const squaredDistance = (a: [number, number], b: [number, number]): number => {
  const dLat = a[0] - b[0];
  const dLng = a[1] - b[1];
  return dLat * dLat + dLng * dLng;
};

const toRadians = (deg: number): number => (deg * Math.PI) / 180;

const distanceMetersBetween = (
  a: [number, number],
  b: [number, number],
): number => {
  const earthRadiusM = 6371000;
  const dLat = toRadians(b[0] - a[0]);
  const dLng = toRadians(b[1] - a[1]);
  const lat1 = toRadians(a[0]);
  const lat2 = toRadians(b[0]);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return earthRadiusM * c;
};

const distanceKmForPath = (path: [number, number][]): number => {
  if (path.length < 2) {
    return 0;
  }

  let totalMeters = 0;
  for (let i = 1; i < path.length; i += 1) {
    totalMeters += distanceMetersBetween(path[i - 1], path[i]);
  }

  return totalMeters / 1000;
};

const NavigationScreen = ({
  tripRequest,
  navigationContext,
  onBack,
  onNavigateToRecos,
}: NavigationScreenProps) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [liveRoutePath, setLiveRoutePath] = useState<[number, number][]>([]);
  const [liveDurationMin, setLiveDurationMin] = useState<number | null>(null);
  const [liveDistanceKm, setLiveDistanceKm] = useState<number | null>(null);
  const lastReroutePositionRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const watcherId = navigator.geolocation.watchPosition(
      (pos) => setCurrentPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

  const baseRoutePath = useMemo(() => {
    if (!navigationContext?.routeGeometry) return [];
    return navigationContext.routeGeometry.map(
      (p: [number, number]) => [p[1], p[0]] as [number, number],
    );
  }, [navigationContext]);

  const targetDestinationCoord = useMemo(() => {
    if (tripRequest.destinationCoord) {
      return [
        tripRequest.destinationCoord.lat,
        tripRequest.destinationCoord.lng,
      ] as [number, number];
    }

    const endPoint = baseRoutePath[baseRoutePath.length - 1];
    return endPoint ?? null;
  }, [baseRoutePath, tripRequest.destinationCoord]);

  useEffect(() => {
    const hasDestinationText = Boolean(tripRequest.destination?.trim());

    if (!currentPosition || (!targetDestinationCoord && !hasDestinationText)) {
      return;
    }

    const shouldRerouteFromDistance = (() => {
      const lastPos = lastReroutePositionRef.current;
      if (!lastPos) {
        return true;
      }

      return distanceMetersBetween(lastPos, currentPosition) >= 150;
    })();

    if (!shouldRerouteFromDistance) {
      return;
    }

    let isMounted = true;

    const reroute = async () => {
      try {
        const liveData = await fetchTrafficRouteComparisons({
          ...tripRequest,
          origin: tripRequest.origin || "Current location",
          destination: tripRequest.destination || "Destination",
          originCoord: {
            lat: currentPosition[0],
            lng: currentPosition[1],
          },
          destinationCoord: targetDestinationCoord
            ? {
                lat: targetDestinationCoord[0],
                lng: targetDestinationCoord[1],
              }
            : null,
        });

        const route = liveData.routes[0];
        if (!isMounted || !route?.geometry?.length) {
          return;
        }

        const normalizedPath = route.geometry.map(
          (point) => [point[1], point[0]] as [number, number],
        );

        setLiveRoutePath(normalizedPath);
        setLiveDurationMin(route.durationMin);
        setLiveDistanceKm(route.distanceKm);
        lastReroutePositionRef.current = currentPosition;
      } catch {
        // Keep existing route path if live reroute fails.
      }
    };

    void reroute();

    return () => {
      isMounted = false;
    };
  }, [currentPosition, targetDestinationCoord, tripRequest]);

  const effectiveRoutePath =
    liveRoutePath.length > 1 ? liveRoutePath : baseRoutePath;

  const nearestRouteIndex = useMemo(() => {
    if (!currentPosition || effectiveRoutePath.length === 0) {
      return 0;
    }

    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    effectiveRoutePath.forEach((point, index) => {
      const distance = squaredDistance(currentPosition, point);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }, [effectiveRoutePath, currentPosition]);

  const routePath = useMemo(() => {
    if (effectiveRoutePath.length === 0) {
      return [] as [number, number][];
    }

    return effectiveRoutePath.slice(nearestRouteIndex);
  }, [effectiveRoutePath, nearestRouteIndex]);

  const connectorPath = useMemo(() => {
    if (!currentPosition || routePath.length === 0) {
      return [] as [number, number][];
    }

    const nearestPoint = routePath[0];
    if (squaredDistance(currentPosition, nearestPoint) < 1e-8) {
      return [] as [number, number][];
    }

    return [currentPosition, nearestPoint];
  }, [currentPosition, routePath]);

  const totalRouteDistanceKm = useMemo(() => {
    if (liveDistanceKm !== null) {
      return liveDistanceKm;
    }

    return distanceKmForPath(effectiveRoutePath);
  }, [effectiveRoutePath, liveDistanceKm]);

  const remainingDistanceKm = useMemo(() => {
    const routeDistance = distanceKmForPath(routePath);
    const connectorDistance = distanceKmForPath(connectorPath);
    return routeDistance + connectorDistance;
  }, [connectorPath, routePath]);

  const estimatedRemainingMinutes = useMemo(() => {
    if (liveDurationMin !== null) {
      return Math.max(1, Math.round(liveDurationMin));
    }

    const baselineDuration = Math.max(
      1,
      Math.round(navigationContext?.action === "wait" ? 14 : 12),
    );
    const safeTotal = Math.max(0.1, totalRouteDistanceKm);
    const ratio = remainingDistanceKm / safeTotal;
    return Math.max(1, Math.round(baselineDuration * ratio));
  }, [
    liveDurationMin,
    navigationContext?.action,
    remainingDistanceKm,
    totalRouteDistanceKm,
  ]);

  // Safety guard to prevent white screen
  if (!navigationContext || !tripRequest) return null;

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden relative font-sans">
      {/* 1. TOP-DOWN FUNCTIONAL MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[10.3157, 123.8854]}
          zoom={16}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {routePath.length > 0 && (
            <Polyline
              positions={routePath}
              pathOptions={{ color: "#2563eb", weight: 7, opacity: 0.8 }}
            />
          )}
          {connectorPath.length > 0 && (
            <Polyline
              positions={connectorPath}
              pathOptions={{
                color: "#1d4ed8",
                weight: 5,
                opacity: 0.7,
                dashArray: "8 8",
              }}
            />
          )}
          {targetDestinationCoord && (
            <Marker position={targetDestinationCoord} icon={DestinationIcon} />
          )}
          {currentPosition && (
            <>
              <Marker position={currentPosition} icon={UserLocationIcon} />
              <MapFollower center={currentPosition} />
            </>
          )}
        </MapContainer>
      </div>

      {/* 2. FLOATING UI OVERLAY */}
      <div className="relative z-[1000] flex h-full flex-col pointer-events-none">
        {/* Top Destination Header */}
        <div className="p-4 pt-8 pointer-events-auto">
          <div className="bg-[#001d3d] text-white rounded-2xl p-5 shadow-2xl flex items-center gap-4">
            <div className="bg-[#2563eb] p-3 rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl">
                navigation
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest leading-none mb-1">
                Navigation Active
              </p>
              <h2 className="text-xl font-bold">
                Toward {tripRequest.destination || "Destination"}
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom HUD & Action Area */}
        <div className="mt-auto p-4 pb-32 space-y-4 pointer-events-auto">
          <div className="bg-white rounded-[28px] shadow-2xl p-6 grid grid-cols-3 divide-x divide-gray-100 border border-gray-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Est. Time
              </p>
              <p className="text-xl font-black text-[#001d3d]">
                {estimatedRemainingMinutes} min
              </p>
            </div>
            <div className="text-center px-1">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                Status
              </p>
              <p className="text-lg font-black text-[#001d3d] uppercase">
                {navigationContext.action === "wait" ? "Waiting" : "Moving"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Distance
              </p>
              <p className="text-xl font-black text-[#001d3d]">
                {Math.max(0.1, remainingDistanceKm).toFixed(1)} km
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-[#ff3b3b] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            End Journey
          </button>
        </div>
      </div>

      {/* 3. FIXED BOTTOM NAVIGATION TRIGGERS */}
      <AppBottomNav
        activeTab="routes"
        onExplore={onBack} // Fix: Triggers Home + State Reset
        onRecos={onNavigateToRecos} // Fix: Explicitly goes back to Recommendations
      />

      <style>{`
        .marker-pin {
          width: 18px; height: 18px; border-radius: 50%;
          background: #2563eb; border: 3px solid white;
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
        }
        .pulse {
          background: rgba(37, 99, 235, 0.4);
          border-radius: 50%; height: 40px; width: 40px;
          position: absolute; left: -11px; top: -11px;
          animation: pulsate 2s ease-out infinite;
        }
        .destination-pin {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ef4444;
          border: 3px solid white;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.45);
        }
        @keyframes pulsate {
          0% { transform: scale(0.1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NavigationScreen;
