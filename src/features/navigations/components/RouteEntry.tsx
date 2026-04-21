export const RouteEntry = () => {
  return (
    <div className="bg-white dark:bg-code-bg rounded-xl p-6 shadow-lg border border-border mb-8">
      <div className="space-y-4 relative">
        {/* Decorative Connector Line */}
        <div className="absolute left-[19px] top-10 bottom-10 w-[2px] bg-border" />

        <LocationInput
          label="Origin"
          icon="my_location"
          placeholder="Current Location"
        />
        <LocationInput
          label="Destination"
          icon="location_on"
          placeholder="Where to?"
          isPrimary
        />
      </div>

      <button className="mt-8 w-full h-14 bg-accent text-white rounded-lg font-headline font-bold uppercase tracking-widest text-sm shadow-lg shadow-accent/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
        Find Best Route
        <span className="material-symbols-outlined">trending_flat</span>
      </button>
    </div>
  );
};

const LocationInput = ({
  label,
  icon,
  placeholder,
  isPrimary = false,
}: any) => (
  <div className="flex items-center gap-4 relative z-10">
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isPrimary ? "bg-text-h text-bg" : "bg-border/30 text-text-h"
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </div>
    <div className="flex-1 text-left">
      <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-text opacity-60 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b-2 border-border focus:border-accent focus:ring-0 font-body font-bold text-text-h p-0 pb-1 placeholder:font-medium placeholder:opacity-30"
      />
    </div>
  </div>
);
