import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavItem } from '@/components/layout/NavItem'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { publicNav } from '@/config/brand'
import { useAuth } from '@/hooks/useAuth'
import { useMotionConfig } from '@/lib/motion'

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { duration } = useMotionConfig()

  function handleLogin() {
    setOpen(false)
    navigate(user ? '/panelist/dashboard' : '/login')
  }

  function handleJoin() {
    setOpen(false)
    navigate(user ? '/panelist/dashboard' : '/join')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {publicNav.map((link) => (
            <NavItem key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavItem>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" type="button" onClick={handleLogin}>
            Login
          </Button>
          <Button type="button" onClick={handleJoin}>
            Join Now
          </Button>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-line bg-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
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
              {publicNav.map((link) => (
                <NavItem key={link.to} to={link.to} end={link.to === '/'} mobile onClick={() => setOpen(false)}>
                  {link.label}
                </NavItem>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={handleLogin}>
                  Login
                </Button>
                <Button type="button" onClick={handleJoin}>
                  Join Now
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
