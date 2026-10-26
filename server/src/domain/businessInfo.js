import { normalizeStringArray, trimString } from '../utils/guards.js';

export function normalizeBusinessInfo(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const phones = normalizeStringArray(raw.phones);
  const serviceAreas = normalizeStringArray(raw.serviceAreas);
  const faqs = Array.isArray(raw.faqs)
    ? raw.faqs
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          question: trimString(item.question),
          answer: trimString(item.answer),
        }))
        .filter((item) => item.question && item.answer)
    : [];

  const coordinates = raw.coordinates && typeof raw.coordinates === 'object'
    ? {
        lat: typeof raw.coordinates.lat === 'number' ? raw.coordinates.lat : null,
        lng: typeof raw.coordinates.lng === 'number' ? raw.coordinates.lng : null,
      }
    : { lat: null, lng: null };

  const hours = raw.hours && typeof raw.hours === 'object' ? raw.hours : {};

  const chefCredentials = normalizeStringArray(raw.chefCredentials);

  return {
    name: trimString(raw.name),
    shortName: trimString(raw.shortName) || trimString(raw.name),
    owner: trimString(raw.owner),
    tagline: trimString(raw.tagline),
    address: trimString(raw.address),
    phones,
    whatsapp: trimString(raw.whatsapp),
    email: trimString(raw.email),
    facebook: trimString(raw.facebook),
    instagram: trimString(raw.instagram),
    googleReviewsUrl: trimString(raw.googleReviewsUrl),
    videoUrl: trimString(raw.videoUrl),
    analyticsId: trimString(raw.analyticsId),
    chefCredentials,
    coordinates,
    hours,
    serviceAreas,
    faqs,
    minGuestCount: typeof raw.minGuestCount === 'number' && raw.minGuestCount >= 1
      ? raw.minGuestCount
      : 20,
    leadTimeDays: typeof raw.leadTimeDays === 'number' && raw.leadTimeDays >= 0
      ? raw.leadTimeDays
      : 7,
  };
}

export function buildMapsEmbedUrl(coordinates, address) {
  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    if (!address) return null;
    const query = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${query}&output=embed`;
  }
  const { lat, lng } = coordinates;
  return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
}
