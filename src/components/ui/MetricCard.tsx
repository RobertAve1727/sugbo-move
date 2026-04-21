interface MetricCardProps {
  icon: string;
  value: string;
  unit: string;
  label: string;
  iconColorClass?: string;
}

export const MetricCard = ({
  icon,
  value,
  unit,
  label,
  iconColorClass = "text-accent",
}: MetricCardProps) => (
  <div className="bg-white dark:bg-code-bg p-5 rounded-xl shadow-sm border border-border">
    <span className={`material-symbols-outlined mb-3 ${iconColorClass}`}>
      {icon}
    </span>
    <div className="font-headline text-2xl font-extrabold text-text-h">
      {value}{" "}
      <span className="text-xs font-label font-medium opacity-60">{unit}</span>
    </div>
    <div className="font-label text-[10px] font-bold uppercase tracking-tighter text-text opacity-70 mt-1">
      {label}
    </div>
  </div>
);
