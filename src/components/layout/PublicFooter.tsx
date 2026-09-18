import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { useAuth } from '@/hooks/useAuth'

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/rewards', label: 'Rewards' },
      { to: '/help', label: 'Help Center' },
      { to: 'login', label: 'Member Portal' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/help', label: 'Careers' },
      { to: '/about', label: 'Press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/help', label: 'Terms of Service' },
      { to: '/help', label: 'Privacy Policy' },
      { to: '/help', label: 'Cookie Policy' },
      { to: '/help', label: 'Compliance' },
    ],
  },
]

export function PublicFooter() {
  const { user } = useAuth()

  return (
    <footer className="border-t border-white/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Logo variant="footer" to="/" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-cream/70">
            Share your opinions and earn rewards with a trusted consumer research platform built for privacy, fairness, and real payouts.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to === 'login' ? (
                    user ? (
                      <Link to="/dashboard" className="text-sm text-cream/75 transition-colors hover:text-white">
                        Dashboard
                      </Link>
                    ) : (
                      <Link to="/login" className="text-sm text-cream/75 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )
                  ) : (
                    <Link to={link.to} className="text-sm text-cream/75 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Applause One. All rights reserved.</p>
          <p>Trusted research. Protected privacy. Real rewards.</p>
        </div>
      </div>
    </footer>
  )
}
