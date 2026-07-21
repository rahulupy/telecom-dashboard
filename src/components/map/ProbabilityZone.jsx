import { Circle } from "react-leaflet";
import useLocalization from "../../hooks/useLocalization";

export default function ProbabilityZone() {
  const { data, loading } = useLocalization();

  if (loading || !data) return null;

  return (
    <>
      {data.heatmap.map((zone, index) => (
        <Circle
          key={index}
          center={[zone.lat, zone.lng]}
          radius={zone.radius}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: zone.opacity,
            weight: 0,
          }}
        />
      ))}

      <Circle
        center={[
          data.heatmap[0].lat,
          data.heatmap[0].lng,
        ]}
        radius={180}
        pathOptions={{
          color: "#38bdf8",
          dashArray: "8 6",
          fillOpacity: 0,
          weight: 2,
        }}
      />
    </>
  );
}