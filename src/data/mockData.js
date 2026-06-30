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

