import { useEffect, useState } from 'react';
import HoneypotField from './HoneypotField.jsx';
import { inputClass } from '../../utils/formStyles.js';

export default function EnrollmentForm({ courses = [], onSubmit, loading, success, error, preselectedCourseId }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseId: preselectedCourseId || '',
    message: '',
    companyWebsite: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (preselectedCourseId) {
      setForm((prev) => ({ ...prev, courseId: preselectedCourseId }));
    }
  }, [preselectedCourseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, courseId: form.courseId || undefined });
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <p className="text-green-800 font-semibold text-lg mb-2">Enrollment request received!</p>
        <p className="text-green-700 text-sm">We will contact you with course details and next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      <HoneypotField value={form.companyWebsite} onChange={handleChange} />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
          <input name="fullName" required value={form.fullName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
          <input name="phone" required type="tel" value={form.phone} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Course</label>
          <select name="courseId" value={form.courseId} onChange={handleChange} className={inputClass}>
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
        <textarea name="message" rows={3} value={form.message} onChange={handleChange} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full !rounded-xl"
      >
        {loading ? 'Submitting...' : 'Request Enrollment'}
      </button>
    </form>
  );
}
