-- ============================================================
-- MatcHvac Seed Data
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Creates sample users, profiles, jobs, payments & subscriptions
-- Uses subqueries to handle existing data gracefully
-- ============================================================

-- ── SAMPLE USERS (passwords use bcrypt) ─────────────────────
INSERT INTO users (email, password_hash, name, phone, role, email_verified) VALUES
  ('tech@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Marcus Rivera',  '240-555-0101', 'tech',     TRUE),
  ('deja@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Deja Williams',  '240-555-0102', 'tech',     TRUE),
  ('alex@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Alex Tran',      '240-555-0103', 'tech',     TRUE),
  ('jordan@matchvac.com',  '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6X.', 'Jordan Smith',   '301-555-0201', 'customer', TRUE),
  ('sarah@matchvac.com',   '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6X.', 'Sarah K.',       '301-555-0202', 'customer', TRUE),
  ('robert@matchvac.com',  '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6X.', 'Robert M.',      '301-555-0203', 'customer', TRUE),
  ('diana@matchvac.com',   '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6X.', 'Diana P.',       '301-555-0204', 'customer', TRUE)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email_verified = TRUE;

-- ── TECH PROFILES ────────────────────────────────────────────
INSERT INTO tech_profiles (user_id, phone, subscription_tier, platform_fee_rate, active, rating, jobs_completed, service_zips)
SELECT id, '240-555-0101', 'elite', 0.08, TRUE, 4.9, 247, ARRAY['20901','20902','20903','20904','20905','20906','20907','20908','20909','20910']
FROM users WHERE email = 'tech@matchvac.com'
ON CONFLICT (user_id) DO UPDATE SET
  subscription_tier = EXCLUDED.subscription_tier,
  platform_fee_rate = EXCLUDED.platform_fee_rate,
  active = TRUE;

INSERT INTO tech_profiles (user_id, phone, subscription_tier, platform_fee_rate, active, rating, jobs_completed, service_zips)
SELECT id, '240-555-0102', 'pro', 0.11, TRUE, 4.8, 189, ARRAY['22201','22202','22203','22204','22205','22206','22207','22209']
FROM users WHERE email = 'deja@matchvac.com'
ON CONFLICT (user_id) DO UPDATE SET
  subscription_tier = EXCLUDED.subscription_tier,
  platform_fee_rate = EXCLUDED.platform_fee_rate,
  active = TRUE;

INSERT INTO tech_profiles (user_id, phone, subscription_tier, platform_fee_rate, active, rating, jobs_completed, service_zips)
SELECT id, '240-555-0103', 'free', 0.15, TRUE, 4.7, 0, ARRAY['20814','20815','20816','20817']
FROM users WHERE email = 'alex@matchvac.com'
ON CONFLICT (user_id) DO UPDATE SET
  subscription_tier = EXCLUDED.subscription_tier,
  platform_fee_rate = EXCLUDED.platform_fee_rate,
  active = TRUE;

-- ── CUSTOMER PROFILES ────────────────────────────────────────
INSERT INTO customer_profiles (user_id, city, state, zip)
SELECT id, 'Washington', 'DC', '20001' FROM users WHERE email = 'jordan@matchvac.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customer_profiles (user_id, city, state, zip)
SELECT id, 'Bethesda', 'MD', '20814' FROM users WHERE email = 'sarah@matchvac.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customer_profiles (user_id, city, state, zip)
SELECT id, 'Arlington', 'VA', '22201' FROM users WHERE email = 'robert@matchvac.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customer_profiles (user_id, city, state, zip)
SELECT id, 'Silver Spring', 'MD', '20901' FROM users WHERE email = 'diana@matchvac.com'
ON CONFLICT (user_id) DO NOTHING;

-- ── TECH SUBSCRIPTIONS ───────────────────────────────────────
INSERT INTO tech_subscriptions (tech_id, tier, price_monthly, platform_fee_rate, status, current_period_start, current_period_end)
SELECT id, 'elite', 99, 0.08, 'active', '2026-06-01', '2026-07-01'
FROM users WHERE email = 'tech@matchvac.com'
ON CONFLICT DO NOTHING;

