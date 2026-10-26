import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants.js';
import { useBusiness } from '../../context/BusinessContext.jsx';

export default function Footer() {
  const { business } = useBusiness();

  return (
    <footer className="relative overflow-hidden bg-brand-900 text-brand-100 mt-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,200,143,0.16),transparent_32%),radial-gradient(circle_at_85%_90%,rgba(31,122,99,0.2),transparent_38%)]" />
      <div className="relative border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="eyebrow !text-brand-200 mb-2">Ready for your event?</p>
            <p className="font-display text-2xl font-bold text-white">Let&apos;s plan your menu together.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/book#booking-form" className="btn-primary !text-sm">
              Book catering
            </Link>
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="logo-mark !h-10 !w-10 !text-base" aria-hidden>CG</span>
            <h3 className="font-display text-xl font-bold text-white">{business.shortName || business.name}</h3>
          </div>
          <p className="text-brand-100/90 text-sm leading-relaxed max-w-xs">{business.tagline}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-brand-200/95 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <address className="not-italic text-sm text-brand-100/95 space-y-2.5 leading-relaxed">
            <p>{business.address}</p>
            {(business.phones || []).map((phone) => (
              <p key={phone}>
                <a href={`tel:${phone}`} className="hover:text-white font-medium transition-colors">
                  {phone}
                </a>
              </p>
            ))}
            <p className="pt-1 flex flex-wrap gap-3">
              {business.facebook && (
                <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white underline-offset-2 hover:underline">
                  Facebook
                </a>
              )}
              {business.instagram && (
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white underline-offset-2 hover:underline">
                  Instagram
                </a>
              )}
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-brand-800/80 py-5 text-center text-xs text-brand-300/90">
        © {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}
