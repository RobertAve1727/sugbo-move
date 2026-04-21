interface AppHeaderProps {
  onMenuClick?: () => void;
}

const AppHeader = ({ onMenuClick }: AppHeaderProps) => {
  return (
    <header className="bg-[#f7f9fb] sticky top-0 w-full z-50 flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="text-[#000d22] hover:opacity-80 transition-opacity"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg font-extrabold tracking-tighter text-[#000d22] font-[Plus_Jakarta_Sans] uppercase !my-0">
          Dalan
        </h1>
      </div>

      <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10">
        <img
          alt="User profile"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvmtNpLMgtih5wtg0kIF7FTmfe_I84XiL_b3cvXGL5PB5gRzMgXf4tLn5AV5kYuyU_94IdJiqs5z9F0kWSNYxrU4Vi6XzaPH85VyprujVJdcl-x_AtLCrItyMm7knzmz9vzlDEqp8g0koLyNpg1wWQpUid0lmkKhumCHvCDmYhRMJBtkF9z26jx-OL87Es0z1BWWGzLPoF-nvo-m_NuiTBCAhKKv7OhXMvzvH3QKgIO3R4zE7GZCemihzng92LsCDv_RsrhsLfFuFQ"
        />
      </div>
    </header>
  );
};

export default AppHeader;
