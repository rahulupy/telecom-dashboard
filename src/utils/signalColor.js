export function signalColor(dbm) {
  if (dbm > -70) return "text-green-400";
  if (dbm > -90) return "text-yellow-400";
  return "text-red-400";
}