interface RecommendationDetailScreenProps {
  onBackToHome: () => void;
}

const RecommendationDetailScreen = ({ onBackToHome }: RecommendationDetailScreenProps) => {
  return (
    <div className="min-h-screen bg-surface text-on-surface pb-32">
      <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]">
        <div className="mx-auto max-w-2xl px-6 py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="material-symbols-outlined text-[#000d22]"
              aria-label="Back to home"
              onClick={onBackToHome}
            >
              menu
            </button>
            <h1 className="font-heading font-bold tracking-tight uppercase text-lg text-[#000d22] !my-0">
              Sugbo-Move Lite
            </h1>
          </div>

          <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary overflow-hidden">
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvC1E4h5lFSnFC56r5RhVzIv2PIi-zT6CmOTVoV6dfWX20m_N9B0W9e_5MovavoPGyeLboUySjRaPAh55rmLgSxuWO1dCmOTIPz_DlZqwxcfttk_eKg1bK4cHakX0aSvL9cno8LM-UWndMnNzZuQlBOqomvP2WdLW7ElTf9FKfF_Z0QBX81n_5i0G9yLF8trEQZWS9Pon1oTrM2MT7EGwJ7YGcxisLmnDFZIzWb49ypRH-yw8UladFD0sicSPJhu9DZdejybXAgt21"
            />
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-label font-bold tracking-widest uppercase">
            Optimized Choice
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary leading-tight tracking-tighter !my-0">
            Route B is your best bet!
          </h2>
          <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-md">
            Low traffic on SRP avoids idling, saving you <span className="text-on-tertiary-container font-bold">₱125</span>.
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
              <p className="font-headline text-2xl font-bold text-primary">24 mins</p>
            </div>
            <div className="bg-tertiary-container text-tertiary-fixed p-3 rounded-full shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
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
                  <span className="font-body font-bold text-primary">Route B (SRP Coastal)</span>
                  <span className="font-headline font-bold text-on-tertiary-container">₱410</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-on-tertiary-container to-tertiary-fixed-dim w-[65%] rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-body font-medium text-on-surface-variant">Route A (Natalio Bacalso)</span>
                  <span className="font-body font-bold text-on-surface">₱535</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant/40 w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-tertiary-container p-6 rounded-2xl flex flex-col justify-between aspect-square md:aspect-auto">
            <span className="material-symbols-outlined text-tertiary-fixed text-4xl">savings</span>
            <div>
              <h4 className="font-headline text-3xl font-bold text-on-tertiary-container leading-none !my-0">₱125</h4>
              <p className="font-body text-sm text-tertiary-fixed/80 mt-2">
                Saved compared to traffic-heavy alternatives.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-highest p-6 rounded-2xl flex flex-col justify-between">
            <span className="material-symbols-outlined text-primary text-4xl">speed</span>
            <div>
              <h4 className="font-headline text-3xl font-bold text-primary leading-none !my-0">Flowing</h4>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                SRP currently reporting 45km/h average speed.
              </p>
            </div>
          </div>
        </section>

        <section className="pt-4 pb-8">
          <button className="w-full glass-gradient text-white py-5 px-8 rounded-xl font-headline font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              navigation
            </span>
            Start Navigation
          </button>
          <p className="text-center text-on-surface-variant font-label text-[10px] mt-4 uppercase tracking-[0.2em]">
            Redirecting to Google Maps or Waze
          </p>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white border-t border-[#e6e8ea]/15 shadow-[0_-4px_24px_rgba(0,13,34,0.06)] rounded-t-2xl">
        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4"
          onClick={onBackToHome}
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">Explore</span>
        </button>
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white rounded-xl py-2 px-4 shadow-lg">
          <span className="material-symbols-outlined">directions_car</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">Routes</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">Savings</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default RecommendationDetailScreen;
