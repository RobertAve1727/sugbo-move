import React, { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/layout/AppHeader";
import AppBottomNav from "../components/layout/AppBottomNav";

import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import type {
  RouteComparisonResult,
  RouteScenario,
} from "../services/mapboxDirections";
import { fallbackRoutes } from "../services/fallbackRoutes";
import {
  buildDisplayRoutes,
  getRecommendedRoute,
} from "../services/routeInsights";
import { applyVehicleMetrics } from "../services/vehicleMetrics";
import type { TripRequest } from "../types/trip";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface RouteComparisonScreenProps {
  tripRequest: TripRequest;
  routeData: RouteComparisonResult | null;
  isLoading: boolean;
  loadError: string | null;
}

const RouteComparisonScreen: React.FC<RouteComparisonScreenProps> = ({
  tripRequest,
  routeData,
  isLoading,
  loadError,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<
    RouteScenario["id"] | null
  >(null);
  const baseRoutes = routeData?.routes?.length
    ? routeData.routes
    : fallbackRoutes;
  const routes = useMemo(
    () => applyVehicleMetrics(baseRoutes, tripRequest),
    [baseRoutes, tripRequest],
  );
  const resolvedOrigin = routeData?.origin ?? tripRequest.origin;
  const resolvedDestination = routeData?.destination ?? tripRequest.destination;

  const displayRoutes = useMemo(() => buildDisplayRoutes(routes), [routes]);
  const recommendedRoute = useMemo(
    () => getRecommendedRoute(displayRoutes),
    [displayRoutes],
  );

  useEffect(() => {
    if (recommendedRoute && !selectedRouteId) {
      setSelectedRouteId(recommendedRoute.id);
    }
  }, [
    recommendedRoute,
    selectedRouteId,
    tripRequest.origin,
    tripRequest.destination,
  ]);

  const selectedRoute = useMemo(
    () =>
      displayRoutes.find((route) => route.id === selectedRouteId) ??
      recommendedRoute,
    [displayRoutes, recommendedRoute, selectedRouteId],
  );

  const mapCenter: LatLngExpression = useMemo(() => {
    if (!selectedRoute || selectedRoute.geometry.length === 0) {
      return [10.3157, 123.8854];
    }

    const middlePoint =
      selectedRoute.geometry[Math.floor(selectedRoute.geometry.length / 2)];
    return [middlePoint[1], middlePoint[0]];
  }, [selectedRoute]);

  const mapLines = useMemo(
    () =>
      displayRoutes.map((route) => ({
        id: route.id,
        points: route.geometry.map(
          (point) => [point[1], point[0]] as [number, number],
        ),
      })),
    [displayRoutes],
  );

  const startPoint = selectedRoute?.geometry[0];
  const endPoint = selectedRoute?.geometry[selectedRoute.geometry.length - 1];

  const routeAccent: Record<RouteScenario["id"], string> = {
    routeA: "#facc15",
    routeB: "#4ade80",
    routeC: "#ef4444",
  };

  return (
    <div className="bg-[#f8f9fb] text-[#1a1c1e] min-h-screen font-sans selection:bg-primary selection:text-on-primary">
      <AppHeader />

      <main className="pt-24 pb-40 px-6 max-w-xl mx-auto">
        {loadError && (
          <div className="mb-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-xs font-semibold text-yellow-700">
            {loadError}
          </div>
        )}

        <section className="relative h-48 rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100">
          <MapContainer
            center={mapCenter}
            zoom={12}
            zoomControl={false}
            scrollWheelZoom
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapLines.map((routeLine) => (
              <Polyline
                key={routeLine.id}
                pathOptions={{
                  color: routeAccent[routeLine.id],
                  weight: routeLine.id === selectedRoute?.id ? 7 : 4,
                  opacity: routeLine.id === selectedRoute?.id ? 0.95 : 0.65,
                }}
                positions={routeLine.points}
              />
            ))}

            {startPoint && <Marker position={[startPoint[1], startPoint[0]]} />}
            {endPoint && <Marker position={[endPoint[1], endPoint[0]]} />}
          </MapContainer>

          <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none">
            <span className="w-fit font-bold text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 rounded-md mb-2">
              Real-time Analysis
            </span>
            <h2 className="text-white text-3xl font-bold leading-tight">
              Cebu Route <br /> Comparison
            </h2>
            <p className="text-white/85 text-[11px] mt-2 font-semibold leading-tight max-w-[280px]">
              {resolvedOrigin} to {resolvedDestination}
            </p>
          </div>
        </section>

        <section className="grid gap-4 mb-6">
          <div className="bg-[#04162e] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400">✦</span>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                Recommended Strategy
              </p>
            </div>

            <h3 className="text-3xl font-bold mb-3 leading-snug">
              {recommendedRoute
                ? `${recommendedRoute.name} is your `
                : "Loading"}
              <br />
              best bet today.
            </h3>

            <p className="text-sm opacity-70 mb-6 max-w-[240px]">
              {recommendedRoute
                ? `${recommendedRoute.corridor}. Optimized using Mapbox driving-traffic telemetry.`
                : "Running route optimization from live traffic inputs..."}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-5xl font-bold text-[#4ade80]">
                {recommendedRoute ? `₱${recommendedRoute.fuelCostPhp}` : "..."}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Estimated Fuel Cost
              </span>
            </div>
            <p className="mt-3 text-xs font-semibold text-white/75">
              {recommendedRoute
                ? `${recommendedRoute.co2Kg.toFixed(2)} kg CO2 for ${tripRequest.vehicleLabel ?? "selected vehicle"}`
                : "Calculating CO2"}
            </p>
          </div>

          <div className="bg-[#032b14] p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
            <p className="text-[#4ade80] text-[10px] font-bold uppercase tracking-widest mb-6">
              Total Efficiency
            </p>

            <div className="relative flex items-center justify-center mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={
                    recommendedRoute
                      ? 364.4 * (1 - recommendedRoute.efficiencyScore / 100)
                      : 364.4
                  }
                  className="text-[#4ade80]"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-[#4ade80]">
                {recommendedRoute
                  ? `${recommendedRoute.efficiencyScore}%`
                  : "--"}
              </span>
            </div>

            <p className="text-[#4ade80] text-sm font-medium">
              {recommendedRoute
                ? `${recommendedRoute.trafficLabel} / ${recommendedRoute.durationMin} min ETA`
                : "Analyzing traffic profile"}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {isLoading && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-sm text-gray-500 font-medium">
              Loading dynamic routes from Mapbox Directions API...
            </div>
          )}

          {!isLoading &&
            displayRoutes.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              const isRecommended = recommendedRoute?.id === route.id;

              return (
                <div
                  key={route.id}
                  className={`bg-white p-6 rounded-3xl border-l-[6px] transition-all ${
                    isSelected ? "shadow-md ring-1 ring-black/5" : "shadow-sm"
                  }`}
                  style={{ borderLeftColor: routeAccent[route.id] }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {route.name}
                    </h4>
                    <div className="flex flex-col items-end gap-1">
                      {isRecommended && (
                        <span className="bg-green-400 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase mb-1">
                          Best Balance
                        </span>
                      )}
                      <div className="flex gap-2">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {route.trafficLabel}
                        </span>
                        <span className="bg-black text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {route.co2Kg.toFixed(2)} kg CO2
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    {route.corridor}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    <div>
                      Distance
                      <p className="text-lg text-black lowercase mt-1">
                        {route.distanceKm} km
                      </p>
                    </div>
                    <div>
                      Est. Time
                      <p
                        className={`text-lg lowercase mt-1 ${
                          isRecommended
                            ? "text-green-500 font-bold"
                            : "text-black"
                        }`}
                      >
                        {route.durationMin} min
                      </p>
                    </div>
                    <div>
                      Fuel Cost
                      <p className="text-lg text-black lowercase mt-1">
                        ₱{route.fuelCostPhp}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-gray-500 mb-4">
                    CO2 Emission: {route.co2Kg.toFixed(2)} kg
                  </p>

                  <button
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 ${
                      isSelected
                        ? "bg-[#04162e] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isSelected ? "Start Route" : "Select Route"}
                    <span className="text-[10px]">▲</span>
                  </button>
                </div>
              );
            })}

          {!isLoading && displayRoutes.length === 0 && (
            <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm text-sm text-red-500 font-medium">
              No routes available. Check your origin/destination or Mapbox
              configuration.
            </div>
          )}
        </section>
      </main>

      <AppBottomNav
        activeTab="routes"
        onExplore={() => {}}
        onRecos={() => {}}
        onRoutes={() => {}}
        onProfile={() => {}}
      />
    </div>
  );
};

export default RouteComparisonScreen;
