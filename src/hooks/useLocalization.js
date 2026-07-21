import { useEffect, useState } from "react";
import { getLocalization } from "../services/localizationService";

export default function useLocalization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setData(getLocalization());
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }

    const interval = setInterval(() => {
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          confidence: Math.min(
            100,
            Math.max(
              70,
              prev.confidence + Math.floor(Math.random() * 5 - 2)
            )
          ),
          lastUpdate: new Date().toLocaleTimeString(),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}