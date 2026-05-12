import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { Shield, ChevronDown, ChevronUp, ArrowLeft, User, Wrench, Building2, DollarSign, FileText } from 'lucide-react'

const LAST_UPDATED = 'May 12, 2026'
const COMPANY = 'ServiceConnect, LLC'
const COMPANY_STATE = 'Maryland'
const CONTACT_EMAIL = 'legal@serviceconnect.io'

// ── Accordion Section ──────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-surface-900 hover:bg-surface-800 transition-colors text-left"
      >
        <span className="text-white font-semibold">{title}</span>
        {open ? <ChevronUp size={16} className="text-surface-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-surface-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 py-5 bg-surface-900/50 border-t border-white/10 prose-custom">
          {children}
        </div>
      )}
    </div>
  )
}

function P({ children }) {
  return <p className="text-surface-300 text-sm leading-relaxed mb-3 last:mb-0">{children}</p>
}
function H({ children }) {
  return <p className="text-white font-semibold text-sm mb-1.5 mt-3 first:mt-0">{children}</p>
}
function UL({ items }) {
  return (
    <ul className="space-y-1.5 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
          <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
function Highlight({ children }) {
  return <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3 text-brand-300 text-sm leading-relaxed mb-3">{children}</div>
}
function Warning({ children }) {
  return <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-300 text-sm leading-relaxed mb-3">{children}</div>
}

// ── TAB CONTENT ────────────────────────────────────────────────────────────

function GeneralTerms() {
  return (
    <div className="space-y-3">
      <Section title="1. Agreement to Terms" defaultOpen>
        <P>By accessing or using the ServiceConnect platform ("Platform"), website, or mobile application, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.</P>
        <P>These Terms constitute a legally binding agreement between you and {COMPANY}, a {COMPANY_STATE}-registered limited liability company ("ServiceConnect," "we," "us," or "our"). {COMPANY} operates as a technology marketplace that connects customers seeking home services with independent service providers.</P>
        <P>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms. Material changes will be communicated via email or in-app notice.</P>
      </Section>
      <Section title="2. Nature of the Platform — We Are a Marketplace">
        <Highlight>ServiceConnect is a technology platform that facilitates connections between customers and independent contractors. We are NOT a home services company, employer, or general contractor. All services are performed by independent third-party professionals who are not employees, agents, or representatives of ServiceConnect.</Highlight>
        <P>ServiceConnect does not perform, supervise, direct, or control any home services work. The service providers on the Platform are solely responsible for the quality, safety, legality, and timeliness of the services they provide.</P>
        <P>This relationship is similar to that of other marketplace platforms. Your agreement to receive services is directly with the independent service provider, not with ServiceConnect.</P>
      </Section>
      <Section title="3. Eligibility">
        <P>To use the Platform, you must be at least 18 years of age, capable of entering into a binding contract, and not prohibited from doing so under applicable law. By creating an account, you represent and warrant that you meet these requirements.</P>
      </Section>
      <Section title="4. Account Registration & Security">
        <P>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify ServiceConnect immediately at {CONTACT_EMAIL} of any unauthorized use of your account.</P>
        <P>ServiceConnect reserves the right to suspend or terminate accounts at any time for violations of these Terms or for conduct that ServiceConnect, in its sole discretion, deems harmful to the Platform or its users.</P>
      </Section>
      <Section title="5. Privacy & Data">
        <P>Your use of the Platform is subject to our Privacy Policy, incorporated herein by reference. By using the Platform, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.</P>
      </Section>
      <Section title="6. Prohibited Conduct">
        <UL items={[
          'Use the Platform for any unlawful purpose or in violation of any local, state, national, or international law or regulation.',
          'Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity.',
          'Interfere with or disrupt the Platform or servers or networks connected to the Platform.',
          'Attempt to gain unauthorized access to any portion of the Platform or any other systems or networks connected to the Platform.',
          'Use any automated scraping, data mining, or extraction tools on the Platform.',
          'Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.',
        ]} />
      </Section>
      <Section title="7. Intellectual Property">
        <P>All content, features, and functionality on the Platform — including but not limited to text, graphics, logos, button icons, images, audio clips, data compilations, and software — are the exclusive property of ServiceConnect or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.</P>
      </Section>
      <Section title="8. Limitation of Liability">
        <Warning>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, SERVICECONNECT, ITS OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES, AGENTS, LICENSORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES — INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES — ARISING OUT OF OR RELATED TO YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE PLATFORM OR ANY CONTENT THEREON.</Warning>
        <P>ServiceConnect's total aggregate liability to you for any and all claims arising from or relating to the Platform shall not exceed the greater of (a) the total fees paid by you to ServiceConnect in the twelve (12) months preceding the claim, or (b) one hundred dollars ($100.00).</P>
        <P>Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages. In such jurisdictions, our liability is limited to the greatest extent permitted by law.</P>
      </Section>
      <Section title="9. Indemnification">
        <P>You agree to defend, indemnify, and hold harmless ServiceConnect and its officers, directors, employees, affiliates, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Platform.</P>
      </Section>
      <Section title="10. Dispute Resolution & Arbitration">
        <P>Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or validity thereof shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, rather than in court. The arbitration shall be conducted in {COMPANY_STATE}.</P>
        <P>YOU WAIVE YOUR RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS OR CLASS-WIDE ARBITRATION. You may only bring claims in your individual capacity, not as a plaintiff or class member in any purported class action.</P>
        <P>Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent actual or threatened infringement of intellectual property rights.</P>
      </Section>
      <Section title="11. Governing Law">
        <P>These Terms shall be governed by and construed in accordance with the laws of the State of {COMPANY_STATE}, without regard to its conflict of law provisions. Any legal proceedings not subject to arbitration shall be brought exclusively in the state or federal courts located in {COMPANY_STATE}.</P>
      </Section>
      <Section title="12. Severability & Entire Agreement">
        <P>If any provision of these Terms is held to be invalid or unenforceable, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect. These Terms, together with the Privacy Policy and any applicable role-specific addendum, constitute the entire agreement between you and ServiceConnect regarding the Platform.</P>
      </Section>
      <Section title="13. Contact Us">
        <P>For questions about these Terms, please contact us at <span className="text-brand-400">{CONTACT_EMAIL}</span> or by mail at {COMPANY}, Rockville, MD 20850.</P>
      </Section>
    </div>
  )
}

function CustomerTerms() {
  return (
    <div className="space-y-3">
      <Section title="C-1. Service Booking & the Marketplace" defaultOpen>
        <P>When you submit a service request through ServiceConnect, you are posting a job to our marketplace. ServiceConnect broadcasts your request to independent, licensed service providers in your area. Acceptance of your job by a provider creates a direct service agreement between you and that provider — not between you and ServiceConnect.</P>
        <P>ServiceConnect makes no guarantee that a provider will accept your request, that work will be completed by a specific time, or that any specific provider will be available. Job acceptance and fulfillment are at the discretion of the independent provider.</P>
      </Section>
      <Section title="C-2. Pricing, Tiers & Quotes">
        <P>Service pricing is displayed in tiers (Basic, Standard, Premium) before you submit a request. Prices listed are estimates based on scope; additional charges may apply for parts, materials, or scope changes discovered during the job. Any change to scope or price must be mutually agreed upon by you and the provider before additional work begins.</P>
        <P>Promotional pricing, discounts, or financing offers are subject to their own terms and are not guaranteed.</P>
      </Section>
      <Section title="C-3. Escrow Payment & Release">
        <Highlight>ServiceConnect operates an escrow-based payment system. Your payment method is authorized at booking but funds are NOT transferred to the service provider until you confirm job completion. This is your primary protection mechanism.</Highlight>
        <P>Upon a provider marking a job complete, you will receive a notification to review and release payment. You have a confirmation window of <strong className="text-white">72 hours</strong> to approve or dispute. If no action is taken within 72 hours, funds will be <strong className="text-white">automatically released</strong> to the provider.</P>
        <P>By releasing payment, you acknowledge the work was completed to your satisfaction. Released funds are final and non-refundable absent an active dispute filed prior to release.</P>
      </Section>
      <Section title="C-4. Payment Disputes">
        <H>Filing a Dispute</H>
        <P>To dispute a job, you must do so BEFORE releasing escrow funds. File a dispute through the Track Job screen or by emailing {CONTACT_EMAIL} with your job ID. Once funds are released, ServiceConnect cannot guarantee recovery.</P>
        <H>Dispute Resolution Process</H>
        <UL items={[
          'ServiceConnect will review submitted evidence from both parties (photos, messages, job description).',
          'We will attempt to mediate a resolution within 5 business days.',
          'If mediation fails, ServiceConnect may escalate to independent arbitration per Section 10 of the General Terms.',
          'ServiceConnect\'s decision in platform-level disputes is final for matters under $500.',
        ]} />
        <H>Chargebacks</H>
        <P>Initiating a credit card chargeback without first exhausting ServiceConnect's dispute process is a violation of these Terms and may result in account suspension. ServiceConnect will contest chargebacks where the dispute process was not followed.</P>
      </Section>
      <Section title="C-5. Quality of Work & Satisfaction Guarantee">
        <P>ServiceConnect requires all providers to maintain a minimum quality standard and rating. If work is defective, incomplete, or not as described, you must:</P>
        <UL items={[
          'Document the issue with photos/video before the provider leaves the premises when possible.',
          'Do NOT release escrow payment if unsatisfied.',
          'File a dispute within the 72-hour window with supporting documentation.',
          'Allow ServiceConnect to contact the provider to offer a remediation opportunity.',
        ]} />
        <Warning>ServiceConnect does not provide a workmanship warranty on behalf of providers. Warranty obligations, if any, are solely between you and the provider. ServiceConnect may, in its sole discretion, offer service credits as a goodwill gesture but is not obligated to do so.</Warning>
      </Section>
      <Section title="C-6. Background Checks — Important Disclosure">
        <Highlight>ServiceConnect conducts third-party background checks on all provider applicants before approval on the platform. However, background checks have inherent limitations — they reflect information available at the time of the check and may not capture subsequent events or information not in accessible databases.</Highlight>
        <P>ServiceConnect does not guarantee, warrant, or represent that any provider is safe, trustworthy, or suitable for any particular purpose beyond what their verified credentials indicate. Background check results are one factor in provider approval and do not constitute an endorsement or guarantee of provider conduct.</P>
        <P><strong className="text-white">You assume full responsibility</strong> for allowing any third party into your property. ServiceConnect strongly recommends you are present during any service call, secure valuables, and do not leave providers unattended with sensitive areas of your property unless comfortable doing so.</P>
        <Warning>IN THE EVENT OF ANY INCIDENT — INCLUDING BUT NOT LIMITED TO THEFT, PROPERTY DAMAGE, PERSONAL INJURY, OR ANY OTHER HARMFUL OCCURRENCE INVOLVING A SERVICE PROVIDER — SERVICECONNECT'S LIABILITY IS LIMITED AS DESCRIBED IN SECTION 8 OF THE GENERAL TERMS. SERVICECONNECT IS NOT RESPONSIBLE FOR THE ACTIONS OF INDEPENDENT CONTRACTORS ON ITS PLATFORM BEYOND WHAT IS EXPRESSLY STATED HEREIN.</Warning>
      </Section>
      <Section title="C-7. Property Access & Safety">
        <P>By scheduling a service, you represent that you have the legal authority to grant access to the property at which services will be performed. You agree to provide a safe working environment for the service provider and to disclose any known hazards. ServiceConnect is not responsible for injuries to providers resulting from undisclosed property hazards.</P>
      </Section>
      <Section title="C-8. Cancellations & No-Shows">
        <P>You may cancel a pending job at no charge before a provider accepts it. Once a provider has accepted and is en route, a cancellation fee may apply as disclosed at time of cancellation.</P>
        <P>If a provider fails to arrive without notice, you may cancel the job at no charge and ServiceConnect will attempt to re-dispatch another available provider.</P>
      </Section>
      <Section title="C-9. Off-Platform Solicitation by Providers">
        <Warning>If a service provider solicits you to pay for services outside of the ServiceConnect platform — by cash, Venmo, Zelle, or any other payment method not processed through ServiceConnect — you should DECLINE and report it immediately to {CONTACT_EMAIL}. Accepting off-platform payment arrangements (a) voids any escrow protections, (b) voids any dispute resolution rights, and (c) may result in the provider's removal from the platform. ServiceConnect is not responsible for any services paid for or arranged outside the platform.</Warning>
      </Section>
      <Section title="C-10. Reviews & Ratings">
        <P>You may submit a rating and review after job completion. Reviews must be truthful, based on your genuine experience, and comply with our content guidelines. ServiceConnect reserves the right to remove reviews that are fraudulent, defamatory, or in violation of these Terms. Submitting a false negative review to extort a refund or other benefit is a violation of these Terms and may result in account termination.</P>
      </Section>
    </div>
  )
}

function TechTerms() {
  return (
    <div className="space-y-3">
      <Section title="T-1. Independent Contractor Status" defaultOpen>
        <Highlight>You are an independent contractor, NOT an employee of ServiceConnect. Nothing in these Terms or your use of the Platform creates an employment relationship, partnership, joint venture, agency, franchise, or sales representative relationship between you and ServiceConnect.</Highlight>
        <P>As an independent contractor, you are solely responsible for: determining your own schedule and work hours; providing your own tools, equipment, and vehicle; paying all applicable taxes (federal, state, and local) on income earned through the Platform; maintaining your own insurance coverage; and complying with all applicable laws and licensing requirements in the jurisdiction(s) where you work.</P>
      </Section>
      <Section title="T-2. Eligibility & Onboarding Requirements">
        <P>To become an approved provider on ServiceConnect, you must:</P>
        <UL items={[
          'Be at least 18 years of age and legally authorized to work in the United States.',
          'Hold all required state and local licenses for the services you intend to provide.',
          'Possess current EPA 608 certification (for HVAC work involving refrigerants).',
          'Pass a third-party criminal background check and motor vehicle record check.',
          'Provide a valid IRS Form W-9 for tax reporting purposes.',
          'Maintain general liability insurance with minimum coverage of $1,000,000 per occurrence.',
          'Provide proof of a valid driver\'s license and, if applicable, a roadworthy vehicle.',
        ]} />
        <P>ServiceConnect reserves the right to deny or revoke approval at any time in its sole discretion. Approval does not guarantee a minimum number of jobs or income.</P>
      </Section>
      <Section title="T-3. Background Checks — Limitations & Your Obligations">
        <P>By submitting an application, you consent to a comprehensive background screening that may include criminal history, sex offender registry, motor vehicle records, and identity verification. You represent that all information provided is accurate and complete.</P>
        <P>You are required to notify ServiceConnect within 48 hours if you are: arrested, charged, or convicted of any crime; your professional license is suspended, revoked, or placed on probation; your insurance lapses or is cancelled; or any material change occurs that would affect your eligibility.</P>
        <P>Failure to disclose material changes may result in immediate suspension and potential legal action.</P>
      </Section>
      <Section title="T-4. Job Acceptance & Conduct Standards">
        <H>Job Acceptance</H>
        <P>Available jobs are broadcast to all eligible providers simultaneously. Claiming a job creates a binding commitment to complete that job at the agreed price and tier. Repeatedly claiming and canceling jobs may result in suspension.</P>
        <H>Professional Standards</H>
        <UL items={[
          'Arrive at the job site within the ETA communicated to the customer.',
          'Identify yourself by name and show your ServiceConnect provider ID upon arrival.',
          'Perform work in a professional, workmanlike manner consistent with industry standards.',
          'Keep the work area clean and secure throughout the job.',
          'Not consume alcohol or any controlled substances before or during a job.',
          'Treat customers with respect and courtesy at all times.',
          'Complete and submit job completion photos through the app before marking a job done.',
        ]} />
      </Section>
      <Section title="T-5. Prohibition on Off-Platform Solicitation — CRITICAL">
        <Warning>OFF-PLATFORM SOLICITATION IS A SERIOUS VIOLATION AND WILL RESULT IN IMMEDIATE PERMANENT REMOVAL FROM THE PLATFORM.</Warning>
        <P>You are strictly prohibited from:</P>
        <UL items={[
          'Soliciting, accepting, or encouraging payment from a customer through any method not processed by ServiceConnect (including but not limited to cash, Venmo, Zelle, PayPal, check, or verbal agreement for future work).',
          'Providing your personal contact information (phone, email, social media) to customers for the purpose of arranging future work outside the platform.',
          'Re-contacting a customer obtained through the platform for services not arranged through the platform, for a period of 24 months from last platform contact.',
          'Asking customers to recommend you directly to others for off-platform work.',
        ]} />
        <P>Violations may result in: immediate permanent account termination; forfeiture of any pending earnings; civil liability for liquidated damages of $5,000 per violation plus ServiceConnect's lost platform fees; and referral to applicable licensing boards.</P>
        <P>By using the Platform, you acknowledge this restriction and agree it is reasonable given ServiceConnect's investment in customer acquisition and the reasonable business interests it protects.</P>
      </Section>
      <Section title="T-6. Pricing, Earnings & Fees">
        <H>Platform Fees</H>
        <P>ServiceConnect deducts a platform fee from each job based on your subscription tier (Standard: 15%, Pro: 11%, Elite: 8%). The net payout amount is displayed before you claim any job. By claiming a job, you agree to the displayed net payout.</P>
        <H>Payouts</H>
        <P>Payouts are processed via ACH direct deposit following customer payment confirmation or the expiration of the customer's 72-hour confirmation window. ServiceConnect is not responsible for bank processing delays. Payout schedules may change with 7 days' notice.</P>
        <H>Disputed Jobs</H>
        <P>If a customer disputes a job, payouts for that job may be held pending resolution. ServiceConnect will notify you promptly and give you the opportunity to submit evidence. Do not contact customers directly regarding disputes — all dispute communication must go through ServiceConnect.</P>
      </Section>
      <Section title="T-7. Taxes & Tax Reporting">
        <P>You are solely responsible for all tax obligations arising from income earned through the Platform. ServiceConnect will issue a Form 1099-NEC for total Platform earnings exceeding $600 in a calendar year. You are responsible for paying all federal, state, and local income taxes, self-employment taxes, and any other applicable taxes.</P>
        <P>ServiceConnect strongly recommends consulting a qualified tax professional. The Platform's Tax Center provides estimated quarterly tax calculations as a convenience tool only — these are estimates and not tax advice.</P>
      </Section>
      <Section title="T-8. Customer Property & Liability">
        <P>You are responsible for any damage caused to a customer's property during the performance of services. You must maintain general liability insurance sufficient to cover such claims. ServiceConnect is not liable for property damage caused by providers. By accepting a job, you acknowledge sole responsibility for your workmanship and any incidental damage.</P>
        <P>In the event of a property damage claim, you must: notify ServiceConnect within 24 hours; document the damage with photos; and cooperate with any insurance claim or dispute process.</P>
      </Section>
      <Section title="T-9. Ratings, Deactivation & Appeals">
        <P>ServiceConnect maintains quality standards for all providers. Providers with an average rating below 4.0 over their last 20 jobs, or who accumulate excessive complaints, may be placed on probation or deactivated. You will receive notice and an opportunity to respond before permanent deactivation for conduct violations (except in cases of fraud, safety violations, or off-platform solicitation, which may result in immediate deactivation).</P>
      </Section>
      <Section title="T-10. Safety & Emergency Situations">
        <P>If you encounter a safety emergency at a job site (medical emergency, dangerous conditions, threatening behavior), call 911 immediately, remove yourself from danger, and notify ServiceConnect as soon as it is safe to do so. Do not place yourself in danger to complete a job.</P>
      </Section>
    </div>
  )
}

function ContractorTerms() {
  return (
    <div className="space-y-3">
      <Section title="B-1. Contractor Program Overview" defaultOpen>
        <P>The ServiceConnect Contractor Program allows licensed HVAC contracting businesses ("Contractor Partners") to participate in the ServiceConnect marketplace through referral arrangements, co-branded advertising, and lead generation. Participation is subject to approval and execution of a separate Contractor Partner Agreement in addition to these Terms.</P>
      </Section>
      <Section title="B-2. Eligibility Requirements">
        <P>To participate in the Contractor Program, your business must:</P>
        <UL items={[
          'Be a properly licensed HVAC contractor in the state(s) where you operate.',
          'Maintain general liability insurance of at least $1,000,000 per occurrence / $2,000,000 aggregate.',
          'Maintain workers\' compensation insurance as required by applicable state law.',
          'Have no outstanding disciplinary actions from applicable licensing boards.',
          'Agree to ServiceConnect\'s Contractor Code of Conduct.',
          'Pass a business verification screening.',
        ]} />
      </Section>
      <Section title="B-3. Subscription Tiers & Fees">
        <P>Contractor participation is available on three tiers: Free (referral-only at 10% referral fee per converted job), Verified ($99/month, 7% referral fee, platform badge and listing), and Featured ($499/month, 5% referral fee, homepage placement and premium ad slots). All subscription fees are non-refundable.</P>
        <P>ServiceConnect reserves the right to modify tier pricing with 30 days' written notice. Continued participation after price changes constitutes acceptance.</P>
      </Section>
      <Section title="B-4. Lead Quality & Referral Terms">
        <P>Leads provided through ServiceConnect are generated through customer service requests. ServiceConnect makes no guarantee regarding lead quality, conversion rate, or total lead volume. A "converted job" for referral fee purposes means a job completed and paid on the Platform that originated from a referral attributed to your business.</P>
        <P>Referral attribution lasts for 30 days. If a referred customer returns to the Platform after 30 days, the referral attribution expires.</P>
      </Section>
      <Section title="B-5. Advertising & Brand Standards">
        <P>Featured and Verified Contractors may run co-branded advertising on the Platform subject to ServiceConnect's Advertising Guidelines. All ad content must be truthful, not misleading, and comply with applicable FTC guidelines. ServiceConnect reserves the right to reject or remove any ad content at its sole discretion.</P>
        <P>You may not use ServiceConnect's name, logo, or trademarks in your own advertising or marketing materials without prior written approval from ServiceConnect.</P>
      </Section>
      <Section title="B-6. Prohibition on Poaching Platform Users">
        <Warning>Contractor Partners may not solicit, recruit, or incentivize ServiceConnect-registered individual technicians to leave the Platform or perform work exclusively for the Contractor Partner's business outside the Platform. Violation of this provision may result in immediate termination of the Contractor Partner Agreement and damages.</Warning>
      </Section>
      <Section title="B-7. Non-Circumvention">
        <P>Contractor Partners are prohibited from encouraging customers obtained through the ServiceConnect Platform to engage their services directly (outside the Platform) for a period of 12 months from the initial customer referral. Violations are subject to liquidated damages equal to 3x the estimated lifetime value of diverted revenue plus reasonable legal fees.</P>
      </Section>
      <Section title="B-8. Data & Lead Confidentiality">
        <P>Customer data, contact information, and lead data provided through the Platform are confidential and may only be used to facilitate services through the Platform. You may not compile, sell, transfer, or otherwise exploit customer data for purposes beyond fulfilling referred services. All customer data must be handled in compliance with applicable privacy laws.</P>
      </Section>
      <Section title="B-9. Termination">
        <P>Either party may terminate the Contractor Partner Agreement with 30 days' written notice. ServiceConnect may terminate immediately for material breach, including but not limited to non-circumvention violations, data misuse, insurance lapses, or loss of business licensure. Upon termination, your listing, ad placements, and referral links will be removed.</P>
      </Section>
    </div>
  )
}

function LendingTerms() {
  return (
    <div className="space-y-3">
      <Section title="L-1. Lending Partner Program Overview" defaultOpen>
        <P>ServiceConnect's Lending Partner Program allows licensed financial institutions and registered lenders ("Lending Partners") to offer financing products to ServiceConnect customers through the Platform. Participation requires execution of a separate Lending Partner Agreement and compliance with all applicable federal and state lending laws.</P>
      </Section>
      <Section title="L-2. Regulatory Compliance">
        <P>Lending Partners are solely responsible for compliance with all applicable laws and regulations governing their lending activities, including but not limited to:</P>
        <UL items={[
          'Truth in Lending Act (TILA) and Regulation Z',
          'Equal Credit Opportunity Act (ECOA) and Regulation B',
          'Fair Credit Reporting Act (FCRA)',
          'Gramm-Leach-Bliley Act (GLBA)',
          'State consumer lending and usury laws in all applicable jurisdictions',
          'Consumer Financial Protection Bureau (CFPB) regulations',
        ]} />
        <P>ServiceConnect provides a technology referral channel only and does not make credit decisions, originate loans, service loans, or hold any banking or lending license. ServiceConnect is not a creditor, broker, or financial institution as defined under applicable law.</P>
      </Section>
      <Section title="L-3. Referral Arrangement">
        <P>ServiceConnect refers interested customers to Lending Partners through in-app placements and marketing. A "referral" occurs when a customer clicks through to the Lending Partner's application interface. ServiceConnect receives a referral fee as negotiated in the Lending Partner Agreement only upon successful loan origination. ServiceConnect does not receive fees based on loan terms, interest rates, or credit decisions.</P>
        <Highlight>ServiceConnect does not influence, direct, or have access to credit decisions made by Lending Partners. All credit decisions are made independently by the Lending Partner in accordance with their underwriting criteria.</Highlight>
      </Section>
      <Section title="L-4. Disclosure Requirements">
        <P>Lending Partners must ensure all required loan disclosures are presented to customers at appropriate times in the application flow. Lending Partners are responsible for providing customers with all legally required information about loan terms, fees, APR, penalties, and rights prior to loan consummation.</P>
        <P>Any advertisement of financing terms on the Platform (e.g., "0% APR," "No payments for 12 months") must comply with applicable advertising disclosure requirements and may not be misleading.</P>
      </Section>
      <Section title="L-5. Customer Data & Privacy">
        <P>Lending Partners may only collect customer data necessary for loan application and servicing purposes. Customer data obtained through the Platform may not be used for cross-selling unrelated financial products without explicit customer consent. All data handling must comply with GLBA, applicable state privacy laws, and ServiceConnect's Data Sharing Addendum.</P>
      </Section>
      <Section title="L-6. Indemnification by Lending Partner">
        <P>Lending Partners agree to indemnify and hold harmless ServiceConnect from any claims, losses, penalties, or regulatory actions arising from the Lending Partner's lending activities, regulatory non-compliance, or misuse of customer data obtained through the Platform.</P>
      </Section>
      <Section title="L-7. Prohibition on Unauthorized Outreach">
        <P>Lending Partners may not use customer contact information obtained through ServiceConnect referrals to market products or services unrelated to the customer's original financing inquiry without the customer's explicit opt-in consent obtained at the time of application.</P>
      </Section>
      <Section title="L-8. Advertising Standards">
        <P>All marketing materials displayed on the Platform must be approved by ServiceConnect prior to publication. ServiceConnect reserves the right to reject or remove materials that are misleading, non-compliant, or inconsistent with the Platform's brand standards. Lending Partners are responsible for ensuring all disclosures required by applicable law appear in all marketing materials.</P>
      </Section>
    </div>
  )
}

// ── TABS CONFIG ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',     label: 'General Terms',     icon: FileText,   short: 'General',     content: <GeneralTerms /> },
  { id: 'customer',    label: 'Customer Terms',     icon: User,       short: 'Customers',   content: <CustomerTerms /> },
  { id: 'tech',        label: 'Technician Terms',   icon: Wrench,     short: 'Technicians', content: <TechTerms /> },
  { id: 'contractor',  label: 'Contractor Terms',   icon: Building2,  short: 'Contractors', content: <ContractorTerms /> },
  { id: 'lending',     label: 'Lending Partner Terms', icon: DollarSign, short: 'Lenders',  content: <LendingTerms /> },
]

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function TermsOfService() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    return TABS.find(t => t.id === tab) ? tab : 'general'
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const active = TABS.find(t => t.id === activeTab)

  return (
    <div className="min-h-screen bg-surface-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-surface-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-surface-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="h-5 w-px bg-white/10" />
            <Logo size="sm" />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-surface-500 text-xs">
            <Shield size={13} className="text-brand-400" />
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-blue mb-4 text-sm px-4 py-1.5">
            <Shield size={14} /> Terms of Service
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">ServiceConnect Terms of Service</h1>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully. They govern your use of the ServiceConnect platform and vary by your role. Select your category below.
          </p>
          <p className="text-surface-500 text-sm mt-3">Effective Date: {LAST_UPDATED} · {COMPANY}</p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-8 scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'bg-surface-800 text-surface-400 border border-white/10 hover:text-white hover:bg-surface-700'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            )
          })}
        </div>

        {/* Quick-jump notice */}
        <div className="flex items-start gap-3 px-4 py-3 bg-surface-900 border border-white/10 rounded-xl mb-6">
          <Shield size={16} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-surface-400 text-sm leading-relaxed">
            <strong className="text-white">You are viewing: {active?.label}.</strong>{' '}
            {activeTab === 'general' && 'These terms apply to all users of the Platform. All role-specific terms below are in addition to these General Terms.'}
            {activeTab === 'customer' && 'These terms apply to homeowners and customers booking services through the Platform. They supplement the General Terms above.'}
            {activeTab === 'tech' && 'These terms apply to independent HVAC technicians and service providers on the Platform. They supplement the General Terms above.'}
            {activeTab === 'contractor' && 'These terms apply to HVAC contracting businesses participating in the ServiceConnect Contractor Partner Program.'}
            {activeTab === 'lending' && 'These terms apply to financial institutions and registered lenders participating in the ServiceConnect Lending Partner Program.'}
          </p>
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {active?.content}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 card bg-gradient-to-br from-brand-900/40 to-surface-900 border-brand-500/20 text-center py-8">
          <p className="text-white font-bold mb-2">Questions about these Terms?</p>
          <p className="text-surface-400 text-sm mb-4">Our legal team is available to clarify any provisions.</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn-primary inline-flex py-2.5 px-6 text-sm"
          >
            Contact Legal Team
          </a>
          <p className="text-surface-600 text-xs mt-4">{CONTACT_EMAIL} · {COMPANY} · Rockville, MD 20850</p>
        </div>
      </div>
    </div>
  )
}
