import { useEffect, useState } from "react";
import { getDemoScenario } from "../services/demoService";

export default function useDemo() {
  const scenario = getDemoScenario();

  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % scenario.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [scenario.length]);

  return scenario[step];
}