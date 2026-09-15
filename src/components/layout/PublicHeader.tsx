import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavItem } from '@/components/layout/NavItem'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { memberNav, publicNav } from '@/config/brand'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'
import { useMotionConfig } from '@/lib/motion'

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, ready } = useAuth()
  const { duration } = useMotionConfig()
  const nav = user ? memberNav : publicNav

  function closeMenu() {
    setOpen(false)
  }

  function handleLogin() {
    closeMenu()
    navigate(paths.login)
  }

  function handleJoin() {
    closeMenu()
    navigate(paths.join)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {nav.map((link) => (
            <NavItem key={`${link.to}-${link.label}`} to={link.to} end={'end' in link ? link.end : false}>
              {link.label}
            </NavItem>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {ready && user ? <ProfileMenu /> : null}
          {ready && !user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Button variant="ghost" type="button" onClick={handleLogin}>
                Login
              </Button>
              <Button type="button" onClick={handleJoin}>
                Join Now
              </Button>
            </div>
          ) : null}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink shadow-soft lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5 text-ink" strokeWidth={2.25} /> : <Menu className="size-5 text-ink" strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration }}
          >
            <div className="grid gap-1 px-4 py-4">
              {nav.map((link) => (
                <NavItem
                  key={`mobile-${link.to}-${link.label}`}
                  to={link.to}
                  end={'end' in link ? link.end : false}
                  mobile
                  onClick={closeMenu}
                >
                  {link.label}
                </NavItem>
              ))}
              {ready && !user ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button type="button" onClick={handleJoin}>
                    Join Now
                  </Button>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
