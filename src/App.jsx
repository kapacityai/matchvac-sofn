import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Website from './pages/Website'
import LoginPage from './pages/LoginPage'
import ComfortConnect from './pages/ComfortConnect'
import FinancingPage from './pages/FinancingPage'
import ContractorsPage from './pages/ContractorsPage'

import CustomerHome from './pages/customer/CustomerHome'
import ServiceRequest from './pages/customer/ServiceRequest'
import TrackJob from './pages/customer/TrackJob'
import Store from './pages/customer/Store'
import CustomerJobs from './pages/customer/CustomerJobs'
import CustomerProfile from './pages/customer/CustomerProfile'

import TechDashboard from './pages/tech/TechDashboard'
import AvailableJobs from './pages/tech/AvailableJobs'
import TechMyJobs from './pages/tech/TechMyJobs'
import TechEarnings from './pages/tech/TechEarnings'
import TechSubscription from './pages/tech/TechSubscription'
import TaxCenter from './pages/tech/TaxCenter'
import TechReviews from './pages/tech/TechReviews'
import TechDocuments from './pages/tech/TechDocuments'

import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminJobs from './pages/admin/AdminJobs'
import AdminReports from './pages/admin/AdminReports'
import AdminAds from './pages/admin/AdminAds'
import AdminInventory from './pages/admin/AdminInventory'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminSettings from './pages/admin/AdminSettings'

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
  const home = user ? `/${user.role}` : null

  // ── Not logged in: public routes only ───────────────────────────────────
  if (!user) {
    return (
      <Routes>
        <Route path="/"                element={<Website />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/comfort-connect" element={<ComfortConnect />} />
        <Route path="/financing"       element={<FinancingPage />} />
        <Route path="/contractors"     element={<ContractorsPage />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // ── Logged in: app routes ────────────────────────────────────────────────
  return (
    <AppShell>
      <Routes>
        <Route path="/"                element={<Navigate to={home} replace />} />
        <Route path="/login"           element={<Navigate to={home} replace />} />
        <Route path="/comfort-connect" element={<ComfortConnect />} />
        <Route path="/financing"       element={<FinancingPage />} />
        <Route path="/contractors"     element={<ContractorsPage />} />

        {/* Customer */}
        <Route path="/customer"         element={user.role==='customer' ? <CustomerHome />   : <Navigate to={home} replace />} />
        <Route path="/customer/request" element={user.role==='customer' ? <ServiceRequest /> : <Navigate to={home} replace />} />
        <Route path="/customer/track"   element={user.role==='customer' ? <TrackJob />       : <Navigate to={home} replace />} />
        <Route path="/customer/store"   element={user.role==='customer' ? <Store />          : <Navigate to={home} replace />} />
        <Route path="/customer/jobs"    element={user.role==='customer' ? <CustomerJobs />   : <Navigate to={home} replace />} />
        <Route path="/customer/reviews" element={user.role==='customer' ? <CustomerJobs />     : <Navigate to={home} replace />} />
        <Route path="/customer/billing" element={user.role==='customer' ? <CustomerProfile /> : <Navigate to={home} replace />} />
        <Route path="/customer/profile" element={user.role==='customer' ? <CustomerProfile /> : <Navigate to={home} replace />} />

        {/* Tech */}
        <Route path="/tech"               element={user.role==='tech' ? <TechDashboard />   : <Navigate to={home} replace />} />
        <Route path="/tech/jobs"          element={user.role==='tech' ? <AvailableJobs />   : <Navigate to={home} replace />} />
        <Route path="/tech/myjobs"        element={user.role==='tech' ? <TechMyJobs />      : <Navigate to={home} replace />} />
        <Route path="/tech/earnings"      element={user.role==='tech' ? <TechEarnings />    : <Navigate to={home} replace />} />
        <Route path="/tech/subscription"  element={user.role==='tech' ? <TechSubscription />: <Navigate to={home} replace />} />
        <Route path="/tech/tax"           element={user.role==='tech' ? <TaxCenter />       : <Navigate to={home} replace />} />
        <Route path="/tech/reviews"       element={user.role==='tech' ? <TechReviews />    : <Navigate to={home} replace />} />
        <Route path="/tech/docs"          element={user.role==='tech' ? <TechDocuments />  : <Navigate to={home} replace />} />

        {/* Admin */}
        <Route path="/admin"               element={user.role==='admin' ? <AdminOverview />  : <Navigate to={home} replace />} />
        <Route path="/admin/users"         element={user.role==='admin' ? <AdminUsers />     : <Navigate to={home} replace />} />
        <Route path="/admin/jobs"          element={user.role==='admin' ? <AdminJobs />      : <Navigate to={home} replace />} />
        <Route path="/admin/reports"       element={user.role==='admin' ? <AdminReports />   : <Navigate to={home} replace />} />
        <Route path="/admin/ads"           element={user.role==='admin' ? <AdminAds />       : <Navigate to={home} replace />} />
        <Route path="/admin/inventory"     element={user.role==='admin' ? <AdminInventory /> : <Navigate to={home} replace />} />
        <Route path="/admin/notifications" element={user.role==='admin' ? <AdminNotifications /> : <Navigate to={home} replace />} />
        <Route path="/admin/settings"      element={user.role==='admin' ? <AdminSettings />     : <Navigate to={home} replace />} />

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
