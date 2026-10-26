export default function FaqList({ faqs = [] }) {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {faqs.map((item) => (
        <details
          key={item.question}
          className="group surface-card px-5 py-4 open:ring-1 open:ring-brand-200/60 transition-shadow"
        >
          <summary className="cursor-pointer font-semibold text-brand-900 list-none flex items-center justify-between gap-4 text-sm md:text-base">
            <span>{item.question}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 group-open:rotate-180 transition-transform duration-200">
              ▾
            </span>
          </summary>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed pr-2">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
