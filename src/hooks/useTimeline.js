import { useMemo } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { buildTimeline } from "../services/timelineService";

export default function useTimeline() {
  const { history, currentIndex } = usePlayback();

  const data = useMemo(() => {
    if (history.length === 0) return [];

    return buildTimeline(
      history.slice(0, currentIndex + 1)
    );
  }, [history, currentIndex]);

  return {
    data,
    loading: history.length === 0,
    error: false,
  };
}