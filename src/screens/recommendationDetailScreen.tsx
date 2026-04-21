import AppBottomNav from "../components/layout/AppBottomNav";
import AppHeader from "../components/layout/AppHeader";

interface RecommendationDetailScreenProps {
  onBackToHome: () => void;
  isCongested?: boolean;
}

const RecommendationDetailScreen = ({
  onBackToHome,
  isCongested = true,
}: RecommendationDetailScreenProps) => {
  return (
    <div className="min-h-dvh bg-[#f0f4f8] text-[#1a1c1e] flex flex-1 flex-col w-full">
      <AppHeader onMenuClick={onBackToHome} />

      <main className="flex-1 px-4 sm:px-6 max-w-md w-full mx-auto space-y-6 pt-6 pb-28">
        {/* 1. THE DIRECT ROUTE (The Baseline) */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline text-2xl font-bold text-[#001d3d]">
              Direct Route Detail
            </h2>
            <span className="text-[10px] font-bold text-[#60778f] uppercase tracking-widest">
              Via SRP Coastal
            </span>
          </div>

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
              <span className="text-lg font-black text-[#001d3d]">₱535</span>
            </div>

            {/* Minimal Map Strip for context */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500 w-1/3" />
              <div className="h-full bg-red-400 w-1/3" />
              <div className="h-full bg-red-600 w-1/3" />
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

          {isCongested ? (
            <div className="space-y-4">
              {/* WAIT MODE: Direct Route + Timing */}
              <div className="bg-white rounded-[24px] p-5 border-2 border-[#001d3d] relative shadow-md">
                <div className="absolute -top-3 left-6 bg-[#001d3d] text-white px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter">
                  Wait Mode (Recommended)
                </div>
                <div className="flex justify-between items-start pt-2">
                  <div>
                    <h4 className="text-base font-bold text-[#001d3d]">
                      Delayed Entry: 5:45 PM
                    </h4>
                    <p className="text-[11px] text-[#60778f] leading-tight mt-1">
                      Stick to the{" "}
                      <span className="font-bold text-[#001d3d]">
                        Direct Route
                      </span>
                      , but wait 45 mins <br />
                      to bypass the peak congestion wave.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#2ecc71]">-₱125</p>
                    <p className="text-[10px] font-bold text-gray-400">
                      SAVINGS
                    </p>
                  </div>
                </div>
              </div>

              {/* FUEL-SMART: Alternative Path */}
              <div className="bg-[#00391c] rounded-[24px] p-5 shadow-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] font-bold text-[#b4f9c8] uppercase tracking-widest">
                    Fuel-Smart Pivot
                  </span>
                  <span className="text-[9px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    Go Now
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Via CCLEX Alternative
                    </h4>
                    <p className="text-[11px] text-[#b4f9c8]/70">
                      Zero congestion, ₱410 fuel cost.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-white/50">
                    arrow_forward_ios
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#b4f9c8]/20 rounded-[24px] p-8 border-2 border-dashed border-[#b4f9c8] text-center">
              <span className="material-symbols-outlined text-[#00391c] text-3xl mb-2">
                verified
              </span>
              <h4 className="text-sm font-bold text-[#00391c]">
                Direct Route is Optimal
              </h4>
              <p className="text-[11px] text-[#00391c]/60 mt-1">
                Proceed immediately for maximum fuel efficiency.
              </p>
            </div>
          )}
        </section>

        {/* 3. EXECUTION FOOTER */}
        <section className="pt-6 pb-12">
          <button className="w-full bg-[#001d3d] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 transition-all">
            <span className="material-symbols-outlined">directions_run</span>
            Execute Selected Strategy
          </button>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#e9eef2] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-[#60778f]">
                info
              </span>
            </div>
            <p className="text-[10px] text-[#60778f] leading-tight">
              Calculations adjusted for{" "}
              <span className="font-bold">Toyota Vios</span> idling rate at
              0.6L/hour.
            </p>
          </div>
        </section>
      </main>

      <AppBottomNav activeTab="routes" onExplore={onBackToHome} />
    </div>
  );
};

export default RecommendationDetailScreen;
