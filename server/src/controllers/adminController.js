import { bookingsToCsv } from '../domain/csvExport.js';
import { platformAdminService } from '../services/platformService.js';
import { AppError } from '../middleware/errorHandler.js';
import { trimString } from '../utils/guards.js';

export async function getAdminBookingById(req, res) {
  const booking = await platformAdminService.getBookingById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
}

export async function patchAdminBooking(req, res) {
  const booking = await platformAdminService.updateBooking(req.params.id, req.body);
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
}

export async function exportAdminBookingsCsv(_req, res) {
  const rows = await platformAdminService.exportBookingsCsv();
  const csv = bookingsToCsv(rows);
  if (!csv.ok) throw new AppError(csv.error, 500);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
  res.send(csv.value);
}

export async function getAdminCalendar(req, res) {
  const month = trimString(req.query.month);
  const events = await platformAdminService.getCalendar(month);
  res.json({ success: true, data: events });
}

export async function patchAdminEnrollmentFull(req, res) {
  const enrollment = await platformAdminService.updateEnrollment(req.params.id, req.body);
  if (!enrollment) throw new AppError('Enrollment not found', 404);
  res.json({ success: true, data: enrollment });
}

export async function listAdminContent(req, res) {
  const rows = await platformAdminService.listTable(req.params.table);
  res.json({ success: true, data: rows });
}

export async function saveAdminContent(req, res) {
  const row = await platformAdminService.saveRecord(req.params.table, req.body, req.params.id);
  res.json({ success: true, data: row });
}

export async function createAdminContent(req, res) {
  const row = await platformAdminService.saveRecord(req.params.table, req.body);
  res.status(201).json({ success: true, data: row });
}

export async function updateBusinessSettings(req, res) {
  const value = await platformAdminService.upsertSiteBusinessInfo(req.body);
  res.json({ success: true, data: value });
}

export async function uploadGalleryImage(req, res) {
  if (!req.file) throw new AppError('Image file is required', 400);
  const row = await platformAdminService.createGalleryUpload({
    title: req.body.title || req.file.originalname,
    caption: req.body.caption,
    category: req.body.category,
    image_url: `/uploads/${req.file.filename}`,
    sort_order: Number.parseInt(req.body.sort_order || '0', 10),
  });
  res.status(201).json({ success: true, data: row });
}
