import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import {
  DollarSign, Shield, FileText, Globe, Zap, Users, Wrench,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Info,
  TrendingUp, Clock, MapPin, ArrowRight, Star, Building2,
  CreditCard, Server, Megaphone, Scale, Package, ExternalLink
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 'phase0',
    label: 'Phase 0',
    title: 'Pre-Launch (Before Day 1)',
    subtitle: 'Legal, licensing & foundation — Maryland-specific requirements',
    color: 'from-purple-600 to-purple-800',
    accent: 'purple',
    border: 'border-purple-500/30',
    bg: 'bg-purple-900/10',
    icon: Scale,
    timeline: '4–8 weeks',
    total: { low: 2850, high: 5900 },
    items: [
      {
        category: 'Maryland Business Formation',
        icon: Building2,
        items: [
          { name: 'MD LLC Articles of Organization (SDAT)', cost: '$100', note: 'Maryland State Dept. of Assessments & Taxation one-time fee', required: true },
          { name: 'Registered Agent (1 year)', cost: '$50–$150', note: 'Required if you have no MD physical address — ZenBusiness, Northwest, etc.', required: true },
          { name: 'Federal EIN (IRS)', cost: 'Free', note: 'Apply at IRS.gov — takes 5 minutes online', required: true },
          { name: 'MD Annual Report (SDAT)', cost: '$300/yr', note: 'Due April 15 each year for LLCs. Non-payment = forfeiture.', required: true },
          { name: 'Maryland Business License (SDAT)', cost: '$0–$200', note: 'County-specific; required in Montgomery, PG, Howard, etc.', required: true },
        ],
      },
      {
        category: 'Marketplace / Technology Licensing (MD)',
        icon: Globe,
        items: [
          { name: 'MD Home Improvement Contractor License (optional)', cost: '$400', note: 'Only required if YOU perform work. As a marketplace/broker, likely exempt — confirm with MD DLLR.', required: false },
          { name: 'MD Money Transmitter License (optional)', cost: '$0–$5,000', note: 'Required if you hold customer funds in escrow for extended periods. Consult an attorney — many marketplace models are exempt under "payment processor" carve-outs.', required: false },
          { name: 'Legal Review (marketplace exemptions)', cost: '$500–$2,000', note: 'One-time attorney consult to confirm which MD licenses apply to your platform model', required: true },
        ],
      },
      {
        category: 'Insurance',
        icon: Shield,
        items: [
          { name: 'General Liability Insurance', cost: '$600–$1,200/yr', note: 'Required. Protects against property damage claims on jobs booked through platform', required: true },
          { name: 'Errors & Omissions (E&O) / Tech Liability', cost: '$800–$2,400/yr', note: 'Protects against claims related to platform errors, dispatching wrong tech, data breach, etc.', required: true },
          { name: 'Workers Comp (if W-2 employees)', cost: 'Varies', note: 'Not required for 1099 contractor model, but required if you hire any W-2 staff', required: false },
        ],
      },
      {
        category: 'Tax & Accounting Setup',
        icon: FileText,
        items: [
          { name: 'CPA / Accountant Setup (1099 structure)', cost: '$300–$800', note: 'Establish chart of accounts, MD-specific sales tax guidance, contractor payment structure', required: true },
          { name: 'Accounting Software (QuickBooks/Wave)', cost: '$0–$30/mo', note: 'Wave is free; QuickBooks Simple Start is $30/mo — you already have revenue reporting in-app', required: true },
        ],
      },
    ],
  },
  {
    id: 'phase1',
    label: 'Phase 1',
    title: 'Technology Stack',
    subtitle: 'Hosting, payments, backend, and going beyond the demo',
    color: 'from-brand-600 to-brand-800',
    accent: 'blue',
    border: 'border-brand-500/30',
    bg: 'bg-brand-900/10',
    icon: Server,
    timeline: 'Ongoing monthly',
    total: { low: 290, high: 680 },
    totalLabel: '/month',
    items: [
      {
        category: 'Hosting & Infrastructure',
        icon: Globe,
        items: [
          { name: 'Netlify (current — marketing site)', cost: '$0–$19/mo', note: 'Free tier works for the static React app. Pro ($19/mo) needed for form submissions, analytics, higher bandwidth', required: true },
          { name: 'Backend / API Server (Node.js on Railway or Render)', cost: '$20–$50/mo', note: 'You\'ll need a real backend to replace mock data — Railway Starter or Render Starter plan', required: true },
          { name: 'PostgreSQL Database (Supabase or Railway)', cost: '$0–$25/mo', note: 'Supabase free tier (500MB) works for launch. Upgrade as volume grows.', required: true },
          { name: 'Redis / Job Queue (Upstash)', cost: '$0–$10/mo', note: 'For dispatch queue, push notifications, job assignment logic', required: false },
          { name: 'Custom Domain (servicetechconnect.com or .app)', cost: '$12–$20/yr', note: 'Already on Netlify — just connect your own domain', required: true },
          { name: 'SSL Certificate', cost: 'Free', note: 'Netlify provisions Let\'s Encrypt automatically', required: true },
        ],
      },
      {
        category: 'Payments (Critical)',
        icon: CreditCard,
        items: [
          { name: 'Stripe (payment processing)', cost: '2.9% + $0.30/transaction', note: 'Standard rate. Stripe Connect for marketplace payouts to techs. No monthly fee — pay per transaction. ~$15–30/mo at early volume', required: true },
          { name: 'Stripe Connect (tech payouts)', cost: '$2/active account/mo', note: 'Each tech with a connected Stripe account = $2/mo. 10 techs = $20/mo. First 10 free during trial.', required: true },
          { name: 'Financing Partner Integration (Comfort Connect)', cost: 'Revenue-share only', note: 'No upfront fee if you use their white-label API. They take a cut of financed amounts.', required: false },
        ],
      },
      {
        category: 'Communications',
        icon: Zap,
        items: [
          { name: 'Twilio SMS (job alerts, dispatch)', cost: '$20–$50/mo', note: 'Roughly $0.0079/SMS. ~2,500–6,000 messages/mo. Critical for tech dispatch notifications.', required: true },
          { name: 'SendGrid Email (transactional)', cost: '$0–$20/mo', note: 'Free tier = 100 emails/day. Essentials plan $20/mo = 50,000 emails/mo.', required: true },
          { name: 'Push Notifications (OneSignal)', cost: '$0–$9/mo', note: 'Free up to 10,000 subscribers. Web push for PWA.', required: false },
        ],
      },
      {
        category: 'Maps & Location',
        icon: MapPin,
        items: [
          { name: 'Google Maps API (job tracking, tech location)', cost: '$0–$50/mo', note: '$200 free credit/mo from Google. Covers most early-stage usage for DMV area.', required: true },
          { name: 'Geocoding / Distance Matrix', cost: 'Included in Maps credit', note: 'Used for tech-to-job proximity matching', required: false },
        ],
      },
    ],
  },
  {
    id: 'phase2',
    label: 'Phase 2',
    title: 'Launch Marketing — DMV Market',
    subtitle: 'Acquiring your first 50 customers and 10 techs in MD/VA/DC',
    color: 'from-emerald-600 to-emerald-800',
    accent: 'emerald',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-900/10',
    icon: Megaphone,
    timeline: 'Month 1–3',
    total: { low: 1500, high: 4500 },
    totalLabel: '/month',
    items: [
      {
        category: 'Digital Advertising',
        icon: TrendingUp,
        items: [
          { name: 'Google Ads (HVAC service search)', cost: '$500–$1,500/mo', note: 'DMV HVAC keywords ($8–$25 CPC). Target: Bethesda, Arlington, Silver Spring, Rockville, Alexandria. Seasonal peaks: Jan (heat), Jun–Aug (A/C).', required: true },
          { name: 'Meta / Instagram Ads (homeowner targeting)', cost: '$300–$800/mo', note: 'Target MD/VA/DC homeowners 30–65. Video testimonials perform well.', required: false },
          { name: 'Google Business Profile (GBP)', cost: 'Free', note: 'Critical for DMV local SEO. Set up Rockville HQ as primary location.', required: true },
          { name: 'Nextdoor Ads (hyper-local neighborhoods)', cost: '$100–$300/mo', note: 'Highly effective for home services in DMV neighborhoods. Bethesda, Arlington, Silver Spring communities.', required: false },
        ],
      },
      {
        category: 'Tech / Contractor Recruitment',
        icon: Wrench,
        items: [
          { name: 'Indeed / ZipRecruiter (tech recruitment)', cost: '$200–$400/mo', note: 'Post for HVAC Technicians (1099) in MD/VA/DC. Average HVAC tech in DMV earns $65K–$95K — your platform needs to show clear earnings potential.', required: true },
          { name: 'HVAC Trade Association Outreach (ACCA National)', cost: '$0–$200', note: 'ACCA has a strong MD chapter. Sponsor a local meeting or post on their job board.', required: false },
          { name: 'Referral Bonus for Tech Sign-ups', cost: '$50–$100/referral', note: 'Budget $500–$1,000 for first 10 tech sign-up bonuses', required: false },
        ],
      },
      {
        category: 'Content & SEO',
        icon: Globe,
        items: [
          { name: 'Local SEO Content (MD/VA/DC pages)', cost: '$0–$500', note: 'City landing pages already partially set up. Add Google Maps embed, local schema, GMB posts.', required: false },
          { name: 'Blog / AEO Content (already partially done)', cost: '$0–$300/mo', note: 'AI Answer Engine Optimization is already in your index.html — expand with FAQ posts targeting DMV HVAC questions', required: false },
        ],
      },
    ],
  },
  {
    id: 'phase3',
    label: 'Phase 3',
    title: 'Operations & Compliance (Ongoing)',
    subtitle: 'Keeping the business running legally and efficiently',
    color: 'from-amber-600 to-amber-700',
    accent: 'amber',
    border: 'border-amber-500/30',
    bg: 'bg-amber-900/10',
    icon: Clock,
    timeline: 'Monthly recurring',
    total: { low: 400, high: 1100 },
    totalLabel: '/month',
    items: [
      {
        category: 'Ongoing Legal & Compliance',
        icon: Scale,
        items: [
          { name: 'Registered Agent (renewal)', cost: '$50–$150/yr', note: 'Annual renewal', required: true },
          { name: 'MD Annual Report (SDAT)', cost: '$300/yr', note: 'Due every April 15', required: true },
          { name: 'Attorney on retainer (disputes, T&Cs updates)', cost: '$100–$300/mo', note: 'Contractor disputes, refund disputes, T&C updates as regulations change', required: false },
          { name: '1099-NEC Filing (per tech per year)', cost: '$2–$5/filing', note: 'Required for any tech paid >$600/yr. ~10 techs = $20–$50/yr. Services like Track1099 automate this.', required: true },
        ],
      },
      {
        category: 'Customer Support',
        icon: Users,
        items: [
          { name: 'Intercom / Crisp Chat (in-app support)', cost: '$39–$99/mo', note: 'Starter plan. Critical for resolving dispatch issues, payment disputes.', required: true },
          { name: 'Part-time Support VA (as volume grows)', cost: '$0–$500/mo', note: 'Upwork VA at $15–$20/hr for 10–20 hrs/week. Not needed at launch.', required: false },
        ],
      },
      {
        category: 'Financial Tools',
        icon: DollarSign,
        items: [
          { name: 'Stripe Dashboard + Payouts', cost: 'Included', note: 'Already built into your revenue reporting', required: true },
          { name: 'QuickBooks Simple Start', cost: '$30/mo', note: 'For MD sales tax tracking, contractor payment records, P&L', required: true },
          { name: 'Payroll (if you hire W-2)', cost: '$40–$80/mo', note: 'Gusto or ADP. Not needed if all-1099 at launch.', required: false },
        ],
      },
    ],
  },
]

