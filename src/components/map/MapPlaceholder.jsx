export default function MapPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow border h-[500px] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Live Map
        </h2>

        <p className="text-gray-500 mt-2">
          Leaflet map will be integrated here.
        </p>
      </div>
    </div>
  );
}