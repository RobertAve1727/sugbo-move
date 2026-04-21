interface HomeScreenProps {
  onFindBestRoute: () => void;
}

const HomeScreen = ({ onFindBestRoute }: HomeScreenProps) => {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <header className="bg-[#f7f9fb] fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button type="button" className="text-[#000d22] hover:opacity-80 transition-opacity" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-extrabold tracking-tighter text-[#000d22] font-[Plus_Jakarta_Sans] uppercase !my-0">
            Sugbo-Move Lite
          </h1>
        </div>

        <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10">
          <img
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvmtNpLMgtih5wtg0kIF7FTmfe_I84XiL_b3cvXGL5PB5gRzMgXf4tLn5AV5kYuyU_94IdJiqs5z9F0kWSNYxrU4Vi6XzaPH85VyprujVJdcl-x_AtLCrItyMm7knzmz9vzlDEqp8g0koLyNpg1wWQpUid0lmkKhumCHvCDmYhRMJBtkF9z26jx-OL87Es0z1BWWGzLPoF-nvo-m_NuiTBCAhKKv7OhXMvzvH3QKgIO3R4zE7GZCemihzng92LsCDv_RsrhsLfFuFQ"
          />
        </div>
      </header>

      <main className="min-h-screen pt-20 pb-32">
        <div className="fixed inset-0 z-0 opacity-40 grayscale pointer-events-none">
          <img
            alt="Cebu map background"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTbbAu_kL_gdiTVbw-Xvao4vj0ndKZYR7RdbYwmxlat_AGXtluVOJT0Q5ik8FIou60sLGwswwVIYbJ0e4MzbQJ2xnqT54-LQ5E_nvxUTNysnwwM04li1KCJVU2gi33xa05sYUbWz2rcXqoo9qr8jFeMPCZA9YMlRV9QxL__8Biv5gvlBP7xT_7QLAQOm56S7bL-mfIhd43TObkHYEBOAMwlCFH3k6-MUXU2yPud9Uw3qVklA96I2sEkZFWHd12K9vkz2BYDRW7XLKO"
          />
        </div>

        <section className="relative z-10 px-6 max-w-xl mx-auto text-left">
          <div className="mt-8 mb-10">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container mb-2 block">
              Cebu Tactical Navigator
            </span>
            <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-primary leading-none mb-4 !my-0">
              Plan Your
              <br />
              Movement.
            </h2>
            <p className="text-on-surface-variant font-body font-medium text-sm max-w-[280px]">
              High-efficiency routing for the busy streets of Sugbo.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-[12px] rounded-xl p-6 shadow-[0_24px_40px_rgba(0,13,34,0.04)] mb-8">
            <div className="space-y-4 relative">
              <div className="absolute left-[19px] top-10 bottom-10 w-[2px] bg-surface-container-highest" />

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-primary text-[20px]">my_location</span>
                </div>
                <div className="flex-1">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Origin
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest focus:border-primary focus:ring-0 font-body font-bold text-primary placeholder:text-outline-variant p-0 pb-1 transition-colors"
                    placeholder="Current Location"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center z-10 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-white text-[20px]">location_on</span>
                </div>
                <div className="flex-1">
                  <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-outline mb-1">
                    Destination
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest focus:border-primary focus:ring-0 font-body font-bold text-primary placeholder:text-outline-variant p-0 pb-1 transition-colors"
                    placeholder="Where to?"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onFindBestRoute}
              className="mt-10 w-full h-14 bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white rounded-lg font-headline font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Find Best Route
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl">
              <span className="material-symbols-outlined text-on-tertiary-container mb-3">eco</span>
              <div className="font-headline text-2xl font-extrabold text-primary">
                15.4 <span className="text-xs font-label">KM/L</span>
              </div>
              <div className="font-label text-[10px] font-bold uppercase tracking-tighter text-outline mt-1">
                Target Efficiency
              </div>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl">
              <span className="material-symbols-outlined text-primary mb-3">schedule</span>
              <div className="font-headline text-2xl font-extrabold text-primary">
                12 <span className="text-xs font-label">MIN</span>
              </div>
              <div className="font-label text-[10px] font-bold uppercase tracking-tighter text-outline mt-1">Avg. Savings</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-label text-[11px] font-bold uppercase tracking-widest text-outline mb-4 flex items-center gap-2 !my-0">
              Recent Trips
              <div className="h-[1px] flex-1 bg-surface-container-high" />
            </h3>
            <div className="space-y-3 mt-4">
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">work</span>
                  <div>
                    <div className="font-body font-bold text-primary text-sm">IT Park Tower 1</div>
                    <div className="font-label text-[10px] text-on-surface-variant uppercase">Via Salinas Drive</div>
                  </div>
                </div>
                <div className="bg-tertiary-container px-2 py-1 rounded text-[10px] font-label font-bold text-on-tertiary-container tracking-wider uppercase">
                  Efficient
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between group hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">home</span>
                  <div>
                    <div className="font-body font-bold text-primary text-sm">Mactan Heights</div>
                    <div className="font-label text-[10px] text-on-surface-variant uppercase">Via CCLEX</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <span className="text-xs font-bold">FAST</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white shadow-[0_-4px_24px_rgba(0,13,34,0.06)] border-t border-[#e6e8ea]/15 rounded-t-2xl">
        <button
          type="button"
          className="flex flex-col items-center justify-center bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white rounded-xl py-2 px-4 shadow-lg transition-all duration-300 ease-in-out active:scale-90"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">Explore</span>
        </button>

        <button
          type="button"
          onClick={onFindBestRoute}
          className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4 hover:text-[#000d22] transition-all duration-300 ease-in-out active:scale-90"
        >
          <span className="material-symbols-outlined">directions_car</span>
          <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">Routes</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4 hover:text-[#000d22] transition-all duration-300 ease-in-out active:scale-90"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">Savings</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center justify-center text-[#c4c6cf] py-2 px-4 hover:text-[#000d22] transition-all duration-300 ease-in-out active:scale-90"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeScreen;
