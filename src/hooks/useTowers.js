import { useEffect, useState } from "react";
import { getTowers } from "../services/towerService";

export default function useTowers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setData(getTowers());
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