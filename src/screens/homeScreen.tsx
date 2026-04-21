import { IconButton } from "../components/ui/IconButton";
import { MetricCard } from "../components/ui/MetricCard";
import { RouteEntry } from "../features/navigations/components/RouteEntry";
import { RecentTrips } from "../features/navigations/components/RecentTrips";

const HomeScreen = () => {
  return (
    <div className="relative min-h-screen bg-bg">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4">
          <IconButton icon="menu" className="text-text-h" />
          <h1 className="text-lg font-bold tracking-tighter uppercase font-heading !my-0 text-text-h">
            Sugbo-Move Lite
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-accent/20 overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Profile"
          />
        </div>
      </header>

      <main className="relative z-10 px-6 pt-24 pb-32 max-w-xl mx-auto">
        <section className="mb-10 text-left">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
            Cebu Tactical Navigator
          </span>
          <h2 className="text-text-h text-4xl lg:text-5xl font-extrabold tracking-tighter leading-tight">
            Plan Your <br /> Movement.
          </h2>
          <p className="text-text font-medium text-sm max-w-[280px] mt-2">
            High-efficiency routing for the busy streets of Sugbo.
          </p>
        </section>

        <RouteEntry />

        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetricCard
            icon="eco"
            value="15.4"
            unit="KM/L"
            label="Target Efficiency"
            iconColorClass="text-accent"
          />
          <MetricCard
            icon="schedule"
            value="12"
            unit="MIN"
            label="Avg. Savings"
            iconColorClass="text-text-h"
          />
        </div>

        <RecentTrips />
      </main>
    </div>
  );
};

export default HomeScreen;
