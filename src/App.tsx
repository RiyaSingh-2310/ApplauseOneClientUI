import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from '@/components/auth/RouteGuards'
import { PortalLayout } from '@/components/layout/PortalLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { AuthProvider } from '@/context/AuthContext'
import { JoinPage } from '@/pages/auth/JoinPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { VerifyPage } from '@/pages/auth/VerifyPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { DashboardPage } from '@/pages/panelist/DashboardPage'
import { ProfilePage } from '@/pages/panelist/ProfilePage'
import { ProjectsPage } from '@/pages/panelist/ProjectsPage'
import { RewardHistoryPage } from '@/pages/panelist/RewardHistoryPage'
import { RewardRequestsPage } from '@/pages/panelist/RewardRequestsPage'
import { PanelistRewardsPage } from '@/pages/panelist/RewardsPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { HelpPage } from '@/pages/public/HelpPage'
import { HomePage } from '@/pages/public/HomePage'
import { HowItWorksPage } from '@/pages/public/HowItWorksPage'
import { RewardsPage } from '@/pages/public/RewardsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<LoginPage />} />
              <Route path="/reset-password" element={<LoginPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/panelist" element={<PortalLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="rewards" element={<PanelistRewardsPage />} />
              <Route path="reward-requests" element={<RewardRequestsPage />} />
              <Route path="reward-history" element={<RewardHistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
