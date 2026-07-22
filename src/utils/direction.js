export function getDirection(previous, current) {
  if (!previous || !current) {
    return "Unknown";
  }

  const latDiff =
    Number(current.latitude) - Number(previous.latitude);

  const lngDiff =
    Number(current.longitude) - Number(previous.longitude);

  if (Math.abs(latDiff) < 0.00001 &&
      Math.abs(lngDiff) < 0.00001) {
    return "Stationary";
  }

  if (latDiff > 0 && lngDiff > 0) return "North-East";
  if (latDiff > 0 && lngDiff < 0) return "North-West";
  if (latDiff < 0 && lngDiff > 0) return "South-East";
  if (latDiff < 0 && lngDiff < 0) return "South-West";

  if (latDiff > 0) return "North";
  if (latDiff < 0) return "South";
  if (lngDiff > 0) return "East";
  if (lngDiff < 0) return "West";

  return "Unknown";
}