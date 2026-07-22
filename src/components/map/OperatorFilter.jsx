import { useTowerFilter } from "../../context/TowerFilterContext";

const operators = ["Airtel", "Jio", "Vi", "BSNL"];

export default function OperatorFilter() {
  const {
    selectedOperators,
    toggleOperator,
  } = useTowerFilter();

  return (
     <div className="absolute top-48 left-4 z-[1000] w-44 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl">

      <h3 className="mb-3 text-sm font-semibold text-white">
        Operators
      </h3>

      <div className="space-y-2">

        {operators.map((operator) => (
          <label
            key={operator}
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <input
              type="checkbox"
              checked={selectedOperators.includes(operator)}
              onChange={() => toggleOperator(operator)}
            />

            {operator}
          </label>
        ))}

      </div>

    </div>
  );
}