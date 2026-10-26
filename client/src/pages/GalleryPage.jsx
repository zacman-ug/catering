import { useCallback } from 'react';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';

export default function GalleryPage() {
  const fetchGallery = useCallback(() => api.getGallery(), []);
  const { data: gallery, loading, error, reload } = useApi(fetchGallery);

  return (
    <>
      <Hero
        title="Gallery"
        subtitle="A glimpse of our events, dishes, and cooking school sessions."
      />

      <section id="gallery-grid" className="scroll-target py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Our Work" />
          <div className="mb-6">
            <ApiErrorAlert message={error} onRetry={reload} />
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : gallery?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <figure key={item.id} className="gallery-tile">
                  <img src={item.image_url} alt={item.title} loading="lazy" />
                </figure>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 surface-muted">
              <p className="text-stone-500 mb-2">Gallery photos coming soon.</p>
              <p className="text-sm text-stone-400">Follow us on Facebook for the latest event photos and recipes.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
