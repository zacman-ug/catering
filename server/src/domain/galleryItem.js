import { isNonEmptyString, trimString } from '../utils/guards.js';

export function parseGalleryItem(raw, index = 0) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: `Gallery item #${index + 1} is not an object` };
  }

  const title = trimString(raw.title);
  if (!isNonEmptyString(title)) {
    return { ok: false, error: `Gallery item #${index + 1} is missing a valid title` };
  }

  const imageUrl = trimString(raw.image_url);
  if (!isNonEmptyString(imageUrl)) {
    return { ok: false, error: `Gallery item #${index + 1} is missing a valid image_url` };
  }

  const caption = raw.caption === undefined || raw.caption === null
    ? null
    : trimString(raw.caption);

  if (raw.caption !== undefined && raw.caption !== null && typeof raw.caption !== 'string') {
    return { ok: false, error: `Gallery item #${index + 1} has invalid caption` };
  }

  const category = raw.category === undefined || raw.category === null
    ? 'business-profile'
    : trimString(raw.category);

  if (raw.category !== undefined && raw.category !== null && typeof raw.category !== 'string') {
    return { ok: false, error: `Gallery item #${index + 1} has invalid category` };
  }

  return {
    ok: true,
    value: {
      title,
      imageUrl,
      caption: caption || null,
      category: category || 'business-profile',
    },
  };
}

export function parseGalleryManifest(raw) {
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Gallery manifest must be an array' };
  }

  const items = [];
  for (let i = 0; i < raw.length; i += 1) {
    const parsed = parseGalleryItem(raw[i], i);
    if (!parsed.ok) return parsed;
    items.push(parsed.value);
  }

  return { ok: true, value: items };
}
