import { normalizeFeatureList } from '../../utils/features.js';

export default function ServiceCard({ title, description, features = [] }) {
  const featureList = normalizeFeatureList(features);
  return (
    <article className="surface-card surface-card-hover group relative p-6 md:p-7 overflow-hidden h-full flex flex-col">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-accent-500 opacity-80 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      <h3 className="font-display text-xl font-bold text-brand-900 mb-2 leading-snug">{title}</h3>
      <p className="text-stone-600 text-sm mb-5 leading-relaxed flex-1">{description}</p>
      {featureList.length > 0 && (
        <ul className="space-y-2 pt-4 border-t border-stone-100">
          {featureList.map((f) => (
            <li key={f} className="text-sm text-stone-600 flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
