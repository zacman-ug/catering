import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { normalizeSectionId, scrollToSectionWhenReady } from '../../utils/scrollToSection.js';

export default function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = normalizeSectionId(location.hash);

    if (!sectionId) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    scrollToSectionWhenReady(sectionId);
  }, [location.pathname, location.hash]);

  return null;
}
