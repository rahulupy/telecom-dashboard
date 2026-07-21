export default function StatusCard({
  title,
  value,
  unit,
  icon: Icon,
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg hover:border-blue-500 hover:shadow-blue-500/10 transition-all duration-300 p-5">

      {/* Header */}
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon size={18} />}
        <span className="text-sm font-medium">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="mt-4">
        <h2 className="text-4xl font-bold text-white">
          {value}

          {unit && (
            <span className="ml-1 text-xl font-normal text-slate-400">
              {unit}
            </span>
          )}
        </h2>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-slate-700 pt-3">
        <p className="text-xs text-slate-500">
          Updated just now
        </p>
      </div>

    </div>
  );
}