INSERT INTO tech_subscriptions (tech_id, tier, price_monthly, platform_fee_rate, status, current_period_start, current_period_end)
SELECT id, 'pro', 49, 0.11, 'active', '2026-06-01', '2026-07-01'
FROM users WHERE email = 'deja@matchvac.com'
ON CONFLICT DO NOTHING;

INSERT INTO tech_subscriptions (tech_id, tier, price_monthly, platform_fee_rate, status, current_period_start, current_period_end)
SELECT id, 'free', 0, 0.15, 'active', '2026-06-01', '2026-07-01'
FROM users WHERE email = 'alex@matchvac.com'
ON CONFLICT DO NOTHING;

-- ── JOBS ─────────────────────────────────────────────────────
-- Helper: use CTEs to map emails to IDs
WITH
  marcus  AS (SELECT id FROM users WHERE email = 'tech@matchvac.com'),
  sarah   AS (SELECT id FROM users WHERE email = 'sarah@matchvac.com'),
  robert  AS (SELECT id FROM users WHERE email = 'robert@matchvac.com'),
  diana   AS (SELECT id FROM users WHERE email = 'diana@matchvac.com'),
  jordan  AS (SELECT id FROM users WHERE email = 'jordan@matchvac.com')
INSERT INTO jobs (customer_id, tech_id, service_name, tier, price, platform_fee, tech_payout, address_street, address_city, address_state, address_zip, status, payment_status, scheduled_at, assigned_at, started_at, completed_at, customer_rating, created_at)
SELECT sarah.id, marcus.id, 'Furnace Repair', 'standard', 249, 37.35, 211.65, '4821 River Rd', 'Bethesda', 'MD', '20814', 'completed', 'released', '2026-05-05T09:00:00Z'::timestamptz, '2026-05-05T08:30:00Z'::timestamptz, '2026-05-05T09:15:00Z'::timestamptz, '2026-05-05T11:30:00Z'::timestamptz, 5, '2026-05-04T10:00:00Z'::timestamptz FROM marcus, sarah
UNION ALL
SELECT robert.id, marcus.id, 'A/C Tune-Up', 'basic', 89, 13.35, 75.65, '1230 Columbia Pike', 'Arlington', 'VA', '22201', 'completed', 'released', '2026-05-04T10:00:00Z'::timestamptz, '2026-05-04T09:30:00Z'::timestamptz, '2026-05-04T10:15:00Z'::timestamptz, '2026-05-04T11:00:00Z'::timestamptz, 5, '2026-05-03T10:00:00Z'::timestamptz FROM marcus, robert
UNION ALL
SELECT diana.id, marcus.id, 'No Heat Emergency', 'premium', 699, 104.85, 594.15, '775 Georgia Ave', 'Silver Spring', 'MD', '20901', 'completed', 'released', '2026-05-03T18:00:00Z'::timestamptz, '2026-05-03T17:45:00Z'::timestamptz, '2026-05-03T18:10:00Z'::timestamptz, '2026-05-03T20:30:00Z'::timestamptz, 4, '2026-05-03T17:30:00Z'::timestamptz FROM marcus, diana
UNION ALL
SELECT sarah.id, marcus.id, 'Thermostat Installation', 'standard', 149, 22.35, 126.65, '3310 Wisconsin Ave NW', 'Washington', 'DC', '20001', 'in_progress', 'held', '2026-05-07T09:00:00Z'::timestamptz, '2026-05-07T08:30:00Z'::timestamptz, '2026-05-07T09:15:00Z'::timestamptz, NULL, NULL, '2026-05-06T10:00:00Z'::timestamptz FROM marcus, sarah
UNION ALL
SELECT jordan.id, NULL, 'Duct Cleaning', 'premium', 549, 82.35, 466.65, '982 Rockville Pike', 'Rockville', 'MD', '20852', 'available', 'unpaid', '2026-05-07T13:00:00Z'::timestamptz, NULL, NULL, NULL, NULL, '2026-05-06T11:00:00Z'::timestamptz FROM jordan
UNION ALL
SELECT robert.id, NULL, 'Water Heater Repair', 'standard', 199, 29.85, 169.15, '441 Duke St', 'Alexandria', 'VA', '22314', 'available', 'unpaid', '2026-05-08T09:00:00Z'::timestamptz, NULL, NULL, NULL, NULL, '2026-05-07T10:00:00Z'::timestamptz FROM robert
UNION ALL
SELECT diana.id, NULL, 'No A/C Emergency', 'standard', 499, 74.85, 424.15, '660 University Blvd', 'Hyattsville', 'MD', '20783', 'available', 'unpaid', NOW(), NULL, NULL, NULL, NULL, NOW() FROM diana
ON CONFLICT DO NOTHING;

