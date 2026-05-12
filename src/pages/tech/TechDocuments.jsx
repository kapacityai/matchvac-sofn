import React, { useState } from 'react'
import Header from '../../components/Header'
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Eye, RefreshCw, X, Shield, Download } from 'lucide-react'

const INITIAL_DOCS = [
  {
    id: 'd1',
    label: "Driver's License",
    description: 'Government-issued photo ID (front & back)',
    status: 'verified',
    uploadedDate: '2025-11-03',
    expiresDate: '2029-08-15',
    fileName: 'drivers_license_marcus_rivera.pdf',
    required: true,
  },
  {
    id: 'd2',
    label: 'W-9 Form',
    description: 'IRS W-9 for independent contractor tax reporting',
    status: 'verified',
    uploadedDate: '2025-11-03',
    expiresDate: null,
    fileName: 'w9_marcus_rivera_2025.pdf',
    required: true,
  },
  {
    id: 'd3',
    label: 'EPA 608 Certification',
    description: 'Federal certification for handling refrigerants',
    status: 'verified',
    uploadedDate: '2025-11-05',
    expiresDate: null,
    fileName: 'epa608_cert_marcus.pdf',
    required: true,
  },
  {
    id: 'd4',
    label: 'NATE Certification',
    description: 'North American Technician Excellence certification',
    status: 'verified',
    uploadedDate: '2025-11-05',
    expiresDate: '2027-06-01',
    fileName: 'nate_cert_marcus_2025.pdf',
    required: false,
  },
  {
    id: 'd5',
    label: 'Liability Insurance',
    description: 'General liability insurance — min $1M coverage',
    status: 'expiring',
    uploadedDate: '2025-03-01',
    expiresDate: '2026-06-01',
    fileName: 'insurance_cert_2025.pdf',
    required: true,
  },
  {
    id: 'd6',
    label: 'Background Check Consent',
    description: 'Authorization for background screening',
    status: 'verified',
    uploadedDate: '2025-11-01',
    expiresDate: null,
    fileName: 'background_consent.pdf',
    required: true,
  },
  {
    id: 'd7',
    label: 'Bank Account (ACH)',
    description: 'Voided check or bank letter for direct deposit',
    status: 'pending',
    uploadedDate: null,
    expiresDate: null,
    fileName: null,
    required: true,
  },
]

const statusConfig = {
  verified:  { label: 'Verified',  badge: 'badge-green',  icon: CheckCircle, color: 'text-emerald-400' },
  pending:   { label: 'Pending Review', badge: 'badge-yellow', icon: Clock, color: 'text-amber-400' },
  expiring:  { label: 'Expiring Soon', badge: 'badge-red',   icon: AlertCircle, color: 'text-rose-400' },
  missing:   { label: 'Not Uploaded', badge: 'badge-red',    icon: AlertCircle, color: 'text-rose-400' },
}

