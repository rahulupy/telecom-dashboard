import { useEffect, useState } from "react";
import { getAlerts } from "../services/alertService";

export default function useAlerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setData(getAlerts());
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