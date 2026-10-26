import { useState } from 'react';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import BookingForm from '../components/forms/BookingForm.jsx';
import SeoHead from '../components/SeoHead.jsx';
import { api } from '../services/api.js';
import { useBusiness } from '../context/BusinessContext.jsx';
import { buildBookingWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsappClient.js';

export default function BookPage() {
  const { business } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const submit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await api.createBooking(data);
      setSuccess(true);
      if (res.whatsappUrl) {
        setWhatsappUrl(res.whatsappUrl);
      } else {
        const message = buildBookingWhatsAppMessage(res.data);
        if (message.ok) {
          const url = buildWhatsAppUrl({ phone: business.whatsapp, message: message.value });
          if (url.ok) setWhatsappUrl(url.value);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoHead title="Book Catering" description="Submit a catering inquiry to Chef Godwin." path="/book" />
      <Hero
        title="Book Catering"
        subtitle="Tell us about your event and Chef Godwin's team will get back to you with a quote."
        ctaLink="/quote#quote-tool"
        ctaLabel="Estimate Budget First"
      />

      <section id="booking-form" className="scroll-target py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading title="Booking Inquiry" />
          <div className="surface-card p-6 md:p-10">
            <BookingForm onSubmit={submit} loading={loading} success={success} error={error} />
            {success && whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-green-700 font-semibold">
                Continue on WhatsApp →
              </a>
            )}
          </div>
          <p className="text-center text-sm text-stone-500 mt-6">
            Prefer to call?{' '}
            <a href={`tel:${business.phones?.[0]}`} className="text-brand-700 font-medium hover:underline">
              {business.phones?.[0]}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
