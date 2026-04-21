type NavTab = "explore" | "routes" | "savings" | "profile";

interface AppBottomNavProps {
  activeTab: NavTab;
  onExplore?: () => void;
  onRoutes?: () => void;
  onSavings?: () => void;
  onProfile?: () => void;
}

const baseTabClass =
  "flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 ease-in-out active:scale-90";

const AppBottomNav = ({
  activeTab,
  onExplore,
  onRoutes,
  onSavings,
  onProfile,
}: AppBottomNavProps) => {
  const getTabClass = (tab: NavTab) => {
    if (tab === activeTab) {
      return `${baseTabClass} bg-gradient-to-br from-[#000d22] to-[#0a2342] text-white rounded-xl shadow-lg`;
    }

    return `${baseTabClass} text-[#c4c6cf] hover:text-[#000d22]`;
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,13,34,0.06)] border-t border-[#e6e8ea]/15 rounded-t-2xl">
      <button
        type="button"
        onClick={onExplore}
        className={getTabClass("explore")}
      >
        <span className="material-symbols-outlined">explore</span>
        <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">
          Explore
        </span>
      </button>

      <button
        type="button"
        onClick={onRoutes}
        className={getTabClass("routes")}
      >
        <span className="material-symbols-outlined">directions_car</span>
        <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">
          Routes
        </span>
      </button>

      <button
        type="button"
        onClick={onSavings}
        className={getTabClass("savings")}
      >
        <span className="material-symbols-outlined">payments</span>
        <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">
          Savings
        </span>
      </button>

      <button
        type="button"
        onClick={onProfile}
        className={getTabClass("profile")}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-[Inter] text-[10px] font-bold uppercase tracking-widest mt-1">
          Profile
        </span>
      </button>
    </nav>
  );
};

export default AppBottomNav;
