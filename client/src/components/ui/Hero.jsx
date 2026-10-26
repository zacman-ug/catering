import SectionLink from '../routing/SectionLink.jsx';

export default function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaLink,
  ctaExternal,
  secondaryLabel,
  secondaryLink,
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white py-20 md:py-28 lg:py-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,200,143,0.24), transparent 42%), radial-gradient(circle at 80% 8%, rgba(31,122,99,0.22), transparent 38%), linear-gradient(135deg, #351b0e 0%, #5f2d16 44%, #1f7a63 140%)',
        }}
      />
      <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(-12deg,transparent,transparent_18px,rgba(255,255,255,0.5)_18px,rgba(255,255,255,0.5)_19px)]" />
      <div className="absolute -top-24 -left-10 h-64 w-64 rounded-full border border-white/12" />
      <div className="absolute -bottom-20 -right-8 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100 mb-6 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" aria-hidden />
          Kampala · Catering · Cooking School
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.35rem] font-bold mb-5 leading-[1.08] text-balance max-w-4xl mx-auto">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-brand-100/95 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            {subtitle}
          </p>
        )}
        {(ctaLabel && ctaLink) || (secondaryLabel && secondaryLink) ? (
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {ctaLabel && ctaLink && (
              <SectionLink to={ctaLink} className="btn-primary !px-8 !py-3.5 !shadow-[0_14px_32px_rgba(0,0,0,0.28)]">
                {ctaLabel}
              </SectionLink>
            )}
            {secondaryLabel && secondaryLink && (
              <SectionLink to={secondaryLink} className="btn-ghost-light">
                {secondaryLabel}
              </SectionLink>
            )}
            {ctaLabel && ctaExternal && (
              <a
                href={ctaExternal}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-8 !py-3.5"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