-- ── PAYMENTS ─────────────────────────────────────────────────
WITH
  marcus  AS (SELECT id FROM users WHERE email = 'tech@matchvac.com'),
  sarah   AS (SELECT id FROM users WHERE email = 'sarah@matchvac.com'),
  robert  AS (SELECT id FROM users WHERE email = 'robert@matchvac.com'),
  diana   AS (SELECT id FROM users WHERE email = 'diana@matchvac.com'),
  job1    AS (SELECT id FROM jobs WHERE service_name = 'Furnace Repair' AND status = 'completed' LIMIT 1),
  job2    AS (SELECT id FROM jobs WHERE service_name = 'A/C Tune-Up' AND status = 'completed' LIMIT 1),
  job3    AS (SELECT id FROM jobs WHERE service_name = 'No Heat Emergency' AND status = 'completed' LIMIT 1),
  job4    AS (SELECT id FROM jobs WHERE service_name = 'Thermostat Installation' LIMIT 1)
INSERT INTO payments (job_id, customer_id, tech_id, amount, platform_fee, tech_payout, status, payout_status, created_at, released_at)
SELECT job1.id, sarah.id, marcus.id, 249, 37.35, 211.65, 'released', 'paid', '2026-05-05T12:00:00Z'::timestamptz, '2026-05-07T12:00:00Z'::timestamptz FROM marcus, sarah, job1
UNION ALL
SELECT job2.id, robert.id, marcus.id, 89, 13.35, 75.65, 'released', 'paid', '2026-05-04T11:30:00Z'::timestamptz, '2026-05-06T11:30:00Z'::timestamptz FROM marcus, robert, job2
UNION ALL
SELECT job3.id, diana.id, marcus.id, 699, 104.85, 594.15, 'released', 'paid', '2026-05-03T21:00:00Z'::timestamptz, '2026-05-05T21:00:00Z'::timestamptz FROM marcus, diana, job3
UNION ALL
SELECT job4.id, sarah.id, marcus.id, 149, 22.35, 126.65, 'held', 'pending', '2026-05-07T09:30:00Z'::timestamptz, NULL FROM marcus, sarah, job4
ON CONFLICT DO NOTHING;

-- ── NOTIFICATIONS ────────────────────────────────────────────
INSERT INTO notifications (user_id, type, title, message)
SELECT id, 'alert', 'New Tech Awaiting Approval', 'Alex Tran has submitted all documents and is awaiting review.'
FROM users WHERE email = 'admin@matchvac.com'
ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, type, title, message)
SELECT id, 'alert', 'Emergency Job Unassigned', 'A "No A/C Emergency" job in Hyattsville, MD has been open for 22 minutes with no tech assigned.'
FROM users WHERE email = 'admin@matchvac.com'
ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, type, title, message)
SELECT id, 'success', 'Tech Document Verified', 'Deja Williams has completed all required document uploads. Account is now fully active.'
FROM users WHERE email = 'admin@matchvac.com'
ON CONFLICT DO NOTHING;