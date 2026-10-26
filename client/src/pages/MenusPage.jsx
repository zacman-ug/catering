import { useCallback, useMemo } from 'react';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import MenuPackageCard from '../components/ui/MenuPackageCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import SectionLink from '../components/routing/SectionLink.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';
import { groupMenuPackagesByEvent } from '../utils/groupMenuPackages.js';

export default function MenusPage() {
  const fetchMenus = useCallback(() => api.getMenuPackages(), []);
  const { data, loading, error, reload } = useApi(fetchMenus);

  const grouped = useMemo(() => groupMenuPackagesByEvent(data || []), [data]);

  return (
    <>
      <SeoHead
        title="Menus & Packages"
        description="Wedding, kwanjula, corporate, birthday, graduation, and custom catering menus with sample dishes and UGX ranges."
        path="/menus"
      />
      <Hero
        title="Menus & Packages"
        subtitle="Sample menus and typical price ranges for every major event we cater — from intimate house parties to 350+ guest celebrations."
        ctaLabel="Request a quote"
        ctaLink="/book#booking-form"
        secondaryLabel="Instant estimator"
        secondaryLink="/quote#quote-tool"
      />

      <section id="menu-packages" className="scroll-target py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 space-y-14">
          <ApiErrorAlert message={error} onRetry={reload} />
          <SectionHeading
            title="Per-event menus"
            subtitle="Each package shows sample dishes and a typical total-event range in UGX. Your final quote depends on guest count, service style, and venue logistics."
            eyebrow="Packages"
          />

          {loading ? (
            <LoadingSpinner />
          ) : grouped.length === 0 ? (
            <p className="text-center text-stone-500">Menu packages will appear once the database is seeded.</p>
          ) : (
            grouped.map(({ eventType, packages }) => (
              <div key={eventType} id={`menus-${eventType.replace(/\s+/g, '-').toLowerCase()}`} className="scroll-target">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="eyebrow mb-1">{eventType}</p>
                    <h3 className="font-display text-2xl font-bold text-brand-900">
                      {packages.length > 1 ? `${packages.length} menu options` : 'Menu option'}
                    </h3>
                  </div>
                  <SectionLink to="/quote#quote-tool" className="text-link text-sm">
                    Estimate for {eventType.split('/')[0].trim()}
                  </SectionLink>
                </div>
                <div className={`grid gap-6 ${packages.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
                  {packages.map((pkg) => (
                    <MenuPackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="surface-muted p-8 md:p-10 text-center">
            <p className="font-display text-xl font-bold text-brand-900 mb-2">Need a menu not listed here?</p>
            <p className="text-stone-600 text-sm max-w-lg mx-auto mb-5">
              Chef Godwin builds custom menus for mixed cultures, VIP dinners, and large outdoor events. Share your vision on the booking form.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <SectionLink to="/book#booking-form" className="btn-primary">
                Book catering
              </SectionLink>
              <SectionLink to="/catering#packages" className="btn-outline">
                How our packages work
              </SectionLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
