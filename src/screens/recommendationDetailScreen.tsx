import AppBottomNav from "../components/layout/AppBottomNav";
import AppHeader from "../components/layout/AppHeader";

interface RecommendationDetailScreenProps {
  onBackToHome: () => void;
}

const RecommendationDetailScreen = ({
  onBackToHome,
}: RecommendationDetailScreenProps) => {
  return (
    <div className="min-h-dvh bg-white text-[#1a1c1e] flex flex-1 flex-col w-full">
      <AppHeader onMenuClick={onBackToHome} />

      {/* Main container constrained for PC and Mobile */}
      <main className="flex-1 px-4 sm:px-6 max-w-md w-full mx-auto space-y-6 pt-6 pb-28 md:pb-24">
        {/* Header Section */}
        <section className="space-y-3">
          <div className="inline-flex items-center px-3 py-1 bg-[#b4f9c8] text-[#00391c] rounded-full text-[10px] font-bold tracking-widest uppercase">
            Optimized Choice
          </div>
          <h2 className="font-headline text-4xl font-bold text-[#001d3d] leading-tight !my-0">
            Route B is your best bet!
          </h2>
          <p className="text-[#60778f] font-body text-base leading-relaxed">
            Low traffic on SRP avoids idling, saving you{" "}
            <span className="text-[#2ecc71] font-bold">₱125</span>.
          </p>
        </section>

        {/* Map Preview Card */}
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-[#e9eef2] shadow-sm">
          <img
            className="w-full h-full object-cover"
            alt="Route map preview"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH-J-fBM0jESK2J3YbzwmhuwVdxl8f4AHGYWWcePdAWEOqMt6AJZt5XGo3JaVMnY3RrJoihnmGWR_oGbur3-QBGUX7ucUxUBxNRzWYFBqQJjADbA-XqNz9YyGXqzg-jAE6Lxt_saTloO-RtBE9TPyi6Th_9BGu4QoqfCzqgiwupJsmwSP1rwLvw2zcdJ-ijUx9BFvNs9n7zIg1TcFsKOmFsUWW8d3hedgHajP5ylFE7j0DnBnBXifUerqpzjEAyXQgv3ZMe1sE_i1h"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Floating Duration Card */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col">
            <span className="text-[10px] text-[#60778f] uppercase font-bold tracking-widest">
              Est. Duration
            </span>
            <p className="font-headline text-2xl font-bold text-[#001d3d]">
              24 mins
            </p>
          </div>

          {/* Floating Eco Icon */}
          <div className="absolute bottom-4 right-4 bg-[#00391c] text-[#b4f9c8] p-3 rounded-full shadow-lg">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
        </div>

        {/* MISSING FEATURE: Eco-Impact Banner */}
        <section className="bg-[#00391c] p-5 rounded-3xl text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#b4f9c8] rounded-xl text-[#00391c]">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none uppercase tracking-tight">
                  Eco-Impact
                </h3>
                <p className="text-[10px] text-[#b4f9c8] uppercase font-bold tracking-tighter">
                  Carbon Footprint Saved
                </p>
              </div>
            </div>
            <span className="text-4xl font-bold text-[#b4f9c8]">28%</span>
          </div>
          <div className="flex items-start gap-2 pt-4 border-t border-white/10">
            <span className="material-symbols-outlined text-[14px] text-[#b4f9c8]">
              info
            </span>
            <p className="text-[10px] text-white/70 leading-tight">
              Calculated for a{" "}
              <span className="font-bold text-white">Standard Sedan</span> based
              on reduced idling time at SRP.
            </p>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60778f]">
              Cost Efficiency Comparison
            </h3>

            <div className="space-y-5">
              {/* Route B */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-[#001d3d]">
                    Route B (SRP Coastal)
                  </span>
                  <span className="text-sm font-bold text-[#2ecc71]">₱410</span>
                </div>
                <div className="h-2 w-full bg-[#e9eef2] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2ecc71] w-[65%] rounded-full" />
                </div>
              </div>

              {/* Route A */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-[#60778f]">
                    Route A (Natalio Bacalso)
                  </span>
                  <span className="text-sm font-bold text-[#001d3d]">₱535</span>
                </div>
                <div className="h-2 w-full bg-[#e9eef2] rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#001d3d]/05 border border-[#e9eef2] p-6 rounded-[32px] flex items-center gap-6">
              <span className="material-symbols-outlined text-[#2ecc71] text-[40px]">
                savings
              </span>
              <div>
                <h4 className="text-3xl font-bold text-[#001d3d]">₱125</h4>
                <p className="text-xs text-[#60778f]">
                  Saved compared to traffic-heavy alternatives.
                </p>
              </div>
            </div>

            <div className="bg-[#e9eef2] p-6 rounded-[32px] flex items-center gap-6">
              <span className="material-symbols-outlined text-[#001d3d] text-[40px]">
                speed
              </span>
              <div>
                <h4 className="text-2xl font-bold text-[#001d3d]">Flowing</h4>
                <p className="text-xs text-[#60778f]">
                  SRP currently reporting 45km/h average speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="pt-4 pb-12">
          <button className="w-full bg-[#001d3d] text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              navigation
            </span>
            Start Navigation
          </button>
          <p className="text-center text-[#60778f] text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">
            Redirecting to Google Maps or Waze
          </p>
        </section>
      </main>

      <AppBottomNav activeTab="routes" onExplore={onBackToHome} />
    </div>
  );
};

export default RecommendationDetailScreen;
