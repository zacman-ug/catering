import SectionLink from '../routing/SectionLink.jsx';
import { normalizeFeatureList } from '../../utils/features.js';

function formatUgxRange(min, max) {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  if (lo <= 0 && hi <= 0) return 'Quote on request';
  if (hi <= lo) return `From UGX ${lo.toLocaleString()}`;
  return `UGX ${lo.toLocaleString()} – ${hi.toLocaleString()}`;
}

export default function MenuPackageCard({ pkg, compact = false }) {
  const dishes = normalizeFeatureList(pkg.sample_dishes);

  return (
    <article className={`surface-card surface-card-hover flex flex-col h-full ${compact ? 'p-5' : 'p-6 md:p-7'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent-600 bg-accent-50 px-2.5 py-1 rounded-full">
          {pkg.event_type}
        </p>
      </div>
      <h3 className="font-display text-xl md:text-2xl font-bold text-brand-900 leading-snug">{pkg.title}</h3>
      <p className="text-sm text-stone-600 mt-2 leading-relaxed flex-1">{pkg.description}</p>

      {dishes.length > 0 && (
        <div className="mt-5 pt-5 border-t border-stone-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-3">Sample dishes</p>
          <ul className="space-y-2">
            {dishes.map((dish) => (
              <li key={dish} className="text-sm text-stone-700 flex items-start gap-2">
                <span className="text-brand-500 mt-0.5">•</span>
                <span>{dish}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs text-stone-500 mb-0.5">Typical event range</p>
          <p className="font-display text-lg font-bold text-brand-800 tabular-nums">
            {formatUgxRange(pkg.price_min_ugx, pkg.price_max_ugx)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Final price confirmed after guest count & menu plan</p>
        </div>
        <SectionLink to="/book#booking-form" className="btn-outline !text-sm !px-4 !py-2 shrink-0">
          Book this style
        </SectionLink>
      </div>
    </article>
  );
}
