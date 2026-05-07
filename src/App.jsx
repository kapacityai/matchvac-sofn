import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'

// Customer pages
import CustomerHome from './pages/customer/CustomerHome'
import ServiceRequest from './pages/customer/ServiceRequest'
import TrackJob from './pages/customer/TrackJob'
import Store from './pages/customer/Store'
import CustomerJobs from './pages/customer/CustomerJobs'

// Tech pages
import TechDashboard from './pages/tech/TechDashboard'
import AvailableJobs from './pages/tech/AvailableJobs'
import TechMyJobs from './pages/tech/TechMyJobs'
import TechEarnings from './pages/tech/TechEarnings'
import TaxCenter from './pages/tech/TaxCenter'

// Admin pages
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobs from './pages/admin/AdminJobs'
import AdminReports from './pages/admin/AdminReports'
import AdminAds from './pages/admin/AdminAds'
import AdminInventory from './pages/admin/AdminInventory'

function ProtectedLayout({ allowedRole, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />
  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />

      {/* Customer */}
      <Route path="/customer" element={<ProtectedLayout allowedRole="customer"><CustomerHome /></ProtectedLayout>} />
      <Route path="/customer/request" element={<ProtectedLayout allowedRole="customer"><ServiceRequest /></ProtectedLayout>} />
      <Route path="/customer/track" element={<ProtectedLayout allowedRole="customer"><TrackJob /></ProtectedLayout>} />
      <Route path="/customer/store" element={<ProtectedLayout allowedRole="customer"><Store /></ProtectedLayout>} />
      <Route path="/customer/jobs" element={<ProtectedLayout allowedRole="customer"><CustomerJobs /></ProtectedLayout>} />
      <Route path="/customer/reviews" element={<ProtectedLayout allowedRole="customer"><CustomerJobs /></ProtectedLayout>} />
      <Route path="/customer/billing" element={<ProtectedLayout allowedRole="customer"><CustomerJobs /></ProtectedLayout>} />

      {/* Tech */}
      <Route path="/tech" element={<ProtectedLayout allowedRole="tech"><TechDashboard /></ProtectedLayout>} />
      <Route path="/tech/jobs" element={<ProtectedLayout allowedRole="tech"><AvailableJobs /></ProtectedLayout>} />
      <Route path="/tech/myjobs" element={<ProtectedLayout allowedRole="tech"><TechMyJobs /></ProtectedLayout>} />
      <Route path="/tech/earnings" element={<ProtectedLayout allowedRole="tech"><TechEarnings /></ProtectedLayout>} />
      <Route path="/tech/tax" element={<ProtectedLayout allowedRole="tech"><TaxCenter /></ProtectedLayout>} />
      <Route path="/tech/reviews" element={<ProtectedLayout allowedRole="tech"><TechDashboard /></ProtectedLayout>} />
      <Route path="/tech/docs" element={<ProtectedLayout allowedRole="tech"><TechDashboard /></ProtectedLayout>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedLayout allowedRole="admin"><AdminOverview /></ProtectedLayout>} />
      <Route path="/admin/users" element={<ProtectedLayout allowedRole="admin"><AdminUsers /></ProtectedLayout>} />
      <Route path="/admin/jobs" element={<ProtectedLayout allowedRole="admin"><AdminJobs /></ProtectedLayout>} />
      <Route path="/admin/reports" element={<ProtectedLayout allowedRole="admin"><AdminReports /></ProtectedLayout>} />
      <Route path="/admin/ads" element={<ProtectedLayout allowedRole="admin"><AdminAds /></ProtectedLayout>} />
      <Route path="/admin/inventory" element={<ProtectedLayout allowedRole="admin"><AdminInventory /></ProtectedLayout>} />
      <Route path="/admin/notifications" element={<ProtectedLayout allowedRole="admin"><AdminOverview /></ProtectedLayout>} />
      <Route path="/admin/settings" element={<ProtectedLayout allowedRole="admin"><AdminOverview /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
