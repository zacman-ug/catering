export default function SectionHeading({ title, subtitle, centered = true, eyebrow = 'Chef Godwin Signature' }) {
  return (
    <div className={`mb-12 md:mb-14 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <div className={centered ? 'heading-rule' : ''}>
          <p className={`eyebrow ${centered ? '' : 'mb-3'}`}>{eyebrow}</p>
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900 mb-4 leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-stone-600 text-base md:text-[1.05rem] leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} text-pretty`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
