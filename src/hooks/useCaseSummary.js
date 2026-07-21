import { useEffect, useState } from "react";
import { getLocalization } from "../services/localizationService";

export default function useCaseSummary() {
  const [data, setData] =useState(null);
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
  }, []);

  return {
    data,
    loading,
    error,
  };
}