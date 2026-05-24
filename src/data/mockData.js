export const SERVICES = [
  { id: 's1', name: 'Furnace Repair', category: 'Heating', icon: '🔥', emergency: false, tiers: { basic: 149, standard: 249, premium: 399 }, description: 'Diagnose and repair furnace issues' },
  { id: 's2', name: 'Furnace Replacement', category: 'Heating', icon: '🔥', emergency: false, tiers: { basic: 1499, standard: 2499, premium: 3999 }, description: 'Full furnace replacement & installation' },
  { id: 's3', name: 'Water Heater Repair', category: 'Plumbing', icon: '💧', emergency: false, tiers: { basic: 129, standard: 199, premium: 299 }, description: 'Fix water heater problems fast' },
  { id: 's4', name: 'Water Heater Replacement', category: 'Plumbing', icon: '💧', emergency: false, tiers: { basic: 899, standard: 1499, premium: 2299 }, description: 'Replace old water heater' },
  { id: 's5', name: 'Outdoor Condenser Repair', category: 'Cooling', icon: '❄️', emergency: false, tiers: { basic: 179, standard: 279, premium: 449 }, description: 'Condenser unit diagnostics & repair' },
  { id: 's6', name: 'Outdoor Condenser Replacement', category: 'Cooling', icon: '❄️', emergency: false, tiers: { basic: 1999, standard: 3499, premium: 4999 }, description: 'Full condenser replacement' },
  { id: 's7', name: 'A/C Tune-Up', category: 'Cooling', icon: '🧊', emergency: false, tiers: { basic: 89, standard: 149, premium: 229 }, description: 'Complete A/C maintenance & tune-up' },
  { id: 's8', name: 'Duct Cleaning', category: 'Air Quality', icon: '🌬️', emergency: false, tiers: { basic: 199, standard: 349, premium: 549 }, description: 'Full duct system cleaning' },
  { id: 's9', name: 'Thermostat Installation', category: 'Controls', icon: '🌡️', emergency: false, tiers: { basic: 99, standard: 149, premium: 249 }, description: 'Smart or standard thermostat install' },
  { id: 's10', name: 'Air Quality Assessment', category: 'Air Quality', icon: '🍃', emergency: false, tiers: { basic: 79, standard: 129, premium: 199 }, description: 'Comprehensive indoor air quality test' },
  { id: 's11', name: 'Annual HVAC Inspection', category: 'Maintenance', icon: '🔍', emergency: false, tiers: { basic: 99, standard: 149, premium: 229 }, description: 'Complete system health inspection' },
  { id: 's12', name: '🚨 No Heat Emergency', category: 'Emergency', icon: '🚨', emergency: true, tiers: { basic: 349, standard: 499, premium: 699 }, description: 'Priority dispatch — no heat emergency' },
  { id: 's13', name: '🚨 No A/C Emergency', category: 'Emergency', icon: '🚨', emergency: true, tiers: { basic: 349, standard: 499, premium: 699 }, description: 'Priority dispatch — no A/C emergency' },
]

export const PRODUCTS = [
  { id: 'p1', name: 'Nest Learning Thermostat (4th Gen)', category: 'Thermostats', price: 249.99, rating: 4.8, reviews: 2341, image: '🌡️', badge: 'Best Seller', description: 'Smart learning thermostat with auto-schedule' },
  { id: 'p2', name: 'Honeywell Home T6 Pro', category: 'Thermostats', price: 79.99, rating: 4.6, reviews: 1205, image: '🌡️', description: 'Programmable thermostat, easy setup' },
  { id: 'p3', name: 'ecobee SmartThermostat Premium', category: 'Thermostats', price: 279.99, rating: 4.7, reviews: 987, image: '🌡️', badge: 'Top Rated', description: 'Alexa built-in, room sensors included' },
  { id: 'p4', name: 'Filtrete 1" MERV 11 Air Filter (6-pack)', category: 'Air Filters', price: 34.99, rating: 4.7, reviews: 4521, image: '🌬️', badge: 'Best Value', description: 'Captures allergens, dust, and pollen' },
  { id: 'p5', name: 'Nordic Pure 4" MERV 12 Filter', category: 'Air Filters', price: 24.99, rating: 4.8, reviews: 2198, image: '🌬️', description: 'High-efficiency 4-inch media filter' },
  { id: 'p6', name: 'Honeywell HEPA Air Filter', category: 'Air Filters', price: 59.99, rating: 4.9, reviews: 876, image: '🌬️', badge: 'Premium', description: 'Hospital-grade HEPA filtration' },
  { id: 'p7', name: 'Carrier 80% AFUE Gas Furnace', category: 'Furnaces', price: 1299.99, rating: 4.6, reviews: 342, image: '🔥', description: '80,000 BTU single-stage gas furnace' },
  { id: 'p8', name: 'Lennox Merit 96% AFUE Furnace', category: 'Furnaces', price: 1899.99, rating: 4.8, reviews: 215, image: '🔥', badge: 'High Efficiency', description: 'Variable speed blower, ultra-quiet' },
  { id: 'p9', name: 'Rheem 40-Gal Natural Gas Water Heater', category: 'Water Heaters', price: 699.99, rating: 4.5, reviews: 892, image: '💧', description: '40-gallon, 40,000 BTU, 6yr warranty' },
  { id: 'p10', name: 'A.O. Smith 50-Gal Power Vent', category: 'Water Heaters', price: 899.99, rating: 4.7, reviews: 634, image: '💧', badge: 'Top Rated', description: 'High-efficiency power vent design' },
]

