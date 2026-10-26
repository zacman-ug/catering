import { EVENT_TYPES } from './constants.js';

/** Group menu packages by event_type in the same order as the booking form. */
export function groupMenuPackagesByEvent(packages = []) {
  const byType = packages.reduce((acc, pkg) => {
    const key = pkg.event_type || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(pkg);
    return acc;
  }, {});

  const ordered = [];
  for (const type of EVENT_TYPES) {
    if (byType[type]?.length) {
      ordered.push({ eventType: type, packages: byType[type] });
      delete byType[type];
    }
  }
  for (const [eventType, pkgs] of Object.entries(byType)) {
    ordered.push({ eventType, packages: pkgs });
  }
  return ordered;
}
