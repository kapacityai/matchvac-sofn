-- ============================================================
-- MatcHvac Seed Data
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Creates sample users, profiles, jobs, payments & subscriptions
-- ============================================================

-- ── SAMPLE USERS (passwords use bcrypt) ─────────────────────
INSERT INTO users (id, email, password_hash, name, phone, role, email_verified) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'tech@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Marcus Rivera',  '240-555-0101', 'tech',     TRUE),
  ('a0000000-0000-0000-0000-000000000002', 'deja@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Deja Williams',  '240-555-0102', 'tech',     TRUE),
  ('a0000000-0000-0000-0000-000000000003', 'alex@matchvac.com',    '$2b$10$wI4g1fNVtbUHwUwxdtckE.noTs3y4/A8Eol.Kj.0z/Hl2ByKF1uDG', 'Alex Tran',      '240-555-0103', 'tech',     TRUE),
  ('a0000000-0000-0000-0000-000000000004', 'jordan@matchvac.com',  '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6uDG', 'Jordan Smith',   '301-555-0201', 'customer', TRUE),
  ('a0000000-0000-0000-0000-000000000005', 'sarah@matchvac.com',   '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6uDG', 'Sarah K.',       '301-555-0202', 'customer', TRUE),
  ('a0000000-0000-0000-0000-000000000006', 'robert@matchvac.com',  '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6uDG', 'Robert M.',      '301-555-0203', 'customer', TRUE),
  ('a0000000-0000-0000-0000-000000000007', 'diana@matchvac.com',   '$2b$10$wwaNMUQiDL01JbyZWOWuxOJG4b920n0QUxkOP2uvFAjXSdz2KO6uDG', 'Diana P.',       '301-555-0204', 'customer', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ── TECH PROFILES ────────────────────────────────────────────
INSERT INTO tech_profiles (user_id, phone, subscription_tier, platform_fee_rate, active, rating, jobs_completed, service_zips) VALUES
  ('a0000000-0000-0000-0000-000000000001', '240-555-0101', 'elite',  0.08, TRUE, 4.9, 247, ARRAY['20901','20902','20903','20904','20905','20906','20907','20908','20909','20910']),
  ('a0000000-0000-0000-0000-000000000002', '240-555-0102', 'pro',    0.11, TRUE, 4.8, 189, ARRAY['22201','22202','22203','22204','22205','22206','22207','22209']),
  ('a0000000-0000-0000-0000-000000000003', '240-555-0103', 'free',   0.15, TRUE, 4.7, 0,   ARRAY['20814','20815','20816','20817'])
ON CONFLICT (user_id) DO NOTHING;

-- ── CUSTOMER PROFILES ────────────────────────────────────────
INSERT INTO customer_profiles (user_id, city, state, zip) VALUES
  ('a0000000-0000-0000-0000-000000000004', 'Washington', 'DC', '20001'),
  ('a0000000-0000-0000-0000-000000000005', 'Bethesda',   'MD', '20814'),
  ('a0000000-0000-0000-0000-000000000006', 'Arlington',  'VA', '22201'),
  ('a0000000-0000-0000-0000-000000000007', 'Silver Spring', 'MD', '20901')
ON CONFLICT (user_id) DO NOTHING;

-- ── TECH SUBSCRIPTIONS ───────────────────────────────────────
INSERT INTO tech_subscriptions (tech_id, tier, price_monthly, platform_fee_rate, status, current_period_start, current_period_end) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'elite',  99, 0.08, 'active',  '2026-06-01', '2026-07-01'),
  ('a0000000-0000-0000-0000-000000000002', 'pro',    49, 0.11, 'active',  '2026-06-01', '2026-07-01'),
  ('a0000000-0000-0000-0000-000000000003', 'free',   0,  0.15, 'active',  '2026-06-01', '2026-07-01')
ON CONFLICT DO NOTHING;