export const MOCK_JOBS = [
  { id: 'j1', service: 'Furnace Repair', customer: 'Sarah K.', address: '4821 River Rd, Bethesda, MD', tier: 'Standard', price: 249, techFee: 37.35, netPay: 211.65, status: 'completed', date: '2026-05-05', tech: 'Marcus Rivera', rating: 5 },
  { id: 'j2', service: 'A/C Tune-Up', customer: 'Robert M.', address: '1230 Columbia Pike, Arlington, VA', tier: 'Basic', price: 89, techFee: 13.35, netPay: 75.65, status: 'completed', date: '2026-05-04', tech: 'Marcus Rivera', rating: 5 },
  { id: 'j3', service: '🚨 No Heat Emergency', customer: 'Diana P.', address: '775 Georgia Ave, Silver Spring, MD', tier: 'Premium', price: 699, techFee: 104.85, netPay: 594.15, status: 'completed', date: '2026-05-03', tech: 'Marcus Rivera', rating: 4 },
  { id: 'j4', service: 'Thermostat Installation', customer: 'Tom W.', address: '3310 Wisconsin Ave NW, Washington, DC', tier: 'Standard', price: 149, techFee: 22.35, netPay: 126.65, status: 'in_progress', date: '2026-05-07', tech: 'Marcus Rivera' },
  { id: 'j5', service: 'Duct Cleaning', customer: 'Linda G.', address: '982 Rockville Pike, Rockville, MD', tier: 'Premium', price: 549, techFee: 82.35, netPay: 466.65, status: 'available', date: '2026-05-07' },
  { id: 'j6', service: 'Water Heater Repair', customer: 'Chris B.', address: '441 Duke St, Alexandria, VA', tier: 'Standard', price: 199, techFee: 29.85, netPay: 169.15, status: 'available', date: '2026-05-07' },
  { id: 'j7', service: '🚨 No A/C Emergency', customer: 'Amy F.', address: '660 University Blvd, Hyattsville, MD', tier: 'Standard', price: 499, techFee: 74.85, netPay: 424.15, status: 'available', date: '2026-05-07', urgent: true },
]

// Tech subscription tiers
export const TECH_SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Standard',
    price: 0,
    platformFee: 0.15,
    color: 'surface',
    perks: [
      'Access to all available jobs',
      '15% platform fee per job',
      'Standard dispatch priority',
      'Basic earnings dashboard',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    platformFee: 0.11,
    color: 'brand',
    badge: 'Most Popular',
    perks: [
      'Priority job dispatch queue',
      '11% platform fee (save 4%)',
      'Pro badge on profile',
      'Early access to premium jobs',
      'Advanced earnings analytics',
    ],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 99,
    platformFee: 0.08,
    color: 'accent',
    badge: 'Best Value',
    perks: [
      'First in dispatch queue always',
      '8% platform fee (save 7%)',
      'Elite badge + featured profile',
      'Emergency job priority access',
      'Dedicated account support',
      'Monthly performance report',
    ],
  },
}

export const MOCK_TECHS = [
  { id: 'tech-1', name: 'Marcus Rivera', email: 'tech@demo.com', rating: 4.9, jobs: 247, status: 'active', location: 'Silver Spring, MD', certifications: ['EPA 608', 'NATE Certified', 'MD State License'], joinDate: '2025-03-15', earnings: 42850, subscription: 'elite' },
  { id: 'tech-2', name: 'Deja Williams', email: 'deja@demo.com', rating: 4.8, jobs: 189, status: 'active', location: 'Arlington, VA', certifications: ['EPA 608', 'NATE Certified'], joinDate: '2025-04-02', earnings: 31200, subscription: 'pro' },
  { id: 'tech-3', name: 'Alex Tran', email: 'alex@demo.com', rating: 4.7, jobs: 134, status: 'pending', location: 'Bethesda, MD', certifications: ['EPA 608'], joinDate: '2026-04-20', earnings: 0, subscription: 'free' },
  { id: 'tech-4', name: 'Jordan Lee', email: 'jordan@demo.com', rating: 4.6, jobs: 78, status: 'active', location: 'Alexandria, VA', certifications: ['EPA 608', 'NATE Certified'], joinDate: '2025-09-10', earnings: 13750, subscription: 'pro' },
]

