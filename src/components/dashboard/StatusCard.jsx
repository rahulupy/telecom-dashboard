export default function StatusCard({
  title,
  value,
  unit,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-5">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className="mt-3 text-3xl font-bold">
        {value}

        {unit && (
          <span className="text-lg font-normal ml-1">
            {unit}
          </span>
        )}
      </h2>
    </div>
  );
}