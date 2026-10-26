export default function CourseCard({
  title,
  description,
  duration,
  level,
  priceUgx,
  seatsRemaining,
  startDate,
  onEnroll,
}) {
  return (
    <article className="surface-card surface-card-hover overflow-hidden h-full flex flex-col">
      <div className="bg-gradient-to-br from-accent-600 via-accent-600 to-brand-800 text-white p-6 md:p-7 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" aria-hidden />
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-100/90 font-semibold">{level}</span>
        <h3 className="font-display text-xl md:text-2xl font-bold mt-2 leading-snug">{title}</h3>
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <p className="text-stone-600 text-sm mb-5 leading-relaxed flex-1">{description}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm mb-4 pb-4 border-b border-stone-100">
          <span className="text-stone-500">
            Duration{' '}
            <strong className="text-stone-800">{duration}</strong>
          </span>
          {priceUgx != null && (
            <span className="font-semibold text-accent-600 tabular-nums">
              UGX {priceUgx.toLocaleString()}
            </span>
          )}
        </div>
        {(startDate || seatsRemaining != null) && (
          <p className="text-xs text-stone-500 mb-5">
            {startDate && (
              <>
                Next intake{' '}
                <strong className="text-stone-700">{String(startDate).slice(0, 10)}</strong>
              </>
            )}
            {seatsRemaining != null && (
              <>
                {startDate ? ' · ' : ''}
                <strong className={seatsRemaining <= 3 ? 'text-brand-600' : 'text-stone-700'}>
                  {seatsRemaining} seats left
                </strong>
              </>
            )}
          </p>
        )}
        {onEnroll && (
          <button type="button" onClick={onEnroll} className="btn-primary w-full !text-sm !py-2.5 mt-auto">
            Enroll Now
          </button>
        )}
      </div>
    </article>
  );
}
