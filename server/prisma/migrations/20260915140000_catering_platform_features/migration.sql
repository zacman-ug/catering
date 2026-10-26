-- Menu packages, content, operations fields

CREATE TABLE IF NOT EXISTS menu_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  sample_dishes JSONB NOT NULL DEFAULT '[]',
  price_min_ugx INT,
  price_max_ugx INT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url VARCHAR(500),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100),
  guest_count INT,
  location VARCHAR(255),
  summary TEXT NOT NULL,
  content TEXT,
  before_image_url VARCHAR(500),
  after_image_url VARCHAR(500),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  item TEXT NOT NULL,
  client_provides BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS staff_count INT,
  ADD COLUMN IF NOT EXISTS quoted_amount_ugx INT,
  ADD COLUMN IF NOT EXISTS deposit_amount_ugx INT,
  ADD COLUMN IF NOT EXISTS deposit_status VARCHAR(50) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS invoice_status VARCHAR(50) DEFAULT 'pending';

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS amount_paid_ugx INT DEFAULT 0;

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS source VARCHAR(100),
  ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

CREATE INDEX IF NOT EXISTS idx_menu_packages_active ON menu_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(is_featured);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
