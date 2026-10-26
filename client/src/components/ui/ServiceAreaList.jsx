export default function ServiceAreaList({ areas = [], minGuestCount, leadTimeDays }) {
  if (!Array.isArray(areas) || areas.length === 0) {
    return null;
  }

  return (
    <div className="surface-muted p-6 md:p-8 h-full">
      <p className="eyebrow mb-2">Coverage</p>
      <h3 className="font-display text-xl md:text-2xl font-bold text-brand-900 mb-3">Service area & policies</h3>
      <p className="text-sm text-stone-600 mb-5 leading-relaxed">
        We cater across Kampala and nearby districts. Minimum {minGuestCount || 20} guests for standard outside
        catering packages. Please book at least {leadTimeDays || 7} days in advance when possible.
      </p>
      <ul className="flex flex-wrap gap-2">
        {areas.map((area) => (
          <li
            key={area}
            className="text-[11px] font-semibold uppercase tracking-wide bg-white text-brand-800 px-3 py-1.5 rounded-full border border-brand-100 shadow-sm"
          >
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
}
