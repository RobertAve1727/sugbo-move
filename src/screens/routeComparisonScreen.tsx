import React from "react";
import AppHeader from "../components/layout/AppHeader";
import AppBottomNav from "../components/layout/AppBottomNav";

const RouteComparisonScreen: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-primary selection:text-on-primary">

      {/* APP HEADER */}
      <AppHeader />

      {/* MAIN */}
      <main className="pt-24 pb-40 px-6 max-w-xl mx-auto">

        {/* HERO */}
        <section className="relative h-64 rounded-xl overflow-hidden mb-10 shadow-lg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB68SE7Os7OGabd33YQU7OgzJ-yLdgCjTW-Eiv9gUBhBGbBw4g5XuG0wKZqBrvwvplhS4HPvGP1u1tLxsbcCyTMN6a4iWcvpfvCOBHFRfRfS_1ZzwZNKzfRepjhaAp5rvFFUjb7y6xWcsdv1IUWgaoyd0CDcHUFJVLkCBVJDc6u77FUBb5lP2igjQ8Od8OlFOkwIZw9TbgnVjHaLsNr3TqMT0wcFzZ7-hnuZRO89ZaI0db7AvAgF7VQ_tGOwQE28_0fLDG7fXUmmJqb"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            <span className="font-label text-[10px] font-bold uppercase tracking-wider bg-primary px-3 py-1 rounded-full">
              Real-time Analysis
            </span>

            <h2 className="font-headline text-3xl font-extrabold mt-3 tracking-tighter">
              SUGBO-MOVELITE
            </h2>
          </div>
        </section>

        {/* RECOMMENDATION */}
        <section className="grid gap-6 mb-10">

          <div className="bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white p-6 rounded-xl shadow-xl">
            <p className="font-label text-[10px] font-bold uppercase tracking-wider mb-3">
              Recommended Strategy
            </p>

            <h3 className="font-headline text-2xl font-bold mb-2 tracking-tight">
              Route B is your best bet today.
            </h3>

            <p className="text-sm opacity-80 mb-5">
              Optimized for cost efficiency and low traffic density.
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-green-300">
                ₱125
              </span>
              <span className="text-xs uppercase tracking-wider opacity-80">
                Saved vs Route C
              </span>
            </div>
          </div>

          {/* EFFICIENCY */}
          <div className="bg-tertiary-container p-6 rounded-xl text-center">
            <p className="font-label text-[10px] font-bold uppercase tracking-wider mb-2">
              Total Efficiency
            </p>

            <div className="font-headline text-4xl font-extrabold text-on-tertiary-container">
              90%
            </div>

            <p className="text-sm mt-2 text-on-tertiary-container">
              Maximum Savings Achieved
            </p>
          </div>
        </section>

        {/* ROUTES */}
        <section className="space-y-4">

          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-yellow-400">
            <h4 className="font-body font-bold text-primary text-lg">
              Route A
            </h4>
            <p className="text-sm text-on-surface-variant mt-1">
              12.4 km • 22 min • ₱240
            </p>

            <button className="mt-4 w-full h-12 bg-surface-container-highest rounded-lg font-label text-[10px] font-bold uppercase tracking-widest">
              Select
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border-l-4 border-green-400 shadow-lg relative">
            <span className="absolute top-3 right-3 text-[10px] bg-green-300 px-2 py-1 rounded font-bold uppercase">
              Cheapest
            </span>

            <h4 className="font-body font-bold text-primary text-lg">
              Route B
            </h4>

            <p className="text-sm text-on-surface-variant mt-1">
              14.8 km • 28 min • ₱185
            </p>

            <button className="mt-4 w-full h-12 bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white rounded-lg font-headline font-bold uppercase tracking-widest">
              Start Route
            </button>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-red-400">
            <h4 className="font-body font-bold text-primary text-lg">
              Route C
            </h4>
            <p className="text-sm text-on-surface-variant mt-1">
              11.2 km • 45 min • ₱310
            </p>

            <button className="mt-4 w-full h-12 bg-surface-container-highest rounded-lg font-label text-[10px] font-bold uppercase tracking-widest">
              Select
            </button>
          </div>

        </section>
      </main>

      {/* BOTTOM NAV (NOW CONTROLLED BY APP.TSX) */}
      <AppBottomNav
        activeTab="routes"
        onExplore={() => {}}
        onRecos={() => {}}
        onRoutes={() => {}}
        onProfile={() => {}}
      />

    </div>
  );
};

export default RouteComparisonScreen;