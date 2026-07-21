const demoScenario = [
  {
    step: 1,
    confidence: 74,
    radius: 250,
    direction: "North-East",
    event: "Towers Connected",
    alert: "Tower T001 connected successfully.",
  },
  {
    step: 2,
    confidence: 82,
    radius: 180,
    direction: "North-East",
    event: "Localization Updated",
    alert: "Localization confidence increased.",
  },
  {
    step: 3,
    confidence: 91,
    radius: 120,
    direction: "East",
    event: "Search Radius Reduced",
    alert: "Estimated search area reduced.",
  },
  {
    step: 4,
    confidence: 95,
    radius: 80,
    direction: "East",
    event: "Target Search Area Narrowed",
    alert: "Ground team should search inside highlighted zone.",
  },
];

export default demoScenario;