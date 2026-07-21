import { Polyline } from "react-leaflet";
import { officer, suspect } from "../../data/location";

export default function RouteLine() {
  return (
    <Polyline
      positions={[
        [officer.lat, officer.lng],
        [suspect.lat, suspect.lng],
      ]}
      pathOptions={{
        color: "#38bdf8",
        weight: 4,
        opacity: .8,
      }}
    />
  );
}