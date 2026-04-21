import { useMemo, useState } from "react";
import AppBottomNav from "../components/layout/AppBottomNav";
import AppHeader from "../components/layout/AppHeader";
import type { RouteComparisonResult } from "../services/mapboxDirections";
import { fallbackRoutes } from "../services/fallbackRoutes";
import {
  buildDisplayRoutes,
  getRecommendedRoute,
} from "../services/routeInsights";
import { applyVehicleMetrics } from "../services/vehicleMetrics";
import type { TripRequest } from "../types/trip";

interface RecommendationDetailScreenProps {
  onBackToHome: () => void;
  onStartRoute: (action: "wait" | "goNow") => void;
  onViewAlternativeRoutes: () => void;
  tripRequest: TripRequest;
  routeData: RouteComparisonResult | null;
  isLoading: boolean;
  loadError: string | null;
}

const RecommendationDetailScreen = ({
  onBackToHome,
  onStartRoute,
  onViewAlternativeRoutes,
  tripRequest,
  routeData,
  isLoading,
  loadError,
}: RecommendationDetailScreenProps) => {
  const [selectedAction, setSelectedAction] = useState<"wait" | "goNow">(
    "goNow",
  );
  const baseRoutes = routeData?.routes?.length
    ? routeData.routes
    : fallbackRoutes;
  const routes = useMemo(
    () => applyVehicleMetrics(baseRoutes, tripRequest),
    [baseRoutes, tripRequest],
  );
  const displayRoutes = useMemo(() => buildDisplayRoutes(routes), [routes]);
  const recommendedRoute = useMemo(
    () => getRecommendedRoute(displayRoutes),
    [displayRoutes],
  );

  const directRoute = useMemo(
    () =>
      displayRoutes.find((route) => route.id === "routeA") ?? displayRoutes[0],
    [displayRoutes],
  );

  const alternativeRoute = useMemo(
    () =>
      displayRoutes
        .filter((route) => route.id !== directRoute?.id)
        .sort((routeA, routeB) => routeA.fuelCostPhp - routeB.fuelCostPhp)[0],
    [directRoute?.id, displayRoutes],
  );

  const isCongested =
    (directRoute?.durationMin ?? 0) > (recommendedRoute?.durationMin ?? 0);
  const goNowFuelCostPhp = directRoute?.fuelCostPhp ?? 0;
  const alternativeFuelCostPhp =
    alternativeRoute?.fuelCostPhp ?? recommendedRoute?.fuelCostPhp ?? 0;
  const congestionGapRatio =
    directRoute && recommendedRoute
      ? Math.max(
          0,
          (directRoute.durationMin - recommendedRoute.durationMin) /
            Math.max(1, directRoute.durationMin),
        )
      : 0;
  const waitFuelReductionPct = isCongested
    ? Math.min(25, Math.max(8, congestionGapRatio * 100 * 0.9))
    : 5;
  const waitModeFuelCostPhp = Math.max(
    0,
    Math.round(goNowFuelCostPhp * (1 - waitFuelReductionPct / 100)),
  );
  const suggestedWaitMinutes = Math.max(
    10,
    (directRoute?.durationMin ?? 0) - (recommendedRoute?.durationMin ?? 0),
  );
  const waitModeSavingsPhp = Math.max(
    0,
    goNowFuelCostPhp - waitModeFuelCostPhp,
  );
  const fuelSmartSavingsPhp = Math.max(
    0,
    goNowFuelCostPhp - alternativeFuelCostPhp,
  );

  const startRouteCtaLabel =
    selectedAction === "wait"
      ? `Start Route (Wait ${suggestedWaitMinutes} mins)`
      : "Start Route (Go Now)";

  const resolvedOrigin = routeData?.origin ?? tripRequest.origin;
  const resolvedDestination = routeData?.destination ?? tripRequest.destination;

  return (
    <div className="min-h-dvh bg-[#f0f4f8] text-[#1a1c1e] flex flex-1 flex-col w-full">
      <AppHeader onMenuClick={onBackToHome} />

      <main className="flex-1 px-4 sm:px-6 max-w-md w-full mx-auto space-y-6 pt-6 pb-28">
        {loadError && (
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-xs font-semibold text-yellow-700">
            {loadError}
          </div>
        )}

        {/* 1. THE DIRECT ROUTE (The Baseline) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline text-2xl font-bold text-[#001d3d]">
              Direct Route Detail
            </h2>
            <span className="text-[10px] font-bold text-[#60778f] uppercase tracking-widest">
              {directRoute?.corridor ?? "Route Analysis"}
            </span>
          </div>

          <p className="text-[11px] text-[#60778f] font-semibold leading-tight">
            {resolvedOrigin} to {resolvedDestination}
          </p>

          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#e9eef2] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${isCongested ? "bg-red-500 animate-pulse" : "bg-[#2ecc71]"}`}
                />
                <span className="text-sm font-bold text-[#001d3d]">
                  {isCongested ? "Heavy Congestion Detected" : "Optimal Flow"}
                </span>
              </div>
              <span className="text-lg font-black text-[#001d3d]">
                {directRoute ? `₱${directRoute.fuelCostPhp}` : "..."}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#60778f]">
              CO2 Emission: {directRoute ? `${directRoute.co2Kg.toFixed(2)} kg` : "..."}
            </p>

            {/* Minimal Map Strip for context */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${isCongested ? "bg-red-500" : "bg-green-500"}`}
                style={{
                  width: `${Math.min(100, directRoute?.efficiencyScore ?? 0)}%`,
                }}
              />
              <div
                className="h-full bg-gray-200"
                style={{
                  width: `${100 - Math.min(100, directRoute?.efficiencyScore ?? 0)}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* 2. TACTICAL DECISION HUB */}
        <section className="pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#60778f] text-sm">
              analytics
            </span>
            <h3 className="text-[10px] font-bold text-[#60778f] uppercase tracking-[0.2em]">
              Tactical Recommendations
            </h3>
          </div>
          <div className="bg-[#e8eef5] rounded-2xl px-4 py-3 border border-[#d8e1ea]">
            <p className="text-[11px] font-semibold text-[#001d3d] leading-tight">
              Is it better to go now, wait, or take a different route?
            </p>
            <p className="text-[10px] text-[#60778f] mt-1">
              Baseline now:{" "}
              <span className="font-bold">₱{goNowFuelCostPhp}</span> fuel
              estimate on {directRoute?.name ?? "Direct Route"}.
            </p>
          </div>

          <div className="space-y-4 mt-4">
            <div className="bg-white rounded-[24px] p-5 border-2 border-[#001d3d] relative shadow-md">
              <div className="absolute -top-3 left-6 bg-[#001d3d] text-white px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter">
                Wait Mode (Delay Entry Option)
              </div>
              <div className="flex justify-between items-start pt-2">
                <div>
                  <h4 className="text-base font-bold text-[#001d3d]">
                    Delay Entry: +{suggestedWaitMinutes} mins
                  </h4>
                  <p className="text-[11px] text-[#60778f] leading-tight mt-1">
                    Enter later when congestion eases to reduce stop-and-go fuel
                    waste.
                  </p>
                  <p className="text-[10px] text-[#001d3d] font-semibold mt-2">
                    Estimated fuel cost: ₱{waitModeFuelCostPhp}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2ecc71]">
                    -₱{waitModeSavingsPhp}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400">
                    VS GO NOW
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#00391c] rounded-[24px] p-5 shadow-lg">
              <div className="flex justify-between mb-2">
                <span className="text-[9px] font-bold text-[#b4f9c8] uppercase tracking-widest">
                  Fuel-Smart Mode (Immediate Action Option)
                </span>
                <span className="text-[9px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                  Go Now
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {alternativeRoute?.corridor ??
                      recommendedRoute?.corridor ??
                      "Best Alternative"}
                  </h4>
                  <p className="text-[11px] text-[#b4f9c8]/70">
                    Estimated fuel cost: ₱{alternativeFuelCostPhp}
                  </p>
                  <p className="text-[10px] text-[#b4f9c8] font-semibold mt-2">
                    Savings vs go now: ₱{fuelSmartSavingsPhp}
                  </p>
                </div>
                <span className="material-symbols-outlined text-white/50">
                  arrow_forward_ios
                </span>
              </div>
            </div>
          </div>
        </section>

        {isLoading && (
          <section className="bg-white rounded-[24px] p-5 border border-[#e9eef2] text-sm text-gray-500 font-medium">
            Loading synchronized trip recommendations...
          </section>
        )}

        {/* 3. EXECUTION FOOTER */}
        <section className="pt-6 pb-12">
          <div className="bg-white rounded-2xl border border-[#d8e1ea] p-4 mb-4">
            <p className="text-[10px] font-bold text-[#60778f] uppercase tracking-widest mb-3">
              Choose Your Action
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction("wait")}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                  selectedAction === "wait"
                    ? "bg-[#001d3d] text-white"
                    : "bg-[#eef3f8] text-[#60778f]"
                }`}
              >
                Wait Mode
              </button>
              <button
                type="button"
                onClick={() => setSelectedAction("goNow")}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                  selectedAction === "goNow"
                    ? "bg-[#00391c] text-white"
                    : "bg-[#eef3f8] text-[#60778f]"
                }`}
              >
                Go Now
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onStartRoute(selectedAction)}
              className="w-full bg-[#001d3d] text-white py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 transition-all"
            >
              <span className="material-symbols-outlined">directions_run</span>
              {startRouteCtaLabel}
            </button>

            <button
              type="button"
              onClick={onViewAlternativeRoutes}
              className="w-full bg-white text-[#001d3d] py-4 rounded-2xl font-bold text-sm border-2 border-[#001d3d] active:scale-[0.98] flex items-center justify-center gap-3 transition-all"
            >
              <span className="material-symbols-outlined">alt_route</span>
              View Alternative Routes
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#e9eef2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#60778f]">
                info
              </span>
            </div>
            <p className="text-[10px] text-[#60778f] leading-tight">
              Calculations adjusted for{" "}
              <span className="font-bold">
                {tripRequest.vehicleLabel ?? "selected vehicle"}
              </span>{" "}
              using{" "}
              <span className="font-bold">
                {tripRequest.fuelType ?? "gasoline"}
              </span>{" "}
              fuel profile.
            </p>
          </div>
        </section>
      </main>

      <AppBottomNav activeTab="recos" onExplore={onBackToHome} />
    </div>
  );
};

export default RecommendationDetailScreen;
