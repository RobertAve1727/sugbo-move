import React from "react";
import HomeScreen from "./screens/homeScreen";
import RecommendationDetailScreen from "./screens/recommendationDetailScreen";
import RouteComparisonScreen from "./screens/routeComparisonScreen";
import AppBottomNav from "./components/layout/AppBottomNav";

type Tab = "explore" | "recos" | "routes" | "profile";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<Tab>("explore");

  return (
    <main id="app-root" className="flex min-h-dvh w-full flex-col">
      
      {/* SCREEN SWITCH */}
      {activeTab === "explore" && (
        <HomeScreen
          onFindBestRoute={() => setActiveTab("recos")}
        />
      )}

      {activeTab === "recos" && (
        <RecommendationDetailScreen
          onBackToHome={() => setActiveTab("explore")}
        />
      )}

      {activeTab === "routes" && <RouteComparisonScreen />}

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