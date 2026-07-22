import { useEffect, useState } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { buildLocalization } from "../services/localizationService";

export default function useLocalization() {
  const { history, current } = usePlayback();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!current || history.length === 0) {
      return;
    }

    try {
      const localization = buildLocalization(
        current,
        history
      );

      setData(localization);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  }, [current, history]);

  return {
    data,
    loading,
    error,
  };
}