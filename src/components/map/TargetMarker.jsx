import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { suspect } from "../../data/location";

const targetIcon = new L.DivIcon({
  html: `
  <div style="
      width:18px;
      height:18px;
      background:#ef4444;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 20px rgba(239,68,68,.7);
  "></div>
  `,
  className: "",
});

export default function TargetMarker() {
  return (
    <Marker
      position={[suspect.lat, suspect.lng]}
      icon={targetIcon}
    >
      <Popup>
        <strong>Estimated Target</strong>
        <br />
        Confidence: {suspect.confidence}%
      </Popup>
    </Marker>
  );
}