export function confidenceColor(value) {
  if (value >= 90) return "text-green-400";
  if (value >= 70) return "text-yellow-400";
  return "text-red-400";
}