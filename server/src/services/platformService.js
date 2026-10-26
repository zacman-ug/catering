import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseUuidParam } from '../domain/listQuery.js';
import { normalizeStringArray, trimString, isNonEmptyString } from '../utils/guards.js';

function mapDbError(err) {
  if (!err || typeof err !== 'object') return new AppError('Database error', 500);
  if (['ECONNREFUSED', 'ENOTFOUND', '28P01', '3D000', '42P01'].includes(err.code)) {
    return new AppError('Database is unavailable or not initialized', 503);
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

function normalizeMenuRow(row) {
  return { ...row, sample_dishes: normalizeStringArray(row.sample_dishes) };
}

function slugify(value) {
  return trimString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const platformPublicService = {
  async getMenuPackages() {
    const result = await runQuery(
      'SELECT * FROM menu_packages WHERE is_active = TRUE ORDER BY sort_order ASC, title ASC'
    );
    return result.rows.map(normalizeMenuRow);
  },

  async getChecklist() {
    const result = await runQuery(
      'SELECT * FROM event_checklist_items WHERE is_active = TRUE ORDER BY category ASC, sort_order ASC'
    );
    return result.rows;
  },

  async getBlogPosts() {
    const result = await runQuery(
      `SELECT id, title, slug, excerpt, cover_image_url, published_at
       FROM blog_posts WHERE is_published = TRUE
       ORDER BY published_at DESC NULLS LAST, created_at DESC`
    );
    return result.rows;
  },

  async getBlogPostBySlug(slug) {
    const value = trimString(slug);
    if (!value) throw new AppError('Invalid slug', 400);
    const result = await runQuery(
      `SELECT * FROM blog_posts WHERE slug = $1 AND is_published = TRUE LIMIT 1`,
      [value]
    );
    return result.rows[0] || null;
  },

  async getCaseStudies() {
    const result = await runQuery(
      `SELECT * FROM case_studies ORDER BY is_featured DESC, created_at DESC`
    );
    return result.rows;
  },

  async getCoursesWithAvailability() {
    const result = await runQuery(
      `SELECT c.*,
        COALESCE(enrolled.count, 0)::INT AS enrolled_count,
        GREATEST(COALESCE(c.max_students, 0) - COALESCE(enrolled.count, 0), 0)::INT AS seats_remaining
       FROM courses c
       LEFT JOIN (
         SELECT course_id, COUNT(*) AS count
         FROM enrollments
         WHERE status IN ('pending', 'confirmed')
         GROUP BY course_id
       ) enrolled ON enrolled.course_id = c.id
       WHERE c.is_active = TRUE
       ORDER BY c.created_at DESC`
    );
    return result.rows;
  },
};

export const platformAdminService = {
  async getBookingById(id) {
    const parsed = parseUuidParam(id);
    if (!parsed.ok) throw new AppError(parsed.error, 400);
    const result = await runQuery('SELECT * FROM bookings WHERE id = $1', [parsed.value]);
    return result.rows[0] || null;
  },

  async updateBooking(id, body) {
    const parsed = parseUuidParam(id);
    if (!parsed.ok) throw new AppError(parsed.error, 400);
    if (!body || typeof body !== 'object') throw new AppError('Invalid payload', 400);

    const result = await runQuery(
      `UPDATE bookings SET
        status = COALESCE($1, status),
        staff_count = COALESCE($2, staff_count),
        quoted_amount_ugx = COALESCE($3, quoted_amount_ugx),
        deposit_amount_ugx = COALESCE($4, deposit_amount_ugx),
        deposit_status = COALESCE($5, deposit_status),
        invoice_status = COALESCE($6, invoice_status),
        updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        body.status || null,
        body.staffCount ?? body.staff_count ?? null,
        body.quotedAmountUgx ?? body.quoted_amount_ugx ?? null,
        body.depositAmountUgx ?? body.deposit_amount_ugx ?? null,
        body.depositStatus ?? body.deposit_status ?? null,
        body.invoiceStatus ?? body.invoice_status ?? null,
        parsed.value,
      ]
    );
    return result.rows[0] || null;
  },

  async exportBookingsCsv() {
    const result = await runQuery('SELECT * FROM bookings ORDER BY created_at DESC');
    return result.rows;
  },

  async getCalendar(month) {
    const value = trimString(month);
    if (!/^\d{4}-\d{2}$/.test(value)) throw new AppError('Month must be YYYY-MM', 400);
    const result = await runQuery(
      `SELECT id, full_name, event_type, event_date, guest_count, venue, status
       FROM bookings
       WHERE event_date IS NOT NULL
         AND to_char(event_date, 'YYYY-MM') = $1
       ORDER BY event_date ASC`,
      [value]
    );
    return result.rows;
  },

  async updateEnrollment(id, body) {
    const parsed = parseUuidParam(id);
    if (!parsed.ok) throw new AppError(parsed.error, 400);
    if (!body || typeof body !== 'object') throw new AppError('Invalid payload', 400);

    const result = await runQuery(
      `UPDATE enrollments SET
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        amount_paid_ugx = COALESCE($3, amount_paid_ugx),
        updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [
        body.status || null,
        body.paymentStatus ?? body.payment_status ?? null,
        body.amountPaidUgx ?? body.amount_paid_ugx ?? null,
        parsed.value,
      ]
    );
    return result.rows[0] || null;
  },

  async upsertSiteBusinessInfo(value) {
    if (!value || typeof value !== 'object') throw new AppError('Invalid business info', 400);
    await runQuery(
      `INSERT INTO site_settings (key, value) VALUES ('business_info', $1::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [JSON.stringify(value)]
    );
    return value;
  },

  async listTable(table, orderBy = 'created_at DESC') {
    const allowed = new Set(['services', 'courses', 'gallery', 'testimonials', 'menu_packages', 'blog_posts', 'case_studies', 'event_checklist_items']);
    if (!allowed.has(table)) throw new AppError('Invalid table', 400);
    const result = await runQuery(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    return result.rows;
  },

  async saveRecord(table, payload, id) {
    const allowed = new Set(['services', 'courses', 'gallery', 'testimonials', 'menu_packages', 'blog_posts', 'case_studies', 'event_checklist_items']);
    if (!allowed.has(table)) throw new AppError('Invalid table', 400);
    if (!payload || typeof payload !== 'object') throw new AppError('Invalid payload', 400);

    if (table === 'services') {
      const title = trimString(payload.title);
      if (!isNonEmptyString(title)) throw new AppError('Title is required', 400);
      const slug = trimString(payload.slug) || slugify(title);
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE services SET title=$1, slug=$2, description=$3, icon=$4, features=$5::jsonb,
           sort_order=$6, is_active=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
          [title, slug, trimString(payload.description), trimString(payload.icon) || null,
            JSON.stringify(payload.features || []), payload.sort_order || 0, payload.is_active !== false, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO services (title, slug, description, icon, features, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7) RETURNING *`,
        [title, slug, trimString(payload.description), trimString(payload.icon) || null,
          JSON.stringify(payload.features || []), payload.sort_order || 0, payload.is_active !== false]
      );
      return result.rows[0];
    }

    if (table === 'courses') {
      const title = trimString(payload.title);
      if (!isNonEmptyString(title)) throw new AppError('Title is required', 400);
      const slug = trimString(payload.slug) || slugify(title);
      const fields = [title, slug, trimString(payload.description), trimString(payload.duration) || null,
        trimString(payload.level) || 'beginner', payload.price_ugx ?? null, payload.max_students ?? 20,
        payload.start_date || null, trimString(payload.image_url) || null, payload.is_active !== false];
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE courses SET title=$1, slug=$2, description=$3, duration=$4, level=$5, price_ugx=$6,
           max_students=$7, start_date=$8, image_url=$9, is_active=$10, updated_at=NOW()
           WHERE id=$11 RETURNING *`,
          [...fields, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO courses (title, slug, description, duration, level, price_ugx, max_students, start_date, image_url, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        fields
      );
      return result.rows[0];
    }

    if (table === 'gallery') {
      const title = trimString(payload.title);
      const imageUrl = trimString(payload.image_url);
      if (!isNonEmptyString(title) || !isNonEmptyString(imageUrl)) {
        throw new AppError('Title and image_url are required', 400);
      }
      const fields = [title, trimString(payload.caption) || null, imageUrl,
        trimString(payload.category) || 'events', payload.sort_order || 0, payload.is_active !== false];
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE gallery SET title=$1, caption=$2, image_url=$3, category=$4, sort_order=$5, is_active=$6
           WHERE id=$7 RETURNING *`,
          [...fields, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO gallery (title, caption, image_url, category, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        fields
      );
      return result.rows[0];
    }

    if (table === 'menu_packages') {
      const title = trimString(payload.title);
      if (!isNonEmptyString(title)) throw new AppError('Title is required', 400);
      const slug = trimString(payload.slug) || slugify(title);
      const fields = [
        trimString(payload.event_type) || 'Other', title, slug, trimString(payload.description),
        JSON.stringify(payload.sample_dishes || []), payload.price_min_ugx ?? null, payload.price_max_ugx ?? null,
        payload.sort_order || 0, payload.is_active !== false,
      ];
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE menu_packages SET event_type=$1, title=$2, slug=$3, description=$4, sample_dishes=$5::jsonb,
           price_min_ugx=$6, price_max_ugx=$7, sort_order=$8, is_active=$9, updated_at=NOW()
           WHERE id=$10 RETURNING *`,
          [...fields, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO menu_packages (event_type, title, slug, description, sample_dishes, price_min_ugx, price_max_ugx, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9) RETURNING *`,
        fields
      );
      return result.rows[0];
    }

    if (table === 'event_checklist_items') {
      const category = trimString(payload.category) || 'General';
      const item = trimString(payload.item);
      if (!isNonEmptyString(item)) throw new AppError('Checklist item text is required', 400);
      const fields = [
        category,
        item,
        payload.client_provides !== false && payload.clientProvides !== false,
        payload.sort_order || 0,
        payload.is_active !== false,
      ];
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE event_checklist_items SET category=$1, item=$2, client_provides=$3, sort_order=$4, is_active=$5
           WHERE id=$6 RETURNING *`,
          [...fields, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO event_checklist_items (category, item, client_provides, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        fields
      );
      return result.rows[0];
    }

    if (table === 'testimonials') {
      const clientName = trimString(payload.client_name);
      const content = trimString(payload.content);
      if (!isNonEmptyString(clientName) || !isNonEmptyString(content)) {
        throw new AppError('Client name and content are required', 400);
      }
      const fields = [
        clientName,
        trimString(payload.event_type) || null,
        content,
        payload.rating ?? 5,
        payload.is_featured === true,
        trimString(payload.source) || null,
        trimString(payload.external_url) || null,
      ];
      if (id) {
        const p = parseUuidParam(id);
        if (!p.ok) throw new AppError(p.error, 400);
        const result = await runQuery(
          `UPDATE testimonials SET client_name=$1, event_type=$2, content=$3, rating=$4, is_featured=$5, source=$6, external_url=$7
           WHERE id=$8 RETURNING *`,
          [...fields, p.value]
        );
        return result.rows[0];
      }
      const result = await runQuery(
        `INSERT INTO testimonials (client_name, event_type, content, rating, is_featured, source, external_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        fields
      );
      return result.rows[0];
    }

    throw new AppError('Save not implemented for table', 400);
  },

  async createGalleryUpload(record) {
    if (!record || typeof record !== 'object') throw new AppError('Invalid gallery record', 400);
    const title = trimString(record.title);
    const imageUrl = trimString(record.image_url);
    if (!isNonEmptyString(title) || !isNonEmptyString(imageUrl)) {
      throw new AppError('Title and image are required', 400);
    }
    const result = await runQuery(
      `INSERT INTO gallery (title, caption, image_url, category, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,TRUE) RETURNING *`,
      [
        title,
        trimString(record.caption) || null,
        imageUrl,
        trimString(record.category) || 'events',
        record.sort_order || 0,
      ]
    );
    return result.rows[0];
  },
};
