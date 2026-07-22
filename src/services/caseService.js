import { getLocalization } from "./localizationService";

export async function getCaseSummary() {
  const localization = await getLocalization();

  return {
    caseId: localization.caseId,
    subscriber: localization.subscriber,
    status: localization.engineStatus,
    method: localization.method,
    confidence: localization.confidence,
    radius: localization.radius,
    towers: localization.nearbyTowers,
    direction: localization.direction,
    updated: localization.lastUpdate,
    };
}