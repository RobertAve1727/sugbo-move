import { useEffect, useMemo, useState } from "react";
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

const MapFollower = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16, { animate: true });
  }, [center, map]);
  return null;
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

  useEffect(() => {
    const watcherId = navigator.geolocation.watchPosition(
      (pos) => setCurrentPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

  const routePath = useMemo(() => {
    if (!navigationContext?.routeGeometry) return [];
    return navigationContext.routeGeometry.map(
      (p: [number, number]) => [p[1], p[0]] as [number, number],
    );
  }, [navigationContext]);

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
          {currentPosition && (
            <>
              <Marker position={currentPosition} icon={UserLocationIcon} />
              <MapFollower center={currentPosition} />
            </>
          )}
        </MapContainer>
      </div>

      {/* 2. FLOATING UI OVERLAY */}
      <div className="relative z-[1000] flex flex-col h-full pointer-events-none">
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
              <p className="text-xl font-black text-[#001d3d]">12 min</p>
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
              <p className="text-xl font-black text-[#001d3d]">4.2 km</p>
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
