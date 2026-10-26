import { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import ApiErrorAlert from '../../components/ui/ApiErrorAlert.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import AdminContentPanel from '../../components/admin/AdminContentPanel.jsx';

const TABS = ['bookings', 'calendar', 'enrollments', 'contacts', 'content', 'gallery'];

function EnrollmentPaymentRow({ enrollment, onSaved, onError }) {
  const [paymentStatus, setPaymentStatus] = useState(enrollment.payment_status || 'unpaid');
  const [amountPaid, setAmountPaid] = useState(enrollment.amount_paid_ugx ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateEnrollment(enrollment.id, {
        paymentStatus,
        amountPaidUgx: amountPaid === '' ? 0 : Number(amountPaid),
      });
      onSaved();
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-t">
      <td className="p-2">{enrollment.full_name}</td>
      <td className="p-2">{enrollment.course_title || '—'}</td>
      <td className="p-2">{enrollment.payment_status || 'unpaid'} ({enrollment.amount_paid_ugx || 0} UGX)</td>
      <td className="p-2 flex flex-wrap gap-1">
        <select className="border rounded px-1" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {['unpaid', 'partial', 'paid'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="border rounded px-1 w-24" type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="UGX" />
        <button type="button" disabled={saving} onClick={save} className="text-brand-700 font-semibold">Save</button>
      </td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().toISOString().slice(0, 7));
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingRes, enrollmentRes, contactRes] = await Promise.all([
        api.getAdminBookings(),
        api.getAdminEnrollments(),
        api.getAdminContacts(),
      ]);
      setBookings(bookingRes.data || []);
      setEnrollments(enrollmentRes.data || []);
      setContacts(contactRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCalendar = useCallback(async () => {
    try {
      const res = await api.getAdminCalendar(calendarMonth);
      setCalendarEvents(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  }, [calendarMonth]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (tab === 'calendar') loadCalendar(); }, [tab, loadCalendar]);

  useEffect(() => {
    if (!selectedBookingId) {
      setSelectedBooking(null);
      return;
    }
    api.getAdminBooking(selectedBookingId)
      .then((res) => setSelectedBooking(res.data))
      .catch((err) => setError(err.message));
  }, [selectedBookingId]);

  const exportCsv = async () => {
    try {
      const csv = await api.exportBookingsCsv();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveBookingOps = async () => {
    if (!selectedBooking) return;
    try {
      const num = (v) => (v === '' || v == null ? null : Number(v));
      await api.updateBooking(selectedBooking.id, {
        status: selectedBooking.status,
        staffCount: num(selectedBooking.staff_count),
        quotedAmountUgx: num(selectedBooking.quoted_amount_ugx),
        depositAmountUgx: num(selectedBooking.deposit_amount_ugx),
        depositStatus: selectedBooking.deposit_status,
        invoiceStatus: selectedBooking.invoice_status,
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) return;
    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('title', galleryFile.name);
    try {
      await api.uploadGalleryImage(formData);
      setGalleryFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === key ? 'bg-brand-600 text-white' : 'bg-white border border-stone-300'}`}>
            {key}
          </button>
        ))}
        <button type="button" onClick={exportCsv} className="px-4 py-2 rounded-full text-sm font-semibold bg-accent-600 text-white">Export CSV</button>
      </div>

      <ApiErrorAlert message={error} onRetry={loadData} />
      {loading ? <LoadingSpinner /> : (
        <>
          {tab === 'bookings' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 rounded-xl overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-stone-50"><th className="p-2 text-left">Client</th><th className="p-2">Event</th></tr></thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t cursor-pointer hover:bg-brand-50" onClick={() => setSelectedBookingId(b.id)}>
                        <td className="p-2">{b.full_name}</td>
                        <td className="p-2">{b.event_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedBooking && (
                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2 text-sm">
                  <h3 className="font-bold text-brand-900">Booking detail</h3>
                  <p>Phone: {selectedBooking.phone}</p>
                  <p>Email: {selectedBooking.email || '—'}</p>
                  <p>Guests: {selectedBooking.guest_count ?? '—'}</p>
                  <p>Venue: {selectedBooking.venue || '—'}</p>
                  <p>Dietary: {selectedBooking.dietary_requirements || '—'}</p>
                  <p>Budget range: {selectedBooking.budget_range || '—'}</p>
                  <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Staff count" value={selectedBooking.staff_count ?? ''} onChange={(e) => setSelectedBooking({ ...selectedBooking, staff_count: e.target.value })} />
                  <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Quoted UGX" value={selectedBooking.quoted_amount_ugx ?? ''} onChange={(e) => setSelectedBooking({ ...selectedBooking, quoted_amount_ugx: e.target.value })} />
                  <input className="border rounded px-2 py-1 w-full" type="number" placeholder="Deposit UGX" value={selectedBooking.deposit_amount_ugx ?? ''} onChange={(e) => setSelectedBooking({ ...selectedBooking, deposit_amount_ugx: e.target.value })} />
                  <select className="border rounded px-2 py-1 w-full" value={selectedBooking.deposit_status || 'none'} onChange={(e) => setSelectedBooking({ ...selectedBooking, deposit_status: e.target.value })}>
                    {['none', 'requested', 'partial', 'paid'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="border rounded px-2 py-1 w-full" value={selectedBooking.invoice_status || 'pending'} onChange={(e) => setSelectedBooking({ ...selectedBooking, invoice_status: e.target.value })}>
                    {['pending', 'quoted', 'deposit_paid', 'paid', 'completed'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="button" onClick={saveBookingOps} className="bg-brand-600 text-white px-4 py-2 rounded-lg">Save operations</button>
                </div>
              )}
            </div>
          )}

          {tab === 'calendar' && (
            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <input type="month" value={calendarMonth} onChange={(e) => setCalendarMonth(e.target.value)} className="border rounded px-2 py-1 mb-4" />
              <ul className="space-y-2 text-sm">
                {calendarEvents.map((event) => (
                  <li key={event.id} className="border rounded p-2">{event.event_date} — {event.full_name} ({event.event_type}, {event.guest_count || '?'} guests)</li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'enrollments' && (
            <table className="w-full bg-white border border-stone-200 rounded-xl text-sm">
              <thead className="bg-stone-50"><tr><th className="p-2">Student</th><th>Course</th><th>Payment</th><th className="p-2">Update</th></tr></thead>
              <tbody>
                {enrollments.map((e) => (
                  <EnrollmentPaymentRow key={e.id} enrollment={e} onSaved={loadData} onError={setError} />
                ))}
              </tbody>
            </table>
          )}

          {tab === 'contacts' && (
            <ul className="bg-white border border-stone-200 rounded-xl divide-y text-sm">
              {contacts.map((c) => <li key={c.id} className="p-3">{c.full_name}: {c.message}</li>)}
            </ul>
          )}

          {tab === 'content' && <AdminContentPanel />}

          {tab === 'gallery' && (
            <form onSubmit={uploadGallery} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-brand-900">Upload gallery image</h3>
              <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} />
              <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-lg">Upload</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
