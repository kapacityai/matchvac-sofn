-- ============================================================
-- ServiceConnect Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL CHECK (role IN ('customer', 'tech', 'admin')),
  avatar        TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── CUSTOMER PROFILES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  street          TEXT,
  apt             TEXT,
  city            TEXT,
  state           TEXT DEFAULT 'MD',
  zip             TEXT,
  notif_sms       BOOLEAN DEFAULT TRUE,
  notif_email     BOOLEAN DEFAULT TRUE,
  notif_push      BOOLEAN DEFAULT FALSE,
  premier_member  BOOLEAN DEFAULT FALSE,
  premier_expires TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── TECH PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tech_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  license_number       TEXT,
  license_state        TEXT DEFAULT 'MD',
  license_verified     BOOLEAN DEFAULT FALSE,
  epa608_certified     BOOLEAN DEFAULT FALSE,
  subscription_tier    TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  stripe_account_id    TEXT,
  stripe_onboarded     BOOLEAN DEFAULT FALSE,
  platform_fee_rate    DECIMAL DEFAULT 0.15,
  active               BOOLEAN DEFAULT TRUE,
  rating               DECIMAL DEFAULT 5.0,
  jobs_completed       INTEGER DEFAULT 0,
  gps_lat              DECIMAL,
  gps_lng              DECIMAL,
  last_location_update TIMESTAMPTZ,
  acceptance_rate      DECIMAL DEFAULT 1.0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── SERVICES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  emergency     BOOLEAN DEFAULT FALSE,
  price_basic   DECIMAL NOT NULL,
  price_standard DECIMAL NOT NULL,
  price_premium DECIMAL NOT NULL,
  description   TEXT,
  active        BOOLEAN DEFAULT TRUE
);

-- ── JOBS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id      UUID REFERENCES users(id),
  tech_id          UUID REFERENCES users(id),
  service_id       UUID REFERENCES services(id),
  service_name     TEXT NOT NULL,
  tier             TEXT NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  price            DECIMAL NOT NULL,
  platform_fee     DECIMAL,
  tech_payout      DECIMAL,
  address_street   TEXT NOT NULL,
  address_city     TEXT NOT NULL,
  address_state    TEXT DEFAULT 'MD',
  address_zip      TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'assigned', 'in_progress', 'tech_complete', 'customer_confirmed', 'completed', 'cancelled', 'disputed')),
  payment_intent_id TEXT,
  payment_status   TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'held', 'released', 'refunded')),
  scheduled_at     TIMESTAMPTZ,
  assigned_at      TIMESTAMPTZ,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  customer_rating  INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
  customer_review  TEXT,
  notes            TEXT,
  urgent           BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── PAYMENTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id                UUID REFERENCES jobs(id),
  customer_id           UUID REFERENCES users(id),
  tech_id               UUID REFERENCES users(id),
  stripe_payment_intent TEXT,
  stripe_transfer_id    TEXT,
  amount                DECIMAL NOT NULL,
  platform_fee          DECIMAL NOT NULL,
  tech_payout           DECIMAL NOT NULL,
  currency              TEXT DEFAULT 'usd',
  status                TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded', 'failed')),
  payout_status         TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'initiated', 'paid', 'failed')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  released_at           TIMESTAMPTZ
);

-- ── TECH SUBSCRIPTIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tech_subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tech_id               UUID REFERENCES users(id),
  tier                  TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'elite')),
  stripe_subscription_id TEXT,
  price_monthly         DECIMAL DEFAULT 0,
  platform_fee_rate     DECIMAL NOT NULL,
  status                TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start  TIMESTAMPTZ DEFAULT NOW(),
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── PREMIER MEMBERSHIPS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS premier_memberships (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id           UUID REFERENCES users(id),
  stripe_subscription_id TEXT,
  status                TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  price_annual          DECIMAL DEFAULT 99,
  started_at            TIMESTAMPTZ DEFAULT NOW(),
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── GPS FLAGS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gps_flags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tech_id     UUID REFERENCES users(id),
  job_id      UUID REFERENCES jobs(id),
  address     TEXT NOT NULL,
  lat         DECIMAL,
  lng         DECIMAL,
  flagged_at  TIMESTAMPTZ DEFAULT NOW(),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'cleared', 'actioned')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id)
);

-- ── CONTRACTOR APPLICATIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS contractor_applications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name     TEXT NOT NULL,
  contact_name     TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  tier             TEXT CHECK (tier IN ('standard', 'preferred', 'elite')),
  service_areas    TEXT[],
  tech_count       INTEGER,
  license_number   TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id),
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  data       JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── AD SLOTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_slots (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot       TEXT NOT NULL,
  partner    TEXT NOT NULL,
  headline   TEXT NOT NULL,
  sub_text   TEXT,
  cta        TEXT,
  active     BOOLEAN DEFAULT TRUE,
  impressions INTEGER DEFAULT 0,
  clicks      INTEGER DEFAULT 0,
  cpm         DECIMAL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_tech ON jobs(tech_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_payments_job ON payments(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_gps_flags_tech ON gps_flags(tech_id, status);

-- ── SEED SERVICES ─────────────────────────────────────────────
INSERT INTO services (name, category, emergency, price_basic, price_standard, price_premium, description) VALUES
  ('Furnace Repair', 'Heating', false, 149, 249, 399, 'Diagnose and repair furnace issues'),
  ('Furnace Replacement', 'Heating', false, 1499, 2499, 3999, 'Full furnace replacement & installation'),
  ('Water Heater Repair', 'Plumbing', false, 129, 199, 299, 'Fix water heater problems fast'),
  ('Water Heater Replacement', 'Plumbing', false, 899, 1499, 2299, 'Replace old water heater'),
  ('Outdoor Condenser Repair', 'Cooling', false, 179, 279, 449, 'Condenser unit diagnostics & repair'),
  ('Outdoor Condenser Replacement', 'Cooling', false, 1999, 3499, 4999, 'Full condenser replacement'),
  ('A/C Tune-Up', 'Cooling', false, 89, 149, 229, 'Complete A/C maintenance & tune-up'),
  ('Duct Cleaning', 'Air Quality', false, 199, 349, 549, 'Full duct system cleaning'),
  ('Thermostat Installation', 'Controls', false, 99, 149, 249, 'Smart or standard thermostat install'),
  ('Air Quality Assessment', 'Air Quality', false, 79, 129, 199, 'Comprehensive indoor air quality test'),
  ('Annual HVAC Inspection', 'Maintenance', false, 99, 149, 229, 'Complete system health inspection'),
  ('No Heat Emergency', 'Emergency', true, 349, 499, 699, 'Priority dispatch — no heat emergency'),
  ('No A/C Emergency', 'Emergency', true, 349, 499, 699, 'Priority dispatch — no A/C emergency')
ON CONFLICT DO NOTHING;
