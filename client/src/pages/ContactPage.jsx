import { useState } from 'react';

import Hero from '../components/ui/Hero.jsx';

import { useFormSubmit } from '../hooks/useApi.js';

import { api } from '../services/api.js';

import { useBusiness } from '../context/BusinessContext.jsx';

import ApiErrorAlert from '../components/ui/ApiErrorAlert.jsx';
import HoneypotField from '../components/forms/HoneypotField.jsx';
import { inputClass } from '../utils/formStyles.js';

function formatHours(hours) {

  if (!hours || typeof hours !== 'object') return [];

  return Object.entries(hours).map(([day, value]) => ({ day, value }));

}



export default function ContactPage() {

  const { business, error: businessError, reload } = useBusiness();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    companyWebsite: '',
  });

  const { submit, loading, success, error } = useFormSubmit(api.createContact);



  const handleChange = (e) => {

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    submit(form);

  };



  const hourEntries = formatHours(business.hours);



  return (

    <>

      <Hero title="Contact Us" subtitle="We'd love to hear from you." />



      <section className="py-16 md:py-20">

        <div className="max-w-6xl mx-auto px-4 space-y-6">

          <ApiErrorAlert message={businessError} onRetry={reload} />



          <div className="grid md:grid-cols-2 gap-12">

            <div id="contact-details" className="scroll-target">

              <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">Get in Touch</h2>

              <div className="space-y-4 text-stone-600">

                <p><strong>Address:</strong><br />{business.address}</p>

                <p><strong>Phone:</strong><br />

                  {(business.phones || []).map((p) => (

                    <a key={p} href={`tel:${p}`} className="block text-brand-700 hover:underline">{p}</a>

                  ))}

                </p>

                <p>

                  <strong>WhatsApp:</strong><br />

                  <a href={`https://wa.me/${business.whatsapp}`} className="text-green-700 hover:underline">

                    Chat on WhatsApp

                  </a>

                </p>

                <p>

                  <strong>Facebook:</strong><br />

                  <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">

                    CHEF Godwin Uganda

                  </a>

                </p>

                {hourEntries.length > 0 && (

                  <div>

                    <strong>Hours:</strong>

                    <ul className="mt-2 space-y-1 text-sm">

                      {hourEntries.map(({ day, value }) => (

                        <li key={day} className="capitalize">{day}: {value}</li>

                      ))}

                    </ul>

                  </div>

                )}

              </div>

            </div>



            <div id="contact-form" className="scroll-target surface-card p-6 md:p-8">

              {success ? (

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-800">

                  Message sent! We&apos;ll get back to you soon.

                </div>

              ) : (

                <form onSubmit={handleSubmit} className="space-y-4 relative">

                  <HoneypotField value={form.companyWebsite} onChange={handleChange} />

                  {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">{error}</div>}

                  <input name="fullName" required placeholder="Full Name *" value={form.fullName} onChange={handleChange} className={inputClass} />

                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} />

                  <input name="phone" type="tel" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClass} />

                  <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} className={inputClass} />

                  <textarea name="message" required rows={4} placeholder="Your message *" value={form.message} onChange={handleChange} className={inputClass} />

                  <button type="submit" disabled={loading} className="btn-primary w-full !rounded-xl">

                    {loading ? 'Sending...' : 'Send Message'}

                  </button>

                </form>

              )}

            </div>

          </div>



          {business.mapsEmbedUrl && (

            <div id="location" className="scroll-target rounded-2xl overflow-hidden border border-stone-200 bg-white">

              <iframe

                title="Chef Godwin location map"

                src={business.mapsEmbedUrl}

                className="w-full h-80"

                loading="lazy"

                referrerPolicy="no-referrer-when-downgrade"

              />

            </div>

          )}

        </div>

      </section>

    </>

  );

}


