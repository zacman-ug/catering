import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseBookingInput } from '../domain/bookingInput.js';
import { parseContactInput } from '../domain/contactInput.js';
import { parseEnrollmentInput } from '../domain/enrollmentInput.js';
import {
  parseBookingStatusUpdate,
  parseEnrollmentStatusUpdate,
  parseListQuery,
  parseUuidParam,
  BOOKING_STATUSES,
  ENROLLMENT_STATUSES,
} from '../domain/listQuery.js';
import { normalizeBusinessInfo } from '../domain/businessInfo.js';
import { normalizeStringArray } from '../utils/guards.js';

function mapDbError(err) {
  if (!err || typeof err !== 'object') {
    return new AppError('Database error', 500);
  }
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return new AppError('Database is unavailable. Please try again later.', 503);
  }
  if (err.code === '28P01') {
    return new AppError('Database authentication failed', 503);
  }
  if (err.code === '3D000' || err.code === '42P01') {
    return new AppError('Database is not initialized. Run migrations.', 503);
  }
  return new AppError('Database error', 500);
}

async function runQuery(text, params) {
  try {
    return await query(text, params);
  } catch (err) {
    throw mapDbError(err);
  }
}

function normalizeFeatures(features) {
  if (Array.isArray(features)) {
    return normalizeStringArray(features);
  }
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? normalizeStringArray(parsed) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeServiceRow(row) {
  if (!row || typeof row !== 'object') return row;
  return {
    ...row,
    features: normalizeFeatures(row.features),
  };
}

export const bookingService = {
  async create(raw) {
    const parsed = parseBookingInput(raw);
    if (!parsed.ok) {
      throw new AppError(parsed.error, 400);
    }

    const data = parsed.value;
    const result = await runQuery(
      `INSERT INTO bookings (
        full_name, email, phone, event_type, event_date, guest_count, venue, message,
        service_style, dietary_requirements, budget_range
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.fullName,
        data.email,
        data.phone,
        data.eventType,
        data.eventDate,
        data.guestCount,
        data.venue,
        data.message,
        data.serviceStyle,
        data.dietaryRequirements,
        data.budgetRange,
      ]
    );
    return result.rows[0];
  },

  async findAll(rawQuery) {
    const parsed = parseListQuery(rawQuery, { allowedStatuses: BOOKING_STATUSES });
    if (!parsed.ok) throw new AppError(parsed.error, 400);

    const { status, limit, offset } = parsed.value;
    let sql = 'SELECT * FROM bookings';
    const params = [];
    if (status) {
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await runQuery(sql, params);
    return result.rows;
  },

  async updateStatus(id, rawBody) {
    const idParsed = parseUuidParam(id);
    if (!idParsed.ok) throw new AppError(idParsed.error, 400);

    const statusParsed = parseBookingStatusUpdate(rawBody);
    if (!statusParsed.ok) throw new AppError(statusParsed.error, 400);

    const result = await runQuery(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [statusParsed.value.status, idParsed.value]
    );
    return result.rows[0] || null;
  },
};

export const enrollmentService = {
  async create(raw) {
    const parsed = parseEnrollmentInput(raw);
    if (!parsed.ok) throw new AppError(parsed.error, 400);

    const data = parsed.value;
    const result = await runQuery(
      `INSERT INTO enrollments (full_name, email, phone, course_id, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.fullName, data.email, data.phone, data.courseId, data.message]
    );
    return result.rows[0];
  },

  async findAll(rawQuery) {
    const parsed = parseListQuery(rawQuery, { allowedStatuses: ENROLLMENT_STATUSES });
    if (!parsed.ok) throw new AppError(parsed.error, 400);

    const { status, limit, offset } = parsed.value;
    let sql = `SELECT e.*, c.title AS course_title FROM enrollments e
               LEFT JOIN courses c ON c.id = e.course_id`;
    const params = [];
    if (status) {
      params.push(status);
      sql += ` WHERE e.status = $${params.length}`;
    }
    sql += ` ORDER BY e.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await runQuery(sql, params);
    return result.rows;
  },

  async updateStatus(id, rawBody) {
    const idParsed = parseUuidParam(id);
    if (!idParsed.ok) throw new AppError(idParsed.error, 400);

    const statusParsed = parseEnrollmentStatusUpdate(rawBody);
    if (!statusParsed.ok) throw new AppError(statusParsed.error, 400);

    const result = await runQuery(
      `UPDATE enrollments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [statusParsed.value.status, idParsed.value]
    );
    return result.rows[0] || null;
  },
};

export const contactService = {
  async create(raw) {
    const parsed = parseContactInput(raw);
    if (!parsed.ok) throw new AppError(parsed.error, 400);

    const data = parsed.value;
    const result = await runQuery(
      `INSERT INTO contact_messages (full_name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.fullName, data.email, data.phone, data.subject, data.message]
    );
    return result.rows[0];
  },

  async findAll(rawQuery) {
    const parsed = parseListQuery(rawQuery);
    if (!parsed.ok) throw new AppError(parsed.error, 400);

    const { limit, offset } = parsed.value;
    const result = await runQuery(
      `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async markRead(id) {
    const idParsed = parseUuidParam(id);
    if (!idParsed.ok) throw new AppError(idParsed.error, 400);

    const result = await runQuery(
      `UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [idParsed.value]
    );
    return result.rows[0] || null;
  },
};

export const contentService = {
  async getServices() {
    const result = await runQuery(
      'SELECT * FROM services WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    return result.rows.map(normalizeServiceRow);
  },

  async getCourses() {
    const result = await runQuery(
      'SELECT * FROM courses WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async getGallery(rawQuery) {
    const category = rawQuery?.category;
    if (category !== undefined && category !== null && typeof category !== 'string') {
      throw new AppError('Invalid gallery category', 400);
    }

    let sql = 'SELECT * FROM gallery WHERE is_active = TRUE';
    const params = [];
    const trimmed = typeof category === 'string' ? category.trim() : '';
    if (trimmed) {
      params.push(trimmed);
      sql += ` AND category = $${params.length}`;
    }
    sql += ' ORDER BY sort_order ASC, created_at DESC';
    const result = await runQuery(sql, params);
    return result.rows;
  },

  async getTestimonials(rawQuery) {
    const featuredOnly = rawQuery?.featuredOnly === true || rawQuery?.featured === 'true';
    let sql = 'SELECT * FROM testimonials';
    if (featuredOnly) sql += ' WHERE is_featured = TRUE';
    sql += ' ORDER BY created_at DESC';
    const result = await runQuery(sql);
    return result.rows;
  },

  async getBusinessInfo() {
    const result = await runQuery(
      "SELECT value FROM site_settings WHERE key = 'business_info'"
    );
    const raw = result.rows[0]?.value;
    return normalizeBusinessInfo(raw);
  },
};
