import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SectionLink from '../routing/SectionLink.jsx';
import { NAV_LINKS } from '../../utils/constants.js';
import { useBusiness } from '../../context/BusinessContext.jsx';

export default function Header() {
  const { business } = useBusiness();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) => (
    `text-[13px] font-semibold px-3 py-2 rounded-full transition-all duration-200 ${
      isActive ? 'nav-pill-active text-brand-800' : 'text-stone-600 hover:text-brand-700 hover:bg-brand-50/80'
    }`
  );

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/88 backdrop-blur-xl shadow-[0_8px_30px_rgba(53,27,14,0.06)]">
      <div className="max-w-6xl mx-auto px-4 h-[4.5rem] flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 min-w-0 group"
          onClick={() => setMobileOpen(false)}
        >
          <span className="logo-mark group-hover:scale-[1.03] transition-transform" aria-hidden>
            CG
          </span>
          <span className="min-w-0 flex flex-col leading-tight">
            <span className="font-display text-lg md:text-xl font-bold text-brand-800 tracking-wide truncate">
              {business.shortName || business.name}
            </span>
            <span className="text-[10px] md:text-[11px] text-stone-500 tracking-[0.18em] uppercase truncate">
              Foods & Kitchen Uganda
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
          <SectionLink to="/book#booking-form" className="btn-primary !text-sm !px-5 !py-2.5 ml-2 shrink-0">
            Book Now
          </SectionLink>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center rounded-full border border-stone-300/90 bg-white px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-200/80 bg-white/98 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-700'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-stone-100">
              <SectionLink
                to="/book#booking-form"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center !text-sm"
              >
                Book Now
              </SectionLink>
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center !text-sm"
              >
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