-- ── JOBS ─────────────────────────────────────────────────────
INSERT INTO jobs (id, customer_id, tech_id, service_name, tier, price, platform_fee, tech_payout, address_street, address_city, address_state, address_zip, status, payment_status, scheduled_at, assigned_at, started_at, completed_at, customer_rating, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'Furnace Repair', 'standard', 249, 37.35, 211.65,
   '4821 River Rd', 'Bethesda', 'MD', '20814',
   'completed', 'released',
   '2026-05-05T09:00:00Z', '2026-05-05T08:30:00Z', '2026-05-05T09:15:00Z', '2026-05-05T11:30:00Z', 5,
   '2026-05-04T10:00:00Z'),

  ('b0000000-0000-0000-0000-000000000002',
   'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
   'A/C Tune-Up', 'basic', 89, 13.35, 75.65,
   '1230 Columbia Pike', 'Arlington', 'VA', '22201',
   'completed', 'released',
   '2026-05-04T10:00:00Z', '2026-05-04T09:30:00Z', '2026-05-04T10:15:00Z', '2026-05-04T11:00:00Z', 5,
   '2026-05-03T10:00:00Z'),

  ('b0000000-0000-0000-0000-000000000003',
   'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
   'No Heat Emergency', 'premium', 699, 104.85, 594.15,
   '775 Georgia Ave', 'Silver Spring', 'MD', '20901',
   'completed', 'released',
   '2026-05-03T18:00:00Z', '2026-05-03T17:45:00Z', '2026-05-03T18:10:00Z', '2026-05-03T20:30:00Z', 4,
   '2026-05-03T17:30:00Z'),

  ('b0000000-0000-0000-0000-000000000004',
   'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'Thermostat Installation', 'standard', 149, 22.35, 126.65,
   '3310 Wisconsin Ave NW', 'Washington', 'DC', '20001',
   'in_progress', 'held',
   '2026-05-07T09:00:00Z', '2026-05-07T08:30:00Z', '2026-05-07T09:15:00Z', NULL, NULL,
   '2026-05-06T10:00:00Z'),

  ('b0000000-0000-0000-0000-000000000005',
   'a0000000-0000-0000-0000-000000000004',
   NULL, 'Duct Cleaning', 'premium', 549, 82.35, 466.65,
   '982 Rockville Pike', 'Rockville', 'MD', '20852',
   'available', 'unpaid',
   '2026-05-07T13:00:00Z', NULL, NULL, NULL, NULL,
   '2026-05-06T11:00:00Z'),

  ('b0000000-0000-0000-0000-000000000006',
   'a0000000-0000-0000-0000-000000000006',
   NULL, 'Water Heater Repair', 'standard', 199, 29.85, 169.15,
   '441 Duke St', 'Alexandria', 'VA', '22314',
   'available', 'unpaid',
   '2026-05-08T09:00:00Z', NULL, NULL, NULL, NULL,
   '2026-05-07T10:00:00Z'),

  ('b0000000-0000-0000-0000-000000000007',
   'a0000000-0000-0000-0000-000000000007',
   NULL, 'No A/C Emergency', 'standard', 499, 74.85, 424.15,
   '660 University Blvd', 'Hyattsville', 'MD', '20783',
   'available', 'unpaid',
   NOW(), NULL, NULL, NULL, NULL, NOW())
ON CONFLICT DO NOTHING;

-- ── PAYMENTS ─────────────────────────────────────────────────
INSERT INTO payments (job_id, customer_id, tech_id, amount, platform_fee, tech_payout, status, payout_status, created_at, released_at) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   249, 37.35, 211.65, 'released', 'paid',
   '2026-05-05T12:00:00Z', '2026-05-07T12:00:00Z'),

  ('b0000000-0000-0000-0000-000000000002',
   'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
   89, 13.35, 75.65, 'released', 'paid',
   '2026-05-04T11:30:00Z', '2026-05-06T11:30:00Z'),

  ('b0000000-0000-0000-0000-000000000003',
   'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
   699, 104.85, 594.15, 'released', 'paid',
   '2026-05-03T21:00:00Z', '2026-05-05T21:00:00Z'),

  ('b0000000-0000-0000-0000-000000000004',
   'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   149, 22.35, 126.65, 'held', 'pending',
   '2026-05-07T09:30:00Z', NULL)
ON CONFLICT DO NOTHING;

-- ── NOTIFICATIONS ────────────────────────────────────────────
INSERT INTO notifications (user_id, type, title, message) VALUES
  ((SELECT id FROM users WHERE email = 'admin@matchvac.com'), 'alert', 'New Tech Awaiting Approval', 'Alex Tran has submitted all documents and is awaiting review.'),
  ((SELECT id FROM users WHERE email = 'admin@matchvac.com'), 'alert', 'Emergency Job Unassigned', 'A "No A/C Emergency" job in Hyattsville, MD has been open for 22 minutes with no tech assigned.'),
  ((SELECT id FROM users WHERE email = 'admin@matchvac.com'), 'success', 'Tech Document Verified', 'Deja Williams has completed all required document uploads. Account is now fully active.')
ON CONFLICT DO NOTHING;