const SUMMARY_ROWS = [
  { label: 'Phase 0 — Legal & Licensing (one-time)', low: 2850, high: 5900, type: 'one-time', accent: 'purple' },
  { label: 'Technology Stack', low: 290, high: 680, type: 'monthly', accent: 'blue' },
  { label: 'Launch Marketing (first 3 months avg)', low: 1500, high: 4500, type: 'monthly', accent: 'emerald' },
  { label: 'Operations & Compliance', low: 400, high: 1100, type: 'monthly', accent: 'amber' },
]

const MD_NOTES = [
  { icon: '🏛️', title: 'Maryland SDAT', body: 'All MD LLCs must file an Annual Report by April 15 ($300). Late = automatic forfeiture. Set a calendar reminder.' },
  { icon: '🔨', title: 'Home Improvement Contractor License', body: 'MD DLLR requires this for anyone performing home improvement work. As a marketplace (you don\'t do the work), you\'re likely exempt — but get written confirmation from an attorney.' },
  { icon: '💰', title: 'MD Sales Tax on Services', body: 'Maryland does not tax most HVAC labor services. However, parts/equipment sold may be taxable. Your Stripe setup should separate labor vs. parts.' },
  { icon: '📋', title: '1099 Contractor Rules', body: 'Maryland follows ABC Test for contractor classification. Your techs work independently, set their own hours, and perform work outside your regular business — your model should qualify as 1099.' },
  { icon: '🏢', title: 'DMV Advantage', body: 'DC, MD, and VA each have separate licensing requirements. Operate from MD but you\'ll need to be aware of VA Contractor License ($35/yr) when expanding to Northern Virginia markets.' },
]

