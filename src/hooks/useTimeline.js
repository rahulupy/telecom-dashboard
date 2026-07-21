import { useEffect, useState } from "react";
import { getTimeline } from "../services/timelineService";

export default function useTimeline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setData(getTimeline());
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
  };
}