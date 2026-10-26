import TestimonialCard from './ui/TestimonialCard.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function ReviewsBlock({ testimonials = [] }) {
  const { business } = useBusiness();

  return (
    <section className="section-band-cool py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <p className="eyebrow mb-2">Reviews</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-900">What our clients say</h2>
            <p className="text-stone-600 mt-2 max-w-xl text-pretty">
              Trusted for weddings, introductions, and corporate events across Kampala.
            </p>
          </div>
          {business.googleReviewsUrl && (
            <a
              href={business.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline !text-sm shrink-0"
            >
              Google reviews
            </a>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              clientName={t.client_name}
              eventType={t.event_type}
              content={t.content}
              rating={t.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
