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
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-5
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-2xl
        hover:shadow-blue-500/20
      "
    >
      {/* Accent Line */}
      <div className={`h-1 ${color}`} />

      <div className="p-5">

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />

        {/* Header */}
        <div className="flex items-center justify-between">

        <div className="mt-5">

  <h2 className="text-4xl font-extrabold tracking-tight text-white">

    {value}

    {unit && (
      <span className="ml-2 text-lg font-medium text-slate-400">
        {unit}
      </span>
    )}

  </h2>

  <p className="mt-2 text-sm text-slate-400">
  {subtitle}
</p>

</div> 

          {Icon && (
  <div
    className="
      flex
      h-14
      w-14
      items-center
      justify-center
      rounded-2xl
      bg-gradient-to-br
      from-blue-600
      to-cyan-500
      shadow-lg
      transition-transform
      duration-300
      group-hover:scale-110
    "
  >
    <Icon
      size={28}
      className="text-white"
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