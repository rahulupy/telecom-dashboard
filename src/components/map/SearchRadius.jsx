import { Circle } from "react-leaflet";
import { suspect } from "../../data/location";

export default function SearchRadius() {
  return (
    <Circle
      center={[suspect.latitude, suspect.longitude]}
      radius={100}
      pathOptions={{
        color: "#2563eb",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
      }}
    />
  );
}