import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '@/components/auth/RouteGuards'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { legacyPanelistRedirects, paths } from '@/config/paths'
import { AuthProvider } from '@/context/AuthContext'
import { JoinPage } from '@/pages/auth/JoinPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { VerifyPage } from '@/pages/auth/VerifyPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { DashboardPage } from '@/pages/panelist/DashboardPage'
import { HistoryPage } from '@/pages/panelist/HistoryPage'
import { SettingsPage } from '@/pages/panelist/SettingsPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HelpPage } from '@/pages/public/HelpPage'
import { HomePage } from '@/pages/public/HomePage'
import { HowItWorksPage } from '@/pages/public/HowItWorksPage'
import { RewardsPage } from '@/pages/public/RewardsPage'

function LegacyPanelistRedirect() {
  const { pathname } = useLocation()
  return <Navigate to={legacyPanelistRedirects[pathname] ?? paths.dashboard} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={paths.home} element={<HomePage />} />
            <Route path={paths.howItWorks} element={<HowItWorksPage />} />
            <Route path={paths.rewards} element={<RewardsPage />} />
            <Route path={paths.help} element={<HelpPage />} />
            <Route path={paths.about} element={<AboutPage />} />
            <Route path={paths.contact} element={<ContactPage />} />
            <Route path={paths.join} element={<JoinPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify-email" element={<VerifyPage />} />
            <Route path="/verify/:token" element={<VerifyPage />} />
            <Route element={<GuestRoute />}>
              <Route path={paths.login} element={<LoginPage />} />
              <Route path="/forgot-password" element={<LoginPage />} />
              <Route path="/reset-password" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path={paths.dashboard} element={<DashboardPage />} />
              <Route path={paths.history} element={<HistoryPage />} />
              <Route path={paths.settings} element={<SettingsPage />} />
              <Route path={paths.surveys} element={<Navigate to={paths.dashboard} replace />} />
            </Route>
          </Route>

          <Route path="/panelist" element={<LegacyPanelistRedirect />} />
          <Route path="/panelist/*" element={<LegacyPanelistRedirect />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
