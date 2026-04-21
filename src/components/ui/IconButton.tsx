interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
}

export const IconButton = ({
  icon,
  className = "",
  ...props
}: IconButtonProps) => (
  <button
    className={`flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95 ${className}`}
    {...props}
  >
    <span className="material-symbols-outlined">{icon}</span>
  </button>
);