const ACCENT_COLORS = {
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  blue: { bg: 'bg-brand-500/10', border: 'border-brand-500/30', text: 'text-brand-400', badge: 'bg-brand-500/20 text-brand-300' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
}

// ── Component ─────────────────────────────────────────────────────────────────

function PhaseCard({ phase }) {
  const [open, setOpen] = useState(false)
  const [openCat, setOpenCat] = useState(null)
  const colors = ACCENT_COLORS[phase.accent]
  const Icon = phase.icon

  return (
    <div className={`rounded-2xl border ${phase.border} ${phase.bg} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-white/5 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>{phase.label}</span>
            <span className={`text-xs ${colors.text}`}>{phase.timeline}</span>
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">{phase.title}</h3>
          <p className="text-surface-400 text-sm mt-0.5">{phase.subtitle}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-surface-500 text-xs mb-0.5">{phase.totalLabel ? 'Est. range' : 'One-time'}</p>
          <p className={`font-bold text-lg ${colors.text}`}>
            ${phase.total.low.toLocaleString()}–${phase.total.high.toLocaleString()}
          </p>
          {phase.totalLabel && <p className="text-surface-500 text-xs">{phase.totalLabel}</p>}
          <div className={`mt-2 inline-flex items-center gap-1 ${colors.text}`}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="text-xs">{open ? 'Collapse' : 'View Details'}</span>
          </div>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-white/5 divide-y divide-white/5">
          {phase.items.map((cat, ci) => {
            const CatIcon = cat.icon
            const isOpen = openCat === ci
            return (
              <div key={ci}>
                <button
                  onClick={() => setOpenCat(isOpen ? null : ci)}
                  className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-white/5 transition-colors"
                >
                  <CatIcon size={16} className={colors.text} />
                  <span className="text-surface-200 font-semibold text-sm flex-1">{cat.category}</span>
                  <span className="text-surface-500 text-xs mr-2">{cat.items.length} items</span>
                  {isOpen ? <ChevronUp size={14} className="text-surface-500" /> : <ChevronDown size={14} className="text-surface-500" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 space-y-3">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="flex gap-3 p-3 rounded-xl bg-surface-900/60 border border-white/5">
                        <div className="mt-0.5 flex-shrink-0">
                          {item.required
                            ? <CheckCircle size={15} className="text-emerald-400" />
                            : <Info size={15} className="text-surface-500" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-surface-100 text-sm font-medium leading-tight">{item.name}</p>
                            <span className={`text-xs font-bold flex-shrink-0 ${colors.text}`}>{item.cost}</span>
                          </div>
                          <p className="text-surface-500 text-xs mt-1 leading-relaxed">{item.note}</p>
                          {!item.required && (
                            <span className="inline-block mt-1.5 text-xs text-surface-600 bg-surface-800 rounded px-2 py-0.5">Optional / Situational</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CostBreakdown() {
  const navigate = useNavigate()
  const [showScenario, setShowScenario] = useState('lean')

  const scenarios = {
    lean: {
      label: 'Lean Launch',
      desc: 'Bootstrap, all-1099, no employees, minimal legal. Prove the model first.',
      oneTime: 2850,
      monthly: 290 + 1500 + 400,
      color: 'emerald',
    },
    balanced: {
      label: 'Balanced Launch',
      desc: 'Proper legal setup, modest marketing, real backend infrastructure.',
      oneTime: 4200,
      monthly: 480 + 2500 + 700,
      color: 'blue',
    },
    full: {
      label: 'Full-Stack Launch',
      desc: 'All licenses, max marketing, full legal, customer support from day 1.',
      oneTime: 5900,
      monthly: 680 + 4500 + 1100,
      color: 'amber',
    },
  }

  const sc = scenarios[showScenario]
  const scColors = ACCENT_COLORS[sc.color]
  const runway3 = sc.oneTime + sc.monthly * 3
  const runway6 = sc.oneTime + sc.monthly * 6

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-bold text-white hidden sm:block">ServiceConnect</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-surface-500 text-sm hidden sm:block">Maryland Launch Cost Guide</span>
            <button onClick={() => navigate('/login')} className="btn-primary text-sm py-2 px-4">
              View Demo
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-semibold">
            <MapPin size={14} />
            Maryland / DMV Market · 2026 Cost Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            What It Costs to{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              Go Live
            </span>
          </h1>
          <p className="text-surface-400 text-lg">
            A realistic, itemized breakdown for launching ServiceConnect as a Maryland-based HVAC marketplace — from LLC formation to your first 100 customers.
          </p>
        </div>

        {/* Scenario Picker */}
        <div className="card-dark rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-1">Pick Your Launch Scenario</h2>
          <p className="text-surface-400 text-sm mb-5">Adjust based on how aggressively you want to launch and how much runway you have.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {Object.entries(scenarios).map(([key, s]) => {
              const sc2 = ACCENT_COLORS[s.color]
              return (
                <button
                  key={key}
                  onClick={() => setShowScenario(key)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    showScenario === key
                      ? `${sc2.bg} ${sc2.border}`
                      : 'bg-surface-800/50 border-white/5 hover:border-white/10'
                  }`}
                >
                  <p className={`font-bold mb-1 ${showScenario === key ? sc2.text : 'text-white'}`}>{s.label}</p>
                  <p className="text-surface-400 text-xs leading-relaxed">{s.desc}</p>
                </button>
              )
            })}
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'One-Time Setup', value: `$${sc.oneTime.toLocaleString()}`, sub: 'legal + licensing' },
              { label: 'Monthly Burn', value: `$${sc.monthly.toLocaleString()}`, sub: 'tech + ops + marketing' },
              { label: '3-Month Runway', value: `$${runway3.toLocaleString()}`, sub: 'setup + 3 months' },
              { label: '6-Month Runway', value: `$${runway6.toLocaleString()}`, sub: 'recommended buffer' },
            ].map((kpi, i) => (
              <div key={i} className={`rounded-xl p-4 ${scColors.bg} border ${scColors.border}`}>
                <p className="text-surface-400 text-xs mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black ${scColors.text}`}>{kpi.value}</p>
                <p className="text-surface-500 text-xs mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Offset Note */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/10 p-5 flex gap-4">
          <TrendingUp size={24} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-300 font-bold mb-1">Revenue offsets your burn quickly</p>
            <p className="text-surface-300 text-sm leading-relaxed">
              At just <strong className="text-white">10 completed jobs/month</strong> at an average $300 ticket, you generate <strong className="text-white">~$450/mo in platform fees</strong> (15% standard rate).
              With 50 jobs/month, that's $2,250/mo — covering most of your Lean Launch monthly costs.
              Your tech subscription revenue ($49–$99/mo per tech) and ad revenue are additional streams on top.
            </p>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-2xl">Detailed Breakdown by Phase</h2>
          <p className="text-surface-400 text-sm">Click any phase to expand. Click categories to see line items. <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle size={12} /> Required</span> vs <span className="inline-flex items-center gap-1 text-surface-400"><Info size={12} /> Optional</span> items are marked.</p>
          {PHASES.map(phase => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>

        {/* Maryland-Specific Notes */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-2xl">Maryland-Specific Considerations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MD_NOTES.map((note, i) => (
              <div key={i} className="card-dark rounded-2xl p-5 flex gap-4">
                <span className="text-2xl flex-shrink-0">{note.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{note.title}</p>
                  <p className="text-surface-400 text-sm leading-relaxed">{note.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost vs Build Comparison */}
        <div className="card-dark rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Star size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-lg">You Already Saved $40K–$120K</h2>
              <p className="text-surface-400 text-sm mt-1">Most HVAC marketplace startups pay $40K–$120K to a dev agency just to get to where this prototype is. Here's what you have vs. what's left to build:</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-4">
              <p className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} /> Already Built (this app)</p>
              <ul className="space-y-1.5 text-sm text-surface-300">
                {[
                  'Customer portal (request, track, pay, review)',
                  'Tech portal (jobs, earnings, subscription tiers)',
                  'Admin portal (reports, users, jobs, ads)',
                  'Escrow payment flow UI',
                  'Revenue projections (all 7 streams)',
                  'Comfort Connect financing page',
                  'Contractor partner portal',
                  'Public marketing website + AEO schema',
                  'Tech subscription tiers (Standard/Pro/Elite)',
                  'Location data for all DMV markets',
                  'Customer profile management',
                  'Netlify deployment (servicetechconnect.netlify.app)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-amber-900/20 border border-amber-500/20 p-4">
              <p className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2"><AlertCircle size={14} /> Still Needed for Real Launch</p>
              <ul className="space-y-1.5 text-sm text-surface-300">
                {[
                  'Real backend API (replace mock data)',
                  'PostgreSQL database',
                  'Stripe Connect (real payouts)',
                  'SMS dispatch (Twilio integration)',
                  'Real user auth (JWT, email verify)',
                  'Google Maps live integration',
                  'Admin approval flow for tech onboarding',
                  'Real Comfort Connect API integration',
                  'Mobile-responsive polish (PWA optional)',
                  'Maryland LLC + legal docs',
                  'Insurance policies',
                  '1099 filing automation (Track1099)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl bg-brand-900/20 border border-brand-500/20 p-4">
            <p className="text-brand-300 font-bold text-sm mb-1">Backend build estimate (if outsourced)</p>
            <p className="text-surface-400 text-sm">A full backend (API + DB + Stripe Connect + auth) typically runs <strong className="text-white">$8,000–$25,000</strong> with a dev agency, or <strong className="text-white">$3,000–$8,000</strong> with a skilled freelancer. With AI tools and the existing frontend already done, this is significantly reduced.</p>
          </div>
        </div>

        {/* Total Summary Table */}
        <div className="card-dark rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-2xl">Total Investment Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-surface-500 text-xs border-b border-white/5">
                  <th className="text-left pb-3 font-semibold">Cost Category</th>
                  <th className="text-right pb-3 font-semibold">Low</th>
                  <th className="text-right pb-3 font-semibold">High</th>
                  <th className="text-right pb-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SUMMARY_ROWS.map((row, i) => {
                  const c = ACCENT_COLORS[row.accent]
                  return (
                    <tr key={i}>
                      <td className="py-3 text-surface-200">{row.label}</td>
                      <td className={`py-3 text-right font-bold ${c.text}`}>${row.low.toLocaleString()}</td>
                      <td className={`py-3 text-right font-bold ${c.text}`}>${row.high.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
                          {row.type === 'monthly' ? '/month' : 'one-time'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10">
                  <td className="pt-4 text-white font-bold">6-Month All-In (Lean)</td>
                  <td className="pt-4 text-right text-white font-black text-base">$15,290</td>
                  <td className="pt-4 text-right text-white font-black text-base">—</td>
                  <td className="pt-4 text-right"></td>
                </tr>
                <tr>
                  <td className="pb-2 text-white font-bold">6-Month All-In (Full)</td>
                  <td className="pb-2 text-right text-amber-400 font-black text-base">—</td>
                  <td className="pb-2 text-right text-amber-400 font-black text-base">$44,300</td>
                  <td className="pb-2 text-right"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-surface-500 text-xs">* Does not include backend development cost if outsourced ($3K–$25K one-time). Does not include your personal time or opportunity cost.</p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-900/40 to-accent-900/30 border border-brand-500/30 p-8 text-center space-y-4">
          <h2 className="text-white font-black text-2xl">Ready to See the Platform?</h2>
          <p className="text-surface-400">Explore all three portals — customer, tech, and admin — using the demo login.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => navigate('/login')} className="btn-primary flex items-center gap-2">
              Launch Demo <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/')} className="btn-ghost flex items-center gap-2">
              Back to Website
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-surface-500 text-sm">
          <span>© 2026 ServiceConnect · Maryland / DMV</span>
          <span>Estimates current as of Q2 2026 · Not legal or financial advice</span>
        </div>
      </footer>
    </div>
  )
}
