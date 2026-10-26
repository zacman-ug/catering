import { useCallback, useMemo } from 'react';
import SectionLink from '../components/routing/SectionLink.jsx';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import ServiceCard from '../components/ui/ServiceCard.jsx';
import MenuPackageCard from '../components/ui/MenuPackageCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import FaqList from '../components/ui/FaqList.jsx';
import ServiceAreaList from '../components/ui/ServiceAreaList.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function CateringPage() {
  const { business } = useBusiness();
  const fetchServices = useCallback(() => api.getServices(), []);
  const fetchMenus = useCallback(() => api.getMenuPackages(), []);
  const { data: services, loading: servicesLoading, error: servicesError, reload: reloadServices } = useApi(fetchServices);
  const { data: menus, loading: menusLoading, error: menusError, reload: reloadMenus } = useApi(fetchMenus);

  const menuPreview = useMemo(() => (menus || []).slice(0, 4), [menus]);
  const contentError = servicesError || menusError;

  return (
    <>
      <SeoHead
        title="Event Catering"
        description="Wedding, kwanjula, corporate, birthday, graduation, and outside catering packages in Kampala."
        path="/catering"
      />
      <Hero
        title="Event Catering"
        subtitle="Weddings, introductions, birthdays, graduations, corporate events, house parties, and religious gatherings — we bring the kitchen to your venue."
        ctaLabel="Request a quote"
        ctaLink="/book#booking-form"
        secondaryLabel="View all menus"
        secondaryLink="/menus#menu-packages"
      />

      <section id="packages" className="scroll-target py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <ApiErrorAlert
            message={contentError ? contentError : ''}
            onRetry={() => {
              reloadServices();
              reloadMenus();
            }}
          />
          <SectionHeading
            title="Catering packages"
            subtitle="How we serve you — from mobile kitchen setup to on-site cooking and professional service crews."
            eyebrow="Services"
          />
          {servicesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center pt-4">
            <SectionLink to="/menus#menu-packages" className="text-link">
              See sample menus & UGX ranges
            </SectionLink>
          </div>
        </div>
      </section>

      <section id="sample-menus" className="scroll-target py-16 md:py-20 section-band-warm">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Sample menus"
            subtitle="A preview of per-event menus. Every dish list can be adjusted for your family, faith, or corporate preferences."
            eyebrow="Menus"
          />
          {menusLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {menuPreview.map((pkg) => (
                  <MenuPackageCard key={pkg.id} pkg={pkg} compact />
                ))}
              </div>
              {(menus || []).length > 4 && (
                <p className="text-center mt-8">
                  <SectionLink to="/menus#menu-packages" className="btn-outline">
                    View all {(menus || []).length} menu packages
                  </SectionLink>
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <section id="how-it-works" className="scroll-target py-14 md:py-16 section-band-stone">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div className="surface-card p-6 md:p-8">
            <p className="eyebrow mb-2">Process</p>
            <h2 className="font-display text-2xl font-bold text-brand-900 mb-5">How it works</h2>
            <ol className="space-y-4 text-stone-600 text-sm md:text-base">
              <li>
                <strong className="text-brand-800">1. Inquiry</strong> — Submit the booking form, WhatsApp, or call with your date, guest count, and event type.
              </li>
              <li>
                <strong className="text-brand-800">2. Menu planning</strong> — Pick a package from our menus page or design a custom menu with Chef Godwin.
              </li>
              <li>
                <strong className="text-brand-800">3. Confirmation</strong> — Receive a quote, pay deposit if required, and confirm logistics.
              </li>
              <li>
                <strong className="text-brand-800">4. Event day</strong> — Our team arrives, sets up the mobile kitchen, cooks on-site, and serves your guests.
              </li>
            </ol>
            <SectionLink to="/book#booking-form" className="btn-primary mt-8">
              Book Chef Godwin
            </SectionLink>
          </div>
          <ServiceAreaList
            areas={business.serviceAreas}
            minGuestCount={business.minGuestCount}
            leadTimeDays={business.leadTimeDays}
          />
        </div>
      </section>

      <section id="faq" className="scroll-target py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading title="Frequently asked questions" eyebrow="FAQ" />
          <FaqList faqs={business.faqs} />
        </div>
      </section>
    </>
  );
}
