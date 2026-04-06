export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#1a1a1a", border: "1px solid #2e2e2e" }}
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="shimmer h-6 w-3/4 rounded" />
              <div className="shimmer h-5 w-16 rounded" />
            </div>
            <div className="shimmer h-4 w-1/2 rounded mb-3" />
            <div className="space-y-2">
              <div className="shimmer h-3 w-full rounded" />
              <div className="shimmer h-3 w-5/6 rounded" />
              <div className="shimmer h-3 w-4/6 rounded" />
            </div>
          </div>
          <div
            className="grid grid-cols-2 gap-px"
            style={{ backgroundColor: "#2e2e2e" }}
          >
            {[1, 2, 3, 4].map((j) => (
              <div
                key={j}
                className="p-3"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <div className="shimmer h-3 w-12 rounded mb-1" />
                <div className="shimmer h-4 w-20 rounded" />
              </div>
            ))}
          </div>
          <div className="p-4" style={{ backgroundColor: "#161616" }}>
            <div className="shimmer h-4 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
