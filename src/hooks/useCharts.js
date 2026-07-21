import { useState, useEffect } from "react";
import {
  getConfidenceData,
  getSignalData,
  getRadiusData,
} from "../services/chartService";

export default function useCharts() {
  const [confidence, setConfidence] = useState([]);
  const [signal, setSignal] = useState([]);
  const [radius, setRadius] = useState([]);

  useEffect(() => {
    setConfidence(getConfidenceData());
    setSignal(getSignalData());
    setRadius(getRadiusData());
  }, []);

  return {
    confidence,
    signal,
    radius,
  };
}