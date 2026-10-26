const API_BASE = '/api';

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid server response');
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }

  const data = await parseResponse(response);
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  getBusinessInfo: () => request('/business'),
  getFaqs: () => request('/faqs'),
  getServices: () => request('/services'),
  getCourses: () => request('/courses'),
  getCoursesAvailability: () => request('/courses/availability'),
  getMenuPackages: () => request('/menu-packages'),
  getChecklist: () => request('/checklist'),
  getBlogPosts: () => request('/blog'),
  getBlogPost: (slug) => request(`/blog/${encodeURIComponent(slug)}`),
  getCaseStudies: () => request('/case-studies'),
  estimateQuote: (body) => request('/quote/estimate', { method: 'POST', body: JSON.stringify(body) }),
  getGallery: (category) => request(`/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getTestimonials: (featured) => request(`/testimonials${featured ? '?featured=true' : ''}`),
  createBooking: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  createEnrollment: (body) => request('/enrollments', { method: 'POST', body: JSON.stringify(body) }),
  createContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getAdminBookings: (status) => request(`/admin/bookings${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  getAdminBooking: (id) => request(`/admin/bookings/${id}`),
  updateBooking: (id, body) => request(`/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  exportBookingsCsv: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/bookings/export.csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const data = await parseResponse(response);
      throw new Error(data.message || 'Export failed');
    }
    return response.text();
  },
  getAdminCalendar: (month) => request(`/admin/calendar?month=${encodeURIComponent(month)}`),
  getAdminEnrollments: (status) => request(`/admin/enrollments${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  updateEnrollment: (id, body) => request(`/admin/enrollments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateEnrollmentStatus: (id, status) => request(`/admin/enrollments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminContacts: () => request('/admin/contacts'),
  markContactRead: (id) => request(`/admin/contacts/${id}/read`, { method: 'PATCH' }),
  listAdminContent: (table) => request(`/admin/content/${table}`),
  saveAdminContent: (table, id, body) => request(`/admin/content/${table}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  createAdminContent: (table, body) => request(`/admin/content/${table}`, { method: 'POST', body: JSON.stringify(body) }),
  updateBusinessSettings: (body) => request('/admin/settings/business', { method: 'PUT', body: JSON.stringify(body) }),
  uploadGalleryImage: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/gallery/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};
