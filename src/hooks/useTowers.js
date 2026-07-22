import { useEffect, useState } from "react";
import { getTowers } from "../services/towerService";
import { useTowerFilter } from "../context/TowerFilterContext";

export default function useTowers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { selectedOperators } = useTowerFilter();

  useEffect(() => {
    async function load() {
      try {
        const towers = await getTowers();

        const filtered = towers.filter((tower) =>
          selectedOperators.includes(tower.operator)
        );

        setData(filtered);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedOperators]);

  return {
    data,
    loading,
    error,
  };
}