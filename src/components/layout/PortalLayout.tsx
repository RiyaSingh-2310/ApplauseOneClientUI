import {
  Gift,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  ClipboardList,
  UserRound,
  Wallet,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useMotionConfig } from '@/lib/motion'
import { cn, initials } from '@/lib/utils'

const nav = [
  { to: '/panelist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/panelist/projects', label: 'Assigned Projects', icon: ClipboardList },
  { to: '/panelist/rewards', label: 'Rewards', icon: Gift },
  { to: '/panelist/reward-requests', label: 'Reward Requests', icon: Wallet },
  { to: '/panelist/reward-history', label: 'Reward History', icon: History },
  { to: '/panelist/profile', label: 'Profile', icon: UserRound },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-4">
        <Logo to="/panelist/dashboard" />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Member portal">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-white hover:text-ink',
                isActive && 'bg-white text-ink shadow-soft',
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

export function PortalLayout() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const { duration } = useMotionConfig()

  return (
    <div className="portal-canvas min-h-svh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line/80 bg-cream/80 lg:block">
        <NavItems />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/70 bg-cream/90 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-line bg-white lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="portal-mobile-nav"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="lg:hidden">
              <Logo compact to="/panelist/dashboard" />
            </div>
            <p className="hidden text-sm text-muted md:block">Panelist portal</p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-medium text-ink">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-teal text-xs font-semibold text-white">
              {user ? initials(user.firstName, user.lastName) : 'AO'}
            </div>
          </div>
        </header>

        <div className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          <Outlet />
        </div>

        <nav className="sticky bottom-0 grid grid-cols-4 border-t border-line bg-cream/95 px-2 py-2 backdrop-blur-xl lg:hidden" aria-label="Quick navigation">
          {nav.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px]', isActive ? 'text-teal' : 'text-muted')
              }
            >
              <item.icon className="size-4" />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden" id="portal-mobile-nav">
            <motion.button
              type="button"
              className="absolute inset-0 bg-ink/40"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
            />
            <motion.aside
              className="relative h-full w-[min(86%,20rem)] bg-cream shadow-lift"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration }}
            >
              <button
                type="button"
                className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-muted hover:bg-white hover:text-ink"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
              <NavItems onNavigate={() => setOpen(false)} />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
