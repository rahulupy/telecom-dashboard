import { useMemo } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { buildChartData } from "../services/movementService";

export default function useCharts() {
  const { history, currentIndex } = usePlayback();

  const data = useMemo(() => {
    if (history.length === 0) return [];

    return buildChartData(
      history.slice(0, currentIndex + 1)
    );
  }, [history, currentIndex]);

  return {
    data,
    loading: history.length === 0,
    error: false,
  };
}