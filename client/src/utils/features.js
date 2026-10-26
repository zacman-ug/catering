export function normalizeFeatureList(features) {
  if (Array.isArray(features)) {
    return features.filter((item) => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0)
        : [];
    } catch {
      return [];
    }
  }
  return [];
}
