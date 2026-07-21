export default function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl">
      <p className="mb-2 text-sm font-semibold text-white">
        {label}
      </p>

      <p className="text-blue-400">
        {payload[0].value} {unit}
      </p>
    </div>
  );
}