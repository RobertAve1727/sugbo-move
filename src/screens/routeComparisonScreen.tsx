import React from "react";
import AppHeader from "../components/layout/AppHeader";
import AppBottomNav from "../components/layout/AppBottomNav";

// 1. LEAFLET IMPORTS & TYPES
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 2. FIX FOR DEFAULT MARKER ICON (Leaflet + React issue)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RouteComparisonScreen: React.FC = () => {
  // Coordinates for Cebu City defined with explicit Leaflet type
  const cebuPosition: LatLngExpression = [10.3157, 123.8854];

  return (
    <div className="bg-[#f8f9fb] text-[#1a1c1e] min-h-screen font-sans selection:bg-primary selection:text-on-primary">
      
      <AppHeader />

      <main className="pt-24 pb-40 px-6 max-w-xl mx-auto">

        {/* HERO / MAP SECTION */}
        <section className="relative h-48 rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100">
          <MapContainer 
            center={cebuPosition} 
            zoom={13} 
            zoomControl={false}
            scrollWheelZoom={true} // Now set to true for desktop interaction
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={cebuPosition} />
          </MapContainer>

          {/* TEXT OVERLAYS - Added pointer-events-none to both */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none">
            <span className="w-fit font-bold text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1 rounded-md mb-2">
              Real-time Analysis
            </span>
            <h2 className="text-white text-3xl font-bold leading-tight">
              Cebu Route <br /> Comparison
            </h2>
          </div>
        </section>

        {/* RECOMMENDATION STRATEGY */}
        <section className="grid gap-4 mb-6">
          <div className="bg-[#04162e] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400">✦</span>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                Recommended Strategy
              </p>
            </div>

            <h3 className="text-3xl font-bold mb-3 leading-snug">
              Route B is your <br /> best bet today.
            </h3>

            <p className="text-sm opacity-70 mb-6 max-w-[240px]">
              Optimized for cost efficiency and low traffic density through Mandaue.
            </p>

            <div className="flex items-center gap-2">
              <span className="text-5xl font-bold text-[#4ade80]">₱0</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Fuel Cost (EV)
              </span>
            </div>
          </div>

          {/* TOTAL EFFICIENCY RING */}
          <div className="bg-[#032b14] p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
            <p className="text-[#4ade80] text-[10px] font-bold uppercase tracking-widest mb-6">
              Total Efficiency
            </p>

            <div className="relative flex items-center justify-center mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  stroke="currentColor" strokeWidth="8"
                  fill="transparent" className="text-white/10"
                />
                <circle
                  cx="64" cy="64" r="58"
                  stroke="currentColor" strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 * 0.05}
                  className="text-[#4ade80]"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-[#4ade80]">95%</span>
            </div>

            <p className="text-[#4ade80] text-sm font-medium">
              Eco-Performance Optimized
            </p>
          </div>
        </section>

        {/* ROUTES LIST */}
        <section className="space-y-4">
          
          {/* Route A */}
          <div className="bg-white p-6 rounded-3xl border-l-[6px] border-yellow-400 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-2xl font-bold text-gray-900">Route A</h4>
              <div className="flex gap-2">
                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Moderate Traffic</span>
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">-12% CO2</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
              <div>Distance <p className="text-lg text-black lowercase mt-1">12.4 km</p></div>
              <div>Est. Time <p className="text-lg text-black lowercase mt-1">22 min</p></div>
              <div>Fuel Cost <p className="text-lg text-black lowercase mt-1">₱0</p></div>
            </div>
            <button className="w-1/2 py-3 bg-gray-100 rounded-xl font-bold uppercase text-[11px] tracking-widest">Select</button>
          </div>

          {/* Route B - Active/Best */}
          <div className="bg-white p-6 rounded-3xl border-l-[6px] border-green-400 shadow-md ring-1 ring-black/5">
             <div className="flex justify-between items-start mb-4">
              <h4 className="text-2xl font-bold text-gray-900">Route B</h4>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-green-400 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase mb-1">Cheapest</span>
                <div className="flex gap-2">
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Low Traffic</span>
                   <span className="bg-black text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">-28% CO2</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
              <div>Distance <p className="text-lg text-black lowercase mt-1">14.8 km</p></div>
              <div>Est. Time <p className="text-2xl text-green-500 font-bold lowercase">28 min</p></div>
              <div>Fuel Cost <p className="text-lg text-black lowercase mt-1">₱0</p></div>
            </div>
            <button className="w-full py-4 bg-[#04162e] text-white rounded-xl font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2">
              Start Route <span className="text-[10px]">▲</span>
            </button>
          </div>

          {/* Route C */}
          <div className="bg-white p-6 rounded-3xl border-l-[6px] border-red-500 shadow-sm opacity-80">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-2xl font-bold text-gray-900">Route C</h4>
              <div className="flex gap-2">
                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Heavy Traffic</span>
                <span className="bg-red-50 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">+5% CO2</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
              <div>Distance <p className="text-lg text-black lowercase mt-1">11.2 km</p></div>
              <div>Est. Time <p className="text-lg text-black lowercase mt-1">45 min</p></div>
              <div>Fuel Cost <p className="text-lg text-black lowercase mt-1">₱0</p></div>
            </div>
            <button className="w-1/2 py-3 bg-gray-100 rounded-xl font-bold uppercase text-[11px] tracking-widest">Select</button>
          </div>
        </section>
      </main>

      {/* Floating Filter Button */}
      <button className="fixed bottom-28 right-6 w-14 h-14 bg-[#04162e] text-white rounded-2xl shadow-2xl flex items-center justify-center z-50">
         <span className="text-xl">≡</span>
      </button>

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