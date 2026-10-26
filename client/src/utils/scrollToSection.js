export const DEFAULT_HEADER_OFFSET_PX = 88;

export function normalizeSectionId(sectionId) {
  if (typeof sectionId !== 'string') return '';
  return sectionId.replace(/^#/, '').trim();
}

export function splitPathAndHash(to) {
  if (typeof to !== 'string' || !to.trim()) {
    return { pathname: '/', hash: '' };
  }

  const [pathnamePart, hashPart = ''] = to.split('#');
  const pathname = pathnamePart || '/';
  const hash = normalizeSectionId(hashPart);

  return { pathname, hash };
}

export function computeScrollTop(element, headerOffsetPx = DEFAULT_HEADER_OFFSET_PX, scrollY = 0) {
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return null;
  }

  if (typeof headerOffsetPx !== 'number' || Number.isNaN(headerOffsetPx) || headerOffsetPx < 0) {
    return null;
  }

  if (typeof scrollY !== 'number' || Number.isNaN(scrollY) || scrollY < 0) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const scrollTop = scrollY + rect.top - headerOffsetPx;
  return Math.max(0, Math.round(scrollTop));
}

export function readHeaderOffsetPx(fallback = DEFAULT_HEADER_OFFSET_PX) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback;
  }

  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim();
  if (!raw) return fallback;

  if (raw.endsWith('rem')) {
    const rem = Number.parseFloat(raw);
    if (Number.isNaN(rem)) return fallback;
    const rootFont = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Math.round(rem * rootFont);
  }

  if (raw.endsWith('px')) {
    const px = Number.parseInt(raw, 10);
    return Number.isNaN(px) ? fallback : px;
  }

  const numeric = Number.parseInt(raw, 10);
  return Number.isNaN(numeric) ? fallback : numeric;
}

export function scrollToSection(sectionId, options = {}) {
  const id = normalizeSectionId(sectionId);
  if (!id) return false;

  const element = document.getElementById(id);
  if (!element) return false;

  const headerOffset = options.headerOffsetPx ?? readHeaderOffsetPx();
  const top = computeScrollTop(element, headerOffset, window.scrollY);
  if (top === null) return false;

  window.scrollTo({
    top,
    behavior: options.behavior ?? 'smooth',
  });

  return true;
}

export function scrollToSectionWhenReady(sectionId, options = {}) {
  const maxAttempts = typeof options.maxAttempts === 'number' ? options.maxAttempts : 12;
  const intervalMs = typeof options.intervalMs === 'number' ? options.intervalMs : 50;

  return new Promise((resolve) => {
    let attempts = 0;

    const tryScroll = () => {
      attempts += 1;
      const didScroll = scrollToSection(sectionId, options);
      if (didScroll) {
        resolve(true);
        return;
      }
      if (attempts >= maxAttempts) {
        resolve(false);
        return;
      }
      window.setTimeout(tryScroll, intervalMs);
    };

    tryScroll();
  });
}
