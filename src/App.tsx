import React from "react";
import HomeScreen from "./screens/homeScreen";
import RecommendationDetailScreen from "./screens/recommendationDetailScreen";

type Screen = "home" | "recommendation";

const App: React.FC = () => {
  const [screen, setScreen] = React.useState<Screen>("home");

  return (
    <main id="app-root">
      {screen === "home" ? (
        <HomeScreen onFindBestRoute={() => setScreen("recommendation")} />
      ) : (
        <RecommendationDetailScreen onBackToHome={() => setScreen("home")} />
      )}
    </main>
  );
};

export default App;
