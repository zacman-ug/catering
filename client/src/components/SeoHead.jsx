import { useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function SeoHead({ title, description, path = '/' }) {
  const { business } = useBusiness();

  useEffect(() => {
    const pageTitle = title ? `${title} | ${business.name}` : business.name;
    document.title = pageTitle;

    const desc = description || business.tagline || '';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;

    const origin = window.location.origin;
    const url = `${origin}${path}`;

    const setMeta = (property, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setMeta('og:title', pageTitle);
    setMeta('og:description', desc);
    setMeta('og:url', url);
    setMeta('og:type', 'website');

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'FoodEstablishment',
      name: business.name,
      address: business.address,
      telephone: business.phones?.[0],
      url: origin,
      openingHours: business.hours ? Object.entries(business.hours).map(([day, hours]) => `${day} ${hours}`) : undefined,
    };

    let script = document.getElementById('seo-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, [title, description, path, business]);

  return null;
}
