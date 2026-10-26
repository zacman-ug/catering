import { useCallback } from 'react';
import Hero from '../components/ui/Hero.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';

export default function CaseStudiesPage() {
  const fetchCases = useCallback(() => api.getCaseStudies(), []);
  const { data, loading } = useApi(fetchCases);

  return (
    <>
      <SeoHead title="Case Studies" description="Real catering events by Chef Godwin." path="/case-studies" />
      <Hero title="Case Studies" subtitle="Before-and-after event stories from our catering team." />
      <section className="py-16 max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {loading ? <LoadingSpinner /> : (data || []).map((item) => (
          <article key={item.id} className="bg-white border border-stone-200 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wide text-brand-700 font-semibold">{item.event_type}</p>
            <h2 className="font-display text-xl font-bold text-brand-900 mt-1">{item.title}</h2>
            <p className="text-sm text-stone-500 mt-1">{item.guest_count} guests • {item.location}</p>
            <p className="text-sm text-stone-600 mt-3">{item.summary}</p>
            {item.content && <p className="text-sm text-stone-600 mt-2">{item.content}</p>}
          </article>
        ))}
      </section>
    </>
  );
}
