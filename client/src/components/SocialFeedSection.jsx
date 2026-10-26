import { useBusiness } from '../context/BusinessContext.jsx';
import { trackEvent } from '../utils/analytics.js';

export default function SocialFeedSection() {
  const { business } = useBusiness();
  const links = [
    { label: 'Facebook', href: business.facebook, event: 'facebook_click', hint: 'Event highlights & recipes' },
    { label: 'Instagram', href: business.instagram, event: 'instagram_click', hint: 'Behind the kitchen' },
  ].filter((item) => item.href);

  if (links.length === 0) return null;

  return (
    <section className="section-band-stone py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow mb-2">Social</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-900">Follow Chef Godwin</h2>
            <p className="text-stone-600 mt-2 max-w-lg text-sm md:text-base">
              Recipes, event highlights, and cooking lessons — the same energy you see at large Kampala celebrations.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(link.event)}
              className="surface-card surface-card-hover flex flex-col p-5 md:p-6 group"
            >
              <span className="font-display text-lg font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
                {link.label}
              </span>
              <span className="text-sm text-stone-500 mt-1">{link.hint}</span>
              <span className="text-sm font-semibold text-brand-600 mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Open profile →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
