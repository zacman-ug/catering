import { useCallback } from 'react';
import SectionLink from '../components/routing/SectionLink.jsx';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import ServiceCard from '../components/ui/ServiceCard.jsx';
import CourseCard from '../components/ui/CourseCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import FaqList from '../components/ui/FaqList.jsx';
import ServiceAreaList from '../components/ui/ServiceAreaList.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';
import { useBusiness } from '../context/BusinessContext.jsx';
import VideoHeroStrip from '../components/VideoHeroStrip.jsx';
import SocialFeedSection from '../components/SocialFeedSection.jsx';
import ReviewsBlock from '../components/ReviewsBlock.jsx';
import SeoHead from '../components/SeoHead.jsx';

export default function HomePage() {
  const { business } = useBusiness();
  const fetchServices = useCallback(() => api.getServices(), []);
  const fetchCourses = useCallback(() => api.getCourses(), []);
  const fetchTestimonials = useCallback(() => api.getTestimonials(true), []);
  const fetchGallery = useCallback(() => api.getGallery(), []);

  const { data: services, loading: servicesLoading, error: servicesError, reload: reloadServices } = useApi(fetchServices);
  const { data: courses, loading: coursesLoading, error: coursesError, reload: reloadCourses } = useApi(fetchCourses);
  const { data: testimonials, loading: testimonialsLoading, error: testimonialsError, reload: reloadTestimonials } = useApi(fetchTestimonials);
  const { data: gallery, loading: galleryLoading, error: galleryError, reload: reloadGallery } = useApi(fetchGallery);

  const contentError = servicesError || coursesError || testimonialsError || galleryError;

  const retryAll = () => {
    reloadServices();
    reloadCourses();
    reloadTestimonials();
    reloadGallery();
  };

  return (
    <>
      <SeoHead path="/" />
      <Hero
        title="Chef Godwin Foods & Kitchen"
        subtitle={business.tagline || 'Professional outside catering and culinary training in Kampala.'}
        ctaLabel="Book Catering"
        ctaLink="/book#booking-form"
        secondaryLabel="Instant quote"
        secondaryLink="/quote#quote-tool"
      />

      <VideoHeroStrip />

      <section className="py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ring-1 ring-brand-100/70">
            <div>
              <p className="eyebrow mb-2">Planning</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-900">Plan your event budget</h2>
              <p className="text-stone-600 text-sm md:text-base mt-2 max-w-lg">
                Guest count and event type → instant UGX range. We confirm final pricing on a quick call.
              </p>
            </div>
            <SectionLink to="/quote#quote-tool" className="btn-primary shrink-0">
              Open quote tool
            </SectionLink>
          </div>
        </div>
      </section>

      <SocialFeedSection />

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ApiErrorAlert
            message={contentError ? 'Some content could not be loaded. Please check that the API and database are running.' : ''}
            onRetry={contentError ? retryAll : undefined}
          />
        </div>
      </section>

      <section id="services" className="scroll-target py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Catering Services"
            subtitle="From intimate gatherings to events serving 350+ guests — fresh, locally sourced ingredients prepared with passion."
          />
          {servicesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(services || []).map((s) => (
                <ServiceCard
                  key={s.id}
                  title={s.title}
                  description={s.description}
                  features={s.features}
                />
              ))}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
              <SectionLink to="/catering#packages" className="text-link">
                Catering packages
              </SectionLink>
              <SectionLink to="/menus#menu-packages" className="text-link">
                Menus & price ranges
              </SectionLink>
          </div>
        </div>
      </section>

      <section id="home-faq" className="scroll-target py-14 md:py-16 section-band-warm">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <ServiceAreaList
            areas={business.serviceAreas}
            minGuestCount={business.minGuestCount}
            leadTimeDays={business.leadTimeDays}
          />
          <div className="surface-card p-6 md:p-8">
            <p className="eyebrow mb-2">FAQ</p>
            <h3 className="font-display text-xl md:text-2xl font-bold text-brand-900 mb-5">Catering questions</h3>
            <FaqList faqs={(business.faqs || []).slice(0, 3)} />
          </div>
        </div>
      </section>

      <section id="cooking-school" className="scroll-target py-16 md:py-24 section-band-warm">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Godwin Cooking School"
            subtitle="Learn to cook like a professional chef. Regular intakes for beginners and aspiring caterers."
          />
          {coursesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(courses || []).slice(0, 3).map((c) => (
                <CourseCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  duration={c.duration}
                  level={c.level}
                  priceUgx={c.price_ugx}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <SectionLink
              to="/school#courses"
              className="btn-primary"
            >
              Explore Courses
            </SectionLink>
          </div>
        </div>
      </section>

      <div id="testimonials" className="scroll-target">
        {testimonialsLoading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : (
          <ReviewsBlock testimonials={testimonials || []} />
        )}
      </div>

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <SectionLink to="/case-studies" className="text-link">
            See event case studies
          </SectionLink>
        </div>
      </section>

      <section id="gallery-preview" className="scroll-target py-16 md:py-24 section-band-stone">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Event Highlights"
            subtitle="Real moments from Chef Godwin Foods and Kitchen Uganda."
          />
          {galleryLoading ? (
            <LoadingSpinner />
          ) : (gallery || []).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(gallery || []).slice(0, 8).map((item) => (
                <figure key={item.id} className="gallery-tile">
                  <img src={item.image_url} alt={item.title} loading="lazy" />
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-500 text-sm">Gallery photos will appear after images are synced from the business profile.</p>
          )}
          <div className="text-center mt-8">
            <SectionLink to="/gallery#gallery-grid" className="text-link">
              View full gallery
            </SectionLink>
          </div>
        </div>
      </section>

      <section id="book-cta" className="scroll-target py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="cta-panel">
            <div className="relative z-10">
              <p className="eyebrow !text-brand-200 mb-3">Get started</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Ready to book?</h2>
              <p className="text-brand-100/95 mb-8 max-w-lg mx-auto">Call, WhatsApp, or send an inquiry — we respond quickly for Kampala events.</p>
              <div className="flex flex-wrap justify-center gap-3">
                {(business.phones || []).map((phone) => (
                  <a key={phone} href={`tel:${phone}`} className="btn-outline !border-white/30 !bg-white/95">
                    {phone}
                  </a>
                ))}
                <SectionLink to="/book#booking-form" className="btn-primary">
                  Book online
                </SectionLink>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
