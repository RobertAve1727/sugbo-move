import React from "react";
import HomeScreen from "./screens/homeScreen";
import RecommendationDetailScreen from "./screens/recommendationDetailScreen";
import RouteComparisonScreen from "./screens/routeComparisonScreen";
import AppBottomNav from "./components/layout/AppBottomNav";
import type { TripRequest } from "./types/trip";
import {
  fetchTrafficRouteComparisons,
  type RouteComparisonResult,
} from "./services/mapboxDirections";
import { fallbackRoutes } from "./services/fallbackRoutes";

type Tab = "explore" | "recos" | "routes" | "profile";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("explore");
  const [tripRequest, setTripRequest] = React.useState<TripRequest>({
    origin: "IT Park, Lahug",
    destination: "Mactan Newtown, Lapu-Lapu City",
    originCoord: null,
    destinationCoord: null,
  });
  const [routeData, setRouteData] = React.useState<RouteComparisonResult | null>(null);
  const [routeDataLoading, setRouteDataLoading] = React.useState(false);
  const [routeDataError, setRouteDataError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeTab === "explore") {
      return;
    }

    const loadRouteData = async () => {
      setRouteDataLoading(true);

      try {
        const requestWithRetry = async (attempt = 0): Promise<RouteComparisonResult> => {
          try {
            return await fetchTrafficRouteComparisons(tripRequest);
          } catch (error) {
            if (attempt >= 2) {
              throw error;
            }

            const waitMs = (attempt + 1) * 500;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            return requestWithRetry(attempt + 1);
          }
        };

        const liveData = await requestWithRetry();
        setRouteData(liveData);
        setRouteDataError(null);
      } catch {
        setRouteData({
          origin: tripRequest.origin,
          destination: tripRequest.destination,
          routes: fallbackRoutes,
        });
        setRouteDataError("Unable to fetch live traffic. Showing local fallback estimates.");
      } finally {
        setRouteDataLoading(false);
      }
    };

    void loadRouteData();
  }, [activeTab, tripRequest]);

  return (
    <main id="app-root" className="flex min-h-dvh w-full flex-col">
      
      {/* SCREEN SWITCH */}
      {activeTab === "explore" && (
        <HomeScreen
          tripRequest={tripRequest}
          onTripDraftChange={setTripRequest}
          onFindBestRoute={(trip) => {
            setTripRequest(trip);
            setActiveTab("routes");
          }}
        />
      )}

      {activeTab === "recos" && (
        <RecommendationDetailScreen
          onBackToHome={() => setActiveTab("explore")}
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
        />
      )}

      {activeTab === "routes" && (
        <RouteComparisonScreen
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
        />
      )}

      {activeTab === "profile" && (
        <div className="p-6">Profile Screen (placeholder)</div>
      )}

      {/* BOTTOM NAV */}
      <AppBottomNav
        activeTab={activeTab}
        onExplore={() => setActiveTab("explore")}
        onRecos={() => setActiveTab("recos")}
        onRoutes={() => setActiveTab("routes")}
        onProfile={() => setActiveTab("profile")}
      />
    </main>
  );
};

export default App;