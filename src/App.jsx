import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'

import CustomerHome from './pages/customer/CustomerHome'
import ServiceRequest from './pages/customer/ServiceRequest'
import TrackJob from './pages/customer/TrackJob'
import Store from './pages/customer/Store'
import CustomerJobs from './pages/customer/CustomerJobs'

import TechDashboard from './pages/tech/TechDashboard'
import AvailableJobs from './pages/tech/AvailableJobs'
import TechMyJobs from './pages/tech/TechMyJobs'
import TechEarnings from './pages/tech/TechEarnings'
import TaxCenter from './pages/tech/TaxCenter'

import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobs from './pages/admin/AdminJobs'
import AdminReports from './pages/admin/AdminReports'
import AdminAds from './pages/admin/AdminAds'
import AdminInventory from './pages/admin/AdminInventory'

function AppShell({ children }) {
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
  const location = useLocation()

  // Not logged in → always show login
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  // Logged in → redirect root or wrong-role paths, then show the app
  const home = `/${user.role}`

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to={home} replace />} />

        {/* Customer */}
        <Route path="/customer"         element={user.role === 'customer' ? <CustomerHome />    : <Navigate to={home} replace />} />
        <Route path="/customer/request" element={user.role === 'customer' ? <ServiceRequest />  : <Navigate to={home} replace />} />
        <Route path="/customer/track"   element={user.role === 'customer' ? <TrackJob />        : <Navigate to={home} replace />} />
        <Route path="/customer/store"   element={user.role === 'customer' ? <Store />           : <Navigate to={home} replace />} />
        <Route path="/customer/jobs"    element={user.role === 'customer' ? <CustomerJobs />    : <Navigate to={home} replace />} />
        <Route path="/customer/reviews" element={user.role === 'customer' ? <CustomerJobs />    : <Navigate to={home} replace />} />
        <Route path="/customer/billing" element={user.role === 'customer' ? <CustomerJobs />    : <Navigate to={home} replace />} />

        {/* Tech */}
        <Route path="/tech"          element={user.role === 'tech' ? <TechDashboard /> : <Navigate to={home} replace />} />
        <Route path="/tech/jobs"     element={user.role === 'tech' ? <AvailableJobs /> : <Navigate to={home} replace />} />
        <Route path="/tech/myjobs"   element={user.role === 'tech' ? <TechMyJobs />    : <Navigate to={home} replace />} />
        <Route path="/tech/earnings" element={user.role === 'tech' ? <TechEarnings />  : <Navigate to={home} replace />} />
        <Route path="/tech/tax"      element={user.role === 'tech' ? <TaxCenter />     : <Navigate to={home} replace />} />
        <Route path="/tech/reviews"  element={user.role === 'tech' ? <TechDashboard /> : <Navigate to={home} replace />} />
        <Route path="/tech/docs"     element={user.role === 'tech' ? <TechDashboard /> : <Navigate to={home} replace />} />

        {/* Admin */}
        <Route path="/admin"               element={user.role === 'admin' ? <AdminOverview />  : <Navigate to={home} replace />} />
        <Route path="/admin/users"         element={user.role === 'admin' ? <AdminUsers />     : <Navigate to={home} replace />} />
        <Route path="/admin/jobs"          element={user.role === 'admin' ? <AdminJobs />      : <Navigate to={home} replace />} />
        <Route path="/admin/reports"       element={user.role === 'admin' ? <AdminReports />   : <Navigate to={home} replace />} />
        <Route path="/admin/ads"           element={user.role === 'admin' ? <AdminAds />       : <Navigate to={home} replace />} />
        <Route path="/admin/inventory"     element={user.role === 'admin' ? <AdminInventory /> : <Navigate to={home} replace />} />
        <Route path="/admin/notifications" element={user.role === 'admin' ? <AdminOverview />  : <Navigate to={home} replace />} />
        <Route path="/admin/settings"      element={user.role === 'admin' ? <AdminOverview />  : <Navigate to={home} replace />} />

        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
