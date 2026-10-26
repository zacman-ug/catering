import { useState } from 'react';
import { EVENT_TYPES } from '../utils/constants.js';
import { SERVICE_STYLE_OPTIONS } from '../utils/bookingOptions.js';
import { api } from '../services/api.js';
import SectionLink from './routing/SectionLink.jsx';
import { trackEvent } from '../utils/analytics.js';
import { inputClass } from '../utils/formStyles.js';

export default function QuoteEstimator() {
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [serviceStyle, setServiceStyle] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEstimate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.estimateQuote({
        eventType,
        guestCount: Number.parseInt(guestCount, 10),
        serviceStyle,
      });
      setResult(res.data);
      trackEvent('quote_estimate', { eventType, guestCount });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-6 md:p-8 ring-1 ring-brand-100/80">
      <p className="eyebrow mb-2">Budget planning</p>
      <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-900 mb-2">Instant quote estimator</h3>
      <p className="text-sm text-stone-600 mb-6">Rough UGX range for your guest count — final pricing confirmed on call.</p>
      <form onSubmit={handleEstimate} className="grid md:grid-cols-3 gap-4">
        <select required value={eventType} onChange={(e) => setEventType(e.target.value)} className={inputClass}>
          <option value="">Event type</option>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input required type="number" min="1" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className={inputClass} placeholder="Number of guests" />
        <select value={serviceStyle} onChange={(e) => setServiceStyle(e.target.value)} className={inputClass}>
          <option value="">Service style</option>
          {SERVICE_STYLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button type="submit" disabled={loading} className="btn-primary md:col-span-3 !rounded-xl">
          {loading ? 'Calculating…' : 'Estimate budget'}
        </button>
      </form>
      {error && <p className="text-red-700 text-sm mt-4 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>}
      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 text-sm">
          <p className="font-display text-lg font-bold text-brand-900 mb-1">
            UGX {result.minUgx.toLocaleString()} – {result.maxUgx.toLocaleString()}
          </p>
          <p className="text-stone-600 mb-4">{result.note || 'Confirm final menu and pricing with our team.'}</p>
          <SectionLink to="/book#booking-form" className="text-link text-sm">
            Request exact quote
          </SectionLink>
        </div>
      )}
    </div>
  );
}
