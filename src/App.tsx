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
  type RouteScenario,
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
  const [preferredRouteId, setPreferredRouteId] = React.useState<
    RouteScenario["id"] | null
  >(null);
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

  React.useEffect(() => {
    if (activeTab !== "recos" && activeTab !== "routes") {
      return;
    }

    const loadRouteData = async () => {
      setRouteDataLoading(true);

      try {
        const requestWithRetry = async (
          attempt = 0,
        ): Promise<RouteComparisonResult> => {
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
        setRouteDataError(
          "Unable to fetch live traffic. Showing local fallback estimates.",
        );
      } finally {
        setRouteDataLoading(false);
      }
    };

    void loadRouteData();
  }, [activeTab, tripRequest]);

  return (
    <main id="app-root" className="flex min-h-dvh w-full flex-col">
      {/* SCREEN SWITCH */}
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

      {!isNavigationOpen && activeTab === "recos" && (
        <RecommendationDetailScreen
          onBackToHome={() => setActiveTab("explore")}
          onStartRoute={(payload) => {
            setNavigationContext({
              source: "recos",
              action: payload.action,
              routeName: payload.routeName,
              routeGeometry: payload.routeGeometry,
            });
            setIsNavigationOpen(true);
          }}
          onViewAlternativeRoutes={(routeId) => {
            setPreferredRouteId(routeId);
            setActiveTab("routes");
          }}
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
        />
      )}

      {!isNavigationOpen && activeTab === "routes" && (
        <RouteComparisonScreen
          tripRequest={tripRequest}
          routeData={routeData}
          isLoading={routeDataLoading}
          loadError={routeDataError}
          initialSelectedRouteId={preferredRouteId}
          onStartRoute={(payload) => {
            setNavigationContext({
              source: "routes",
              action: "goNow",
              routeName: payload.routeName,
              routeGeometry: payload.routeGeometry,
            });
            setIsNavigationOpen(true);
          }}
        />
      )}

      {isNavigationOpen && (
        <NavigationScreen
          tripRequest={tripRequest}
          navigationContext={navigationContext}
          onBack={() => setIsNavigationOpen(false)}
        />
      )}

      {!isNavigationOpen && activeTab === "profile" && (
        <div className="p-6">Profile Screen (placeholder)</div>
      )}

      {/* BOTTOM NAV */}
      {!isNavigationOpen && (
        <AppBottomNav
          activeTab={activeTab}
          onExplore={() => setActiveTab("explore")}
          onRecos={() => setActiveTab("recos")}
          onRoutes={() => setActiveTab("routes")}
          onProfile={() => setActiveTab("profile")}
        />
      )}
    </main>
  );
};

export default App;
