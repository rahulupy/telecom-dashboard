export default function StatusCard({
  title,
  value,
  unit = "",
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
        <span className="text-lg font-normal ml-1">
          {unit}
        </span>
      </h2>
    </div>
  );
}