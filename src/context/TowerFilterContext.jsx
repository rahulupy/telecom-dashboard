import { createContext, useContext, useState } from "react";

const TowerFilterContext = createContext();

export function TowerFilterProvider({ children }) {
  const [selectedOperators, setSelectedOperators] = useState([
    "Airtel",
    "Jio",
    "Vi",
    "BSNL",
  ]);

  function toggleOperator(operator) {
    setSelectedOperators((prev) =>
      prev.includes(operator)
        ? prev.filter((op) => op !== operator)
        : [...prev, operator]
    );
  }

  return (
    <TowerFilterContext.Provider
      value={{
        selectedOperators,
        toggleOperator,
      }}
    >
      {children}
    </TowerFilterContext.Provider>
  );
}

export function useTowerFilter() {
  return useContext(TowerFilterContext);
}