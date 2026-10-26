import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  bookingService,
  enrollmentService,
  contactService,
  contentService,
} from '../services/index.js';
import { notifyBookingCreated } from '../services/emailService.js';
import { estimateQuote } from '../domain/quoteEstimator.js';
import { buildBookingWhatsAppMessage, buildWhatsAppUrl } from '../domain/whatsapp.js';
import { platformPublicService } from '../services/platformService.js';
import { buildMapsEmbedUrl } from '../domain/businessInfo.js';
import { trimString } from '../utils/guards.js';

async function runAuthQuery(text, params) {
  try {
    return await query(text, params);
  } catch {
    throw new AppError('Database is unavailable. Please try again later.', 503);
  }
}

export async function healthCheck(_req, res) {
  res.json({
    success: true,
    message: 'Chef Godwin API is running',
    timestamp: new Date().toISOString(),
  });
}

export async function getServices(_req, res) {
  const services = await contentService.getServices();
  res.json({ success: true, data: services });
}

export async function getCourses(_req, res) {
  const courses = await contentService.getCourses();
  res.json({ success: true, data: courses });
}

export async function getGallery(req, res) {
  const gallery = await contentService.getGallery({ category: req.query.category });
  res.json({ success: true, data: gallery });
}

export async function getTestimonials(req, res) {
  const testimonials = await contentService.getTestimonials({
    featured: req.query.featured,
  });
  res.json({ success: true, data: testimonials });
}

export async function getBusinessInfo(_req, res) {
  const info = await contentService.getBusinessInfo();
  if (!info) {
    throw new AppError('Business information is not configured', 404);
  }

  const mapsEmbedUrl = buildMapsEmbedUrl(info.coordinates, info.address);

  res.json({
    success: true,
    data: {
      ...info,
      mapsEmbedUrl,
    },
  });
}

export async function getFaqs(_req, res) {
  const info = await contentService.getBusinessInfo();
  res.json({ success: true, data: info?.faqs || [] });
}

export async function postQuote(req, res) {
  const result = estimateQuote(req.body || {});
  if (!result.ok) throw new AppError(result.error, 400);
  res.json({ success: true, data: result.value });
}

export async function getMenuPackages(_req, res) {
  res.json({ success: true, data: await platformPublicService.getMenuPackages() });
}

export async function getChecklist(_req, res) {
  res.json({ success: true, data: await platformPublicService.getChecklist() });
}

export async function getBlogPosts(_req, res) {
  res.json({ success: true, data: await platformPublicService.getBlogPosts() });
}

export async function getBlogPost(req, res) {
  const post = await platformPublicService.getBlogPostBySlug(req.params.slug);
  if (!post) throw new AppError('Post not found', 404);
  res.json({ success: true, data: post });
}

export async function getCaseStudies(_req, res) {
  res.json({ success: true, data: await platformPublicService.getCaseStudies() });
}

export async function getCoursesAvailability(_req, res) {
  res.json({ success: true, data: await platformPublicService.getCoursesWithAvailability() });
}

export async function createBooking(req, res) {
  const booking = await bookingService.create(req.body);

  let whatsappUrl = null;
  try {
    const business = await contentService.getBusinessInfo();
    await notifyBookingCreated({
      booking,
      businessName: business?.name,
      chefWhatsApp: business?.whatsapp,
    });
    const waMessage = buildBookingWhatsAppMessage(booking);
    if (waMessage.ok && business?.whatsapp) {
      const builtUrl = buildWhatsAppUrl({ phone: business.whatsapp, message: waMessage.value });
      if (builtUrl.ok) whatsappUrl = builtUrl.value;
    }
  } catch (notifyError) {
    console.warn('Booking notification skipped:', notifyError?.message || notifyError);
  }

  res.status(201).json({
    success: true,
    message: 'Booking inquiry submitted. We will contact you shortly.',
    data: booking,
    whatsappUrl,
  });
}

export async function createEnrollment(req, res) {
  const enrollment = await enrollmentService.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Enrollment request submitted successfully.',
    data: enrollment,
  });
}

export async function createContact(req, res) {
  const message = await contactService.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Message sent successfully.',
    data: message,
  });
}

export async function login(req, res) {
  const email = trimString(req.body?.email);
  const password = req.body?.password;

  if (!email || typeof password !== 'string' || !password) {
    throw new AppError('Valid email and password are required', 400);
  }

  const result = await runAuthQuery('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    },
  });
}

export async function getAdminBookings(req, res) {
  const bookings = await bookingService.findAll(req.query);
  res.json({ success: true, data: bookings });
}

export async function updateBookingStatus(req, res) {
  const booking = await bookingService.updateStatus(req.params.id, req.body);
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
}

export async function getAdminEnrollments(req, res) {
  const enrollments = await enrollmentService.findAll(req.query);
  res.json({ success: true, data: enrollments });
}

export async function updateEnrollmentStatus(req, res) {
  const enrollment = await enrollmentService.updateStatus(req.params.id, req.body);
  if (!enrollment) throw new AppError('Enrollment not found', 404);
  res.json({ success: true, data: enrollment });
}

export async function getAdminContacts(req, res) {
  const messages = await contactService.findAll(req.query);
  res.json({ success: true, data: messages });
}

export async function markContactRead(req, res) {
  const message = await contactService.markRead(req.params.id);
  if (!message) throw new AppError('Contact message not found', 404);
  res.json({ success: true, data: message });
}
