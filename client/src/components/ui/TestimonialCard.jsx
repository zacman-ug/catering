export default function TestimonialCard({ clientName, eventType, content, rating = 5 }) {
  return (
    <blockquote className="surface-card surface-card-hover p-6 md:p-7 relative overflow-hidden h-full flex flex-col">
      <div className="absolute -right-2 -top-4 font-display text-7xl text-brand-100 leading-none select-none" aria-hidden>
        &ldquo;
      </div>
      <div className="flex gap-0.5 mb-4 text-brand-400 text-sm" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="text-stone-600 text-sm md:text-[0.925rem] leading-relaxed mb-6 relative flex-1">
        {content}
      </p>
      <footer className="text-sm pt-4 border-t border-stone-100">
        <strong className="text-brand-900 font-semibold">{clientName}</strong>
        {eventType && (
          <span className="block text-xs text-stone-500 mt-0.5 uppercase tracking-wide">{eventType}</span>
        )}
      </footer>
    </blockquote>
  );
}
