export default function StatusCard({
  title,
  value,
  unit,
  subtitle,
  color = "border-blue-500",
  icon: Icon,
}) {
  const isConfidence = title === "Confidence";

  return (
    <div
      className={`group rounded-2xl border border-slate-700 bg-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/20 overflow-hidden`}
    >
      {/* Accent Line */}
      <div className={`h-1 ${color}`} />

      <div className="p-5">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              {value}

              {unit && (
                <span className="ml-1 text-xl font-normal text-slate-400">
                  {unit}
                </span>
              )}
            </h2>
          </div>

          {Icon && (
            <div className="rounded-xl bg-slate-800 p-3 transition group-hover:bg-slate-700">
              <Icon
                size={24}
                className="text-blue-400"
              />
            </div>
          )}

        </div>

        {/* Confidence Progress */}
        {isConfidence && (
          <div className="mt-5">

            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500">
                Accuracy
              </span>

              <span className="text-blue-400">
                {value}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">

              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${value}%` }}
              />

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="mt-5 border-t border-slate-700 pt-3">

          <p className="text-xs text-slate-500">
            {subtitle ?? "Updated just now"}
          </p>

        </div>

      </div>
    </div>
  );
}