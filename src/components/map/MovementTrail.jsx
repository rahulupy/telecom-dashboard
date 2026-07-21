import { Polyline } from "react-leaflet";
import history from "../../data/history";

export default function MovementTrail() {
  return (
    <Polyline
      positions={history}
      pathOptions={{
        color: "#ef4444",
        weight: 4,
      }}
    />
  );
}