export default function TechDocuments() {
  const [docs, setDocs] = useState(INITIAL_DOCS)
  const [uploading, setUploading] = useState(null)
  const [preview, setPreview] = useState(null)

  const simulateUpload = (docId) => {
    setUploading(docId)
    setTimeout(() => {
      setDocs(d => d.map(doc => doc.id === docId
        ? { ...doc, status: 'pending', uploadedDate: new Date().toISOString().split('T')[0], fileName: `document_${docId}_upload.pdf` }
        : doc
      ))
      setUploading(null)
    }, 1800)
  }

  const verified = docs.filter(d => d.status === 'verified').length
  const total = docs.length

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Header title="My Documents" subtitle="Certifications, licenses & compliance" />

      <div className="flex-1 p-6 space-y-6 max-w-3xl">

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Verified', count: docs.filter(d => d.status === 'verified').length, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Pending', count: docs.filter(d => d.status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'Action Required', count: docs.filter(d => d.status === 'missing' || d.status === 'expiring' || (!d.uploadedDate && d.required)).length, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          ].map(s => (
            <div key={s.label} className="stat-card text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.count}</p>
              <p className="text-surface-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Expiring soon banner */}
        {docs.some(d => d.status === 'expiring') && (
          <div className="flex items-start gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <AlertCircle size={18} className="text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-rose-400 text-sm font-semibold">Action Required: Document Expiring Soon</p>
              <p className="text-rose-300/70 text-xs mt-0.5">Your Liability Insurance expires on June 1, 2026. Upload a renewed certificate to avoid job suspension.</p>
            </div>
          </div>
        )}

        {/* Account standing */}
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-surface-900 border border-emerald-500/30">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Account in Good Standing</p>
            <p className="text-surface-400 text-sm">{verified}/{total} documents verified · Background check cleared</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-400 font-bold text-lg">{Math.round((verified / total) * 100)}%</p>
            <p className="text-surface-500 text-xs">complete</p>
          </div>
        </div>

        {/* Document list */}
        <div>
          <h3 className="section-title mb-4">Document Checklist</h3>
          <div className="space-y-3">
            {docs.map(doc => {
              const sc = doc.uploadedDate ? (statusConfig[doc.status] || statusConfig.pending) : statusConfig.missing
              const StatusIcon = sc.icon
              const isUploading = uploading === doc.id
              return (
                <div key={doc.id} className={`card transition-all ${doc.status === 'expiring' ? 'border-rose-500/30 bg-rose-500/5' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.status === 'verified' ? 'bg-emerald-400/10' : doc.status === 'expiring' ? 'bg-rose-400/10' : 'bg-surface-700'}`}>
                      <FileText size={18} className={sc.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-semibold text-sm">{doc.label}</p>
                        {doc.required && <span className="badge badge-purple text-xs">Required</span>}
                        <span className={`badge ${sc.badge}`}>{sc.label}</span>
                      </div>
                      <p className="text-surface-400 text-xs">{doc.description}</p>
                      {doc.uploadedDate && (
                        <p className="text-surface-600 text-xs mt-1">
                          Uploaded: {doc.uploadedDate}
                          {doc.expiresDate && <span className={doc.status === 'expiring' ? ' · Expires: ' : ' · Valid until: '}><span className={doc.status === 'expiring' ? 'text-rose-400 font-semibold' : ''}>{doc.expiresDate}</span></span>}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.fileName && (
                        <button
                          onClick={() => setPreview(doc)}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                          title="View"
                        >
                          <Eye size={14} className="text-surface-300" />
                        </button>
                      )}
                      {(doc.status !== 'verified' || doc.status === 'expiring') && (
                        <button
                          onClick={() => simulateUpload(doc.id)}
                          disabled={isUploading}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isUploading ? 'bg-brand-500/20 text-brand-300 cursor-not-allowed' : 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20'}`}
                        >
                          {isUploading ? <><RefreshCw size={12} className="animate-spin" /> Uploading…</> : <><Upload size={12} /> Upload</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Help note */}
        <p className="text-surface-600 text-xs text-center">
          Document review typically takes 1–2 business days. Questions? Contact <span className="text-brand-400">support@serviceconnect.io</span>
        </p>
        <p className="text-surface-600 text-xs text-center">
          By maintaining your account you agree to our{' '}
          <a href="/terms?tab=tech" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Technician Terms of Service</a>
          {' '}including the off-platform solicitation policy.
        </p>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="card w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">{preview.label}</h3>
              <button onClick={() => setPreview(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <X size={16} className="text-surface-300" />
              </button>
            </div>
            <div className="rounded-xl bg-surface-800 p-8 flex flex-col items-center gap-3">
              <FileText size={40} className="text-brand-400" />
              <p className="text-white font-semibold text-sm">{preview.fileName}</p>
              <span className={`badge ${statusConfig[preview.status]?.badge}`}>{statusConfig[preview.status]?.label}</span>
              <p className="text-surface-500 text-xs">Document preview not available in demo mode</p>
            </div>
            <button className="btn-secondary w-full text-sm py-2.5">
              <Download size={15} /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
