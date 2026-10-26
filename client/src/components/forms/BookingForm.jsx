import { useState } from 'react';

import { EVENT_TYPES } from '../../utils/constants.js';

import { BUDGET_RANGE_OPTIONS, SERVICE_STYLE_OPTIONS } from '../../utils/bookingOptions.js';
import { inputClass } from '../../utils/formStyles.js';

import { useBusiness } from '../../context/BusinessContext.jsx';
import HoneypotField from './HoneypotField.jsx';



export default function BookingForm({ onSubmit, loading, success, error }) {

  const { business } = useBusiness();

  const [form, setForm] = useState({

    fullName: '',

    email: '',

    phone: '',

    eventType: '',

    eventDate: '',

    guestCount: '',

    venue: '',

    serviceStyle: '',

    budgetRange: '',

    dietaryRequirements: '',

    message: '',

    companyWebsite: '',

  });



  const handleChange = (e) => {

    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };



  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit({

      ...form,

      guestCount: form.guestCount ? Number.parseInt(form.guestCount, 10) : undefined,

    });

  };



  if (success) {

    return (

      <div className="rounded-2xl border border-accent-100 bg-accent-50/80 p-8 text-center">

        <p className="text-green-800 font-semibold text-lg mb-2">Thank you!</p>

        <p className="text-green-700 text-sm">Your booking inquiry has been submitted. Chef Godwin&apos;s team will contact you shortly.</p>

      </div>

    );

  }



  return (

    <form onSubmit={handleSubmit} className="space-y-4 relative">

      <HoneypotField
        value={form.companyWebsite}
        onChange={handleChange}
      />

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>

      )}



      <p className="text-xs text-stone-500">

        Minimum {business.minGuestCount || 20} guests for standard packages. Book at least {business.leadTimeDays || 7} days ahead when possible.

      </p>



      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>

          <input name="fullName" required value={form.fullName} onChange={handleChange} className={inputClass} />

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>

          <input name="phone" required type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+256..." />

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>

          <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Event Type *</label>

          <select name="eventType" required value={form.eventType} onChange={handleChange} className={inputClass}>

            <option value="">Select event type</option>

            {EVENT_TYPES.map((t) => (

              <option key={t} value={t}>{t}</option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Event Date</label>

          <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} className={inputClass} />

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Number of Guests</label>

          <input name="guestCount" type="number" min="1" value={form.guestCount} onChange={handleChange} className={inputClass} />

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Service Style</label>

          <select name="serviceStyle" value={form.serviceStyle} onChange={handleChange} className={inputClass}>

            <option value="">Select service style</option>

            {SERVICE_STYLE_OPTIONS.map((option) => (

              <option key={option.value} value={option.value}>{option.label}</option>

            ))}

          </select>

        </div>

        <div>

          <label className="block text-sm font-medium text-stone-700 mb-1">Estimated Budget</label>

          <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className={inputClass}>

            <option value="">Select budget range</option>

            {BUDGET_RANGE_OPTIONS.map((option) => (

              <option key={option.value} value={option.value}>{option.label}</option>

            ))}

          </select>

        </div>

      </div>



      <div>

        <label className="block text-sm font-medium text-stone-700 mb-1">Venue / Location</label>

        <input name="venue" value={form.venue} onChange={handleChange} className={inputClass} placeholder="Event address or area" />

      </div>



      <div>

        <label className="block text-sm font-medium text-stone-700 mb-1">Dietary Requirements</label>

        <input name="dietaryRequirements" value={form.dietaryRequirements} onChange={handleChange} className={inputClass} placeholder="Halal, vegetarian, allergies, etc." />

      </div>



      <div>

        <label className="block text-sm font-medium text-stone-700 mb-1">Additional Details</label>

        <textarea name="message" rows={4} value={form.message} onChange={handleChange} className={inputClass} />

      </div>



      <button

        type="submit"

        disabled={loading}

        className="btn-primary w-full !rounded-xl"

      >

        {loading ? 'Submitting...' : 'Submit Booking Inquiry'}

      </button>

    </form>

  );

}


