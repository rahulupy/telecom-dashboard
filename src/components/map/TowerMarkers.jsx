import { Marker, Popup } from "react-leaflet";
import { towers } from "../../data/location";

export default function TowerMarkers() {
  return (
    <>
      {towers.map((tower) => (
        <Marker
          key={tower.id}
          position={[tower.latitude, tower.longitude]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{tower.id}</h3>
              <p>Sector: {tower.sector}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}