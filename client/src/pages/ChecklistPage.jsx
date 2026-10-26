import { useCallback } from 'react';
import Hero from '../components/ui/Hero.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { useApi } from '../hooks/useApi.js';
import { api } from '../services/api.js';

export default function ChecklistPage() {
  const fetchChecklist = useCallback(() => api.getChecklist(), []);
  const { data, loading, error, reload } = useApi(fetchChecklist);

  const grouped = (data || []).reduce((acc, item) => {
    const key = item.category || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <SeoHead title="Event Checklist" description="What clients should prepare for outside catering." path="/checklist" />
      <Hero title="Event Checklist" subtitle="Prepare your venue and timeline for smooth catering service." />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <ApiErrorAlert message={error} onRetry={reload} />
          {loading ? <LoadingSpinner /> : Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="bg-white border border-stone-200 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-brand-900 mb-3">{category}</h2>
              <ul className="space-y-2 text-sm text-stone-700">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <span>{item.client_provides ? '☑' : '•'}</span>
                    <span>{item.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
