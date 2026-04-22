import React from "react";
import HomeScreen from "./screens/homeScreen";
import RecommendationDetailScreen from "./screens/recommendationDetailScreen";
import RouteComparisonScreen from "./screens/routeComparisonScreen";
import NavigationScreen from "./screens/navigationScreen";
import AppBottomNav from "./components/layout/AppBottomNav";
import type { TripRequest } from "./types/trip";
import {
  fetchTrafficRouteComparisons,
  type RouteComparisonResult,
} from "./services/mapboxDirections";
import { fallbackRoutes } from "./services/fallbackRoutes";

type Tab = "explore" | "recos" | "routes" | "profile";
type NavigationSource = "recos" | "routes";

type NavigationContext = {
  source: NavigationSource;
  action: "wait" | "goNow";
  routeName?: string;
  routeGeometry?: [number, number][];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("explore");
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);
  const [navigationContext, setNavigationContext] =
    React.useState<NavigationContext | null>(null);

  const [tripRequest, setTripRequest] = React.useState<TripRequest>({
    origin: "",
    destination: "",
    originCoord: null,
    destinationCoord: null,
    vehicleType: "car",
    fuelType: "gasoline",
    efficiencyKmPerUnit: 15.4,
    vehicleLabel: "Toyota Vios",
  });

  const [routeData, setRouteData] =
    React.useState<RouteComparisonResult | null>(null);
  const [routeDataLoading, setRouteDataLoading] = React.useState(false);
  const [routeDataError, setRouteDataError] = React.useState<string | null>(
    null,
  );

  // --- NAVIGATION HANDLERS ---

  const handleGoToRecos = () => {
    setIsNavigationOpen(false);
    setActiveTab("recos");
  };

  const handleBackToHome = () => {
    setIsNavigationOpen(false);
    setNavigationContext(null);
    setRouteData(null); // Clear data to reset the state
    setActiveTab("explore");
  };

  const handleStartNavigation = (payload: any, source: NavigationSource) => {
    setNavigationContext({
      source: source,
      action: payload.action || "goNow",
      routeName: payload.routeName,
      routeGeometry: payload.routeGeometry,
    });
    setIsNavigationOpen(true);
  };

  // --- DATA FETCHING ---
  React.useEffect(() => {
    if (activeTab !== "recos" && activeTab !== "routes") return;
    const destinationReady = Boolean(tripRequest.destination.trim());

    if (!tripRequest.originCoord || !destinationReady) {
      return;
    }

    const loadRouteData = async () => {
      setRouteDataLoading(true);
      try {
        const liveData = await fetchTrafficRouteComparisons(tripRequest);
        setRouteData(liveData);
        setRouteDataError(null);
      } catch {
        setRouteData({
          origin: tripRequest.origin,
          destination: tripRequest.destination,
          routes: fallbackRoutes,
        });
        setRouteDataError("Using fallback data.");
      } finally {
        setRouteDataLoading(false);
      }
    };
    void loadRouteData();
  }, [activeTab, tripRequest]);

  return (
    <main id="app-root" className="flex min-h-dvh w-full flex-col bg-slate-50">
      {/* 1. HOME SCREEN */}
      {!isNavigationOpen && activeTab === "explore" && (
        <HomeScreen
          tripRequest={tripRequest}
          onTripDraftChange={setTripRequest}
          onFindBestRoute={(trip) => {
            setTripRequest(trip);
            setActiveTab("recos");
          }}
        />
      )}

      {/* 2. RECOMMENDATIONS SCREEN */}
      {!isNavigationOpen && activeTab === "recos" && (
        <RecommendationDetailScreen
          onBackToHome={handleBackToHome}
          onNavigateToRecos={handleGoToRecos}
          onStartRoute={(p) => handleStartNavigation(p, "recos")}
          onViewAlternativeRoutes={() => {
            setActiveTab("routes");
          }}
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
        />
      )}

      {/* 3. ROUTES COMPARISON SCREEN */}
      {!isNavigationOpen && activeTab === "routes" && (
        <RouteComparisonScreen
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
          onStartRoute={(p) => handleStartNavigation(p, "routes")}
        />
      )}

      {/* 4. LIVE NAVIGATION */}
      {isNavigationOpen && (
        <NavigationScreen
          tripRequest={tripRequest}
          navigationContext={navigationContext}
          onBack={handleGoToRecos}
          onNavigateToRecos={handleGoToRecos}
        />
      )}

      {/* BOTTOM NAV */}
      {!isNavigationOpen && (
        <AppBottomNav
          activeTab={activeTab}
          onExplore={handleBackToHome}
          onRecos={handleGoToRecos}
          onRoutes={() => setActiveTab("routes")}
          onProfile={() => setActiveTab("profile")}
        />
      )}
    </main>
  );
};

export default App;
