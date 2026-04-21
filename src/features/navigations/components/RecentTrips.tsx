export const RecentTrips = () => {
  const trips = [
    {
      id: 1,
      name: "IT Park Tower 1",
      route: "Via Salinas Drive",
      tag: "Efficient",
    },
    { id: 2, name: "Mactan Heights", route: "Via CCLEX", tag: "Fast" },
  ];

  return (
    <div className="text-left">
      <h3 className="font-label text-[11px] font-bold uppercase tracking-widest text-text opacity-60 mb-4 flex items-center gap-2">
        Recent Trips
        <div className="h-[1px] flex-1 bg-border"></div>
      </h3>
      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white dark:bg-code-bg p-4 rounded-lg flex items-center justify-between border border-border hover:border-accent transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-text group-hover:text-accent transition-colors">
                history
              </span>
              <div>
                <div className="font-body font-bold text-text-h text-sm">
                  {trip.name}
                </div>
                <div className="font-label text-[10px] text-text uppercase opacity-70">
                  {trip.route}
                </div>
              </div>
            </div>
            <div className="bg-accent/10 px-2 py-1 rounded text-[10px] font-label font-bold text-accent tracking-wider uppercase">
              {trip.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
