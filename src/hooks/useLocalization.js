import { useEffect, useState } from "react";
import { getLocalization } from "../services/localizationService";

export default function useLocalization() {
  const [data, setData] = useState(getLocalization());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        confidence: Math.min(
          100,
          Math.max(
            70,
            prev.confidence + Math.floor(Math.random() * 5 - 2)
          )
        ),

        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return data;
}