export const MOCK_CUSTOMERS = [
  { id: 'cust-1', name: 'Jordan Smith', email: 'customer@demo.com', jobs: 3, spent: 687, joinDate: '2025-11-01', status: 'active', location: 'Washington, DC' },
  { id: 'cust-2', name: 'Sarah K.', email: 'sarah@demo.com', jobs: 8, spent: 1842, joinDate: '2025-06-15', status: 'active', location: 'Bethesda, MD' },
  { id: 'cust-3', name: 'Robert M.', email: 'robert@demo.com', jobs: 2, spent: 328, joinDate: '2026-01-20', status: 'active', location: 'Arlington, VA' },
  { id: 'cust-4', name: 'Diana P.', email: 'diana@demo.com', jobs: 5, spent: 2190, joinDate: '2025-08-05', status: 'active', location: 'Silver Spring, MD' },
]

// Active service locations derived from enrolled techs — ticker pulls from this
export const SERVICE_LOCATIONS = [
  { city: 'Washington', state: 'DC', techs: 8, new: false },
  { city: 'Bethesda', state: 'MD', techs: 5, new: false },
  { city: 'Silver Spring', state: 'MD', techs: 4, new: false },
  { city: 'Rockville', state: 'MD', techs: 4, new: false },
  { city: 'Arlington', state: 'VA', techs: 6, new: false },
  { city: 'Alexandria', state: 'VA', techs: 5, new: false },
  { city: 'Fairfax', state: 'VA', techs: 3, new: false },
  { city: 'Gaithersburg', state: 'MD', techs: 3, new: true },
  { city: 'Germantown', state: 'MD', techs: 2, new: true },
  { city: 'Hyattsville', state: 'MD', techs: 2, new: false },
  { city: 'Laurel', state: 'MD', techs: 2, new: false },
  { city: 'Reston', state: 'VA', techs: 3, new: true },
  { city: 'Herndon', state: 'VA', techs: 2, new: false },
  { city: 'McLean', state: 'VA', techs: 2, new: false },
  { city: 'Annapolis', state: 'MD', techs: 2, new: true },
  // Keeping OC/CA as expansion market reference
  { city: 'Irvine', state: 'CA', techs: 2, new: true },
  { city: 'Newport Beach', state: 'CA', techs: 1, new: true },
]

export const MOCK_CONTRACTORS = [
  { id: 'con-1', company: 'Capital Air Pro', contact: 'Ray Gutierrez', email: 'ray@capitalairpro.com', tier: 'Featured', trades: ['HVAC', 'Refrigeration'], location: 'Rockville, MD', status: 'active', joinDate: '2025-11-01', monthlyFee: 499, referralRate: 0.05, jobsReferred: 38, referralRevenue: 4210, adImpressions: 12400, leads: 91 },
  { id: 'con-2', company: 'DMV Comfort Systems', contact: 'Maria Chen', email: 'maria@dmvcomfort.com', tier: 'Verified', trades: ['HVAC', 'Plumbing'], location: 'Alexandria, VA', status: 'active', joinDate: '2026-01-15', monthlyFee: 99, referralRate: 0.07, jobsReferred: 24, referralRevenue: 1890, adImpressions: 4200, leads: 47 },
  { id: 'con-3', company: 'HeatRight Services', contact: 'Devon Okafor', email: 'devon@heatright.com', tier: 'Free', trades: ['Heating'], location: 'Hyattsville, MD', status: 'active', joinDate: '2026-03-20', monthlyFee: 0, referralRate: 0.10, jobsReferred: 9, referralRevenue: 630, adImpressions: 0, leads: 12 },
  { id: 'con-4', company: 'Beltway HVAC Elite', contact: 'Kim Nakamura', email: 'kim@beltwayHVAC.com', tier: 'Featured', trades: ['HVAC', 'Electrical', 'Ductwork'], location: 'Bethesda, MD', status: 'active', joinDate: '2025-09-05', monthlyFee: 499, referralRate: 0.05, jobsReferred: 61, referralRevenue: 7850, adImpressions: 19600, leads: 138 },
  { id: 'con-5', company: 'NoVA Air & Heat', contact: 'Tommy Walsh', email: 'tommy@novaairheat.com', tier: 'Verified', trades: ['HVAC', 'Air Quality'], location: 'Fairfax, VA', status: 'pending', joinDate: '2026-04-30', monthlyFee: 99, referralRate: 0.07, jobsReferred: 0, referralRevenue: 0, adImpressions: 0, leads: 0 },
]

export const AD_SLOTS = [
  { id: 'ad1', partner: 'Comfort Connect Premier', type: 'homepage_banner', active: true, impressions: 14200, clicks: 892 },
  { id: 'ad2', partner: 'GreenLeaf Financing', type: 'service_page', active: true, impressions: 6800, clicks: 341 },
  { id: 'ad3', partner: 'ProElectric Services', type: 'post_job', active: false, impressions: 0, clicks: 0 },
]
