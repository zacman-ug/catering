import { Router } from 'express';
import {
  healthCheck,
  getServices,
  getCourses,
  getGallery,
  getTestimonials,
  getBusinessInfo,
  getFaqs,
  createBooking,
  createEnrollment,
  createContact,
  login,
  getAdminBookings,
  updateBookingStatus,
  getAdminEnrollments,
  updateEnrollmentStatus,
  getAdminContacts,
  markContactRead,
  postQuote,
  getMenuPackages,
  getChecklist,
  getBlogPosts,
  getBlogPost,
  getCaseStudies,
  getCoursesAvailability,
} from '../controllers/index.js';
import {
  getAdminBookingById,
  patchAdminBooking,
  exportAdminBookingsCsv,
  getAdminCalendar,
  patchAdminEnrollmentFull,
  listAdminContent,
  saveAdminContent,
  createAdminContent,
  updateBusinessSettings,
  uploadGalleryImage,
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { rateLimitPosts } from '../middleware/rateLimit.js';
import { rejectHoneypot } from '../middleware/honeypot.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { upload } from '../config/multer.js';
import {
  bookingValidation,
  enrollmentValidation,
  contactValidation,
  loginValidation,
} from '../utils/validators.js';

const router = Router();

router.get('/health', asyncHandler(healthCheck));
router.get('/business', asyncHandler(getBusinessInfo));
router.get('/faqs', asyncHandler(getFaqs));
router.get('/services', asyncHandler(getServices));
router.get('/courses', asyncHandler(getCourses));
router.get('/courses/availability', asyncHandler(getCoursesAvailability));
router.get('/gallery', asyncHandler(getGallery));
router.get('/testimonials', asyncHandler(getTestimonials));
router.get('/menu-packages', asyncHandler(getMenuPackages));
router.get('/checklist', asyncHandler(getChecklist));
router.get('/blog', asyncHandler(getBlogPosts));
router.get('/blog/:slug', asyncHandler(getBlogPost));
router.get('/case-studies', asyncHandler(getCaseStudies));
router.post('/quote/estimate', rateLimitPosts, asyncHandler(postQuote));

router.post('/bookings', rateLimitPosts, rejectHoneypot(), bookingValidation, validate, asyncHandler(createBooking));
router.post('/enrollments', rateLimitPosts, rejectHoneypot(), enrollmentValidation, validate, asyncHandler(createEnrollment));
router.post('/contact', rateLimitPosts, rejectHoneypot(), contactValidation, validate, asyncHandler(createContact));

router.post('/auth/login', rateLimitPosts, loginValidation, validate, asyncHandler(login));

router.get('/admin/bookings', authenticate, requireAdmin, asyncHandler(getAdminBookings));
router.get('/admin/bookings/export.csv', authenticate, requireAdmin, asyncHandler(exportAdminBookingsCsv));
router.get('/admin/bookings/:id', authenticate, requireAdmin, asyncHandler(getAdminBookingById));
router.patch('/admin/bookings/:id', authenticate, requireAdmin, asyncHandler(patchAdminBooking));
router.patch('/admin/bookings/:id/status', authenticate, requireAdmin, asyncHandler(updateBookingStatus));
router.get('/admin/calendar', authenticate, requireAdmin, asyncHandler(getAdminCalendar));
router.get('/admin/enrollments', authenticate, requireAdmin, asyncHandler(getAdminEnrollments));
router.patch('/admin/enrollments/:id', authenticate, requireAdmin, asyncHandler(patchAdminEnrollmentFull));
router.patch('/admin/enrollments/:id/status', authenticate, requireAdmin, asyncHandler(updateEnrollmentStatus));
router.get('/admin/contacts', authenticate, requireAdmin, asyncHandler(getAdminContacts));
router.patch('/admin/contacts/:id/read', authenticate, requireAdmin, asyncHandler(markContactRead));

router.get('/admin/content/:table', authenticate, requireAdmin, asyncHandler(listAdminContent));
router.post('/admin/content/:table', authenticate, requireAdmin, asyncHandler(createAdminContent));
router.put('/admin/content/:table/:id', authenticate, requireAdmin, asyncHandler(saveAdminContent));
router.put('/admin/settings/business', authenticate, requireAdmin, asyncHandler(updateBusinessSettings));
router.post(
  '/admin/gallery/upload',
  authenticate,
  requireAdmin,
  upload.single('image'),
  asyncHandler(uploadGalleryImage)
);

export default router;
