import AppBottomNav from "../components/layout/AppBottomNav";
import AppHeader from "../components/layout/AppHeader";

interface RecommendationDetailScreenProps {
  onBackToHome: () => void;
}

const RecommendationDetailScreen = ({
  onBackToHome,
}: RecommendationDetailScreenProps) => {
  return (
    <div className="min-h-dvh bg-surface text-on-surface flex flex-1 flex-col w-full">
      <AppHeader onMenuClick={onBackToHome} />

      <main className="flex-1 px-4 sm:px-6 max-w-2xl w-full mx-auto space-y-8 pt-6 pb-28 md:pb-10">
        <section className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-label font-bold tracking-widest uppercase">
            Optimized Choice
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tighter !my-0">
            Route B is your best bet!
          </h2>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-md">
            Low traffic on SRP avoids idling, saving you{" "}
            <span className="text-on-tertiary-container font-bold">₱125</span>.
          </p>
        </section>

        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container shadow-sm">
          <img
            className="w-full h-full object-cover opacity-90"
            alt="Route map preview"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH-J-fBM0jESK2J3YbzwmhuwVdxl8f4AHGYWWcePdAWEOqMt6AJZt5XGo3JaVMnY3RrJoihnmGWR_oGbur3-QBGUX7ucUxUBxNRzWYFBqQJjADbA-XqNz9YyGXqzg-jAE6Lxt_saTloO-RtBE9TPyi6Th_9BGu4QoqfCzqgiwupJsmwSP1rwLvw2zcdJ-ijUx9BFvNs9n7zIg1TcFsKOmFsUWW8d3hedgHajP5ylFE7j0DnBnBXifUerqpzjEAyXQgv3ZMe1sE_i1h"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-xl shadow-lg border-l-4 border-on-tertiary-container">
              <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                Est. Duration
              </span>
              <p className="font-headline text-2xl font-bold text-primary">
                24 mins
              </p>
            </div>
            <div className="bg-tertiary-container text-tertiary-fixed p-3 rounded-full shadow-lg">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-2xl col-span-1 md:col-span-2 space-y-6">
            <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant !my-0">
              Cost Efficiency Comparison
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-body font-bold text-primary">
                    Route B (SRP Coastal)
                  </span>
                  <span className="font-headline font-bold text-on-tertiary-container">
                    ₱410
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-on-tertiary-container to-tertiary-fixed-dim w-[65%] rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-body font-medium text-on-surface-variant">
                    Route A (Natalio Bacalso)
                  </span>
                  <span className="font-body font-bold text-on-surface">
                    ₱535
                  </span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant/40 w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-tertiary-container p-6 rounded-2xl flex flex-col justify-between aspect-square md:aspect-auto">
            <span className="material-symbols-outlined text-tertiary-fixed text-4xl">
              savings
            </span>
            <div>
              <h4 className="font-headline text-3xl font-bold text-on-tertiary-container leading-none !my-0">
                ₱125
              </h4>
              <p className="font-body text-sm text-tertiary-fixed/80 mt-2">
                Saved compared to traffic-heavy alternatives.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-highest p-6 rounded-2xl flex flex-col justify-between">
            <span className="material-symbols-outlined text-primary text-4xl">
              speed
            </span>
            <div>
              <h4 className="font-headline text-3xl font-bold text-primary leading-none !my-0">
                Flowing
              </h4>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                SRP currently reporting 45km/h average speed.
              </p>
            </div>
          </div>
        </section>

        <section className="pt-4 pb-8">
          <button className="w-full glass-gradient text-white py-5 px-8 rounded-xl font-headline font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              navigation
            </span>
            Start Navigation
          </button>
          <p className="text-center text-on-surface-variant font-label text-[10px] mt-4 uppercase tracking-[0.2em]">
            Redirecting to Google Maps or Waze
          </p>
        </section>
      </main>

      <AppBottomNav activeTab="routes" onExplore={onBackToHome} />
    </div>
  );
};

export default RecommendationDetailScreen;
