import { useEffect } from "react";
import { useMap } from "react-leaflet";
import useLocalization from "../../hooks/useLocalization";
import { usePlayback } from "../../context/PlaybackContext";

export default function AutoFollowMap() {
  const map = useMap();
  const { data } = useLocalization();
  const { autoFollow } = usePlayback();

    if (!autoFollow) return;

  useEffect(() => {
    if (!data) return;

    map.flyTo(
      [
        data.heatmapCenter.lat,
        data.heatmapCenter.lng,
      ],
      map.getZoom(),
      {
        animate: true,
        duration: 1.2,
      }
    );
  }, [autoFollow, data, map]);

  return null;
}