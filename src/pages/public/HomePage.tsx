import { motion } from 'motion/react'
import {
  ArrowRight,
  Gift,
  Lock,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RewardMethodsShowcase } from '@/components/rewards/RewardMethodsShowcase'
import { useAuth } from '@/hooks/useAuth'

const benefits = [
  { title: 'Earn Rewards', copy: 'Turn completed studies into cash, gift cards, digital credit, or donations.', icon: Gift },
  { title: 'Share Your Opinion', copy: 'Help brands understand real shopping, product, and service experiences.', icon: MessageSquareHeart },
  { title: 'Flexible Participation', copy: 'Take assigned surveys when they fit your day — usually 5 to 15 minutes.', icon: Timer },
  { title: 'Trusted Research', copy: 'Every invitation is a legitimate study from Applause One research partners.', icon: Sparkles },
  { title: 'Privacy Protected', copy: 'Your profile is used to match studies, never sold as a public mailing list.', icon: ShieldCheck },
]

const steps = [
  { n: '01', title: 'Sign Up', copy: 'Create a free panelist account in a few minutes.' },
  { n: '02', title: 'Complete Your Profile', copy: 'Tell us about your household so we can assign relevant studies.' },
  { n: '03', title: 'Receive Assigned Surveys', copy: 'Open your portal to see every project assigned to you — not just email links.' },
  { n: '04', title: 'Complete Surveys & Earn Rewards', copy: 'Finish a study, collect points, and redeem when you are ready.' },
]

export function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <section className="hero-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <Badge tone="gold">Consumer research panel</Badge>
            <h1 className="font-display mt-5 max-w-xl text-5xl leading-[1.05] text-ink sm:text-6xl">
              Your Opinions. Your Voice. Your Rewards.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-ink-soft">
              Applause One invites panelists to share opinions through assigned research surveys. Complete studies on everyday products and services, then redeem points for rewards that fit you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/join">
                  Join Now
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                type="button"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
              >
                Login
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
                <Lock className="size-3.5 text-teal" /> Privacy protected
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5">
                <ShieldCheck className="size-3.5 text-teal" /> Fair reward system
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-lift backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-ink p-6 text-cream">
                <p className="text-xs tracking-[0.2em] text-gold uppercase">Assigned this week</p>
                <h3 className="font-display mt-3 text-3xl">Consumer Research Study</h3>
                <p className="mt-2 text-sm text-cream/70">12 minutes · up to 180 points · due after you open it in the portal</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ['180', 'Points'],
                    ['12m', 'Typical'],
                    ['New', 'Status'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl bg-white/8 px-3 py-3">
                      <p className="font-display text-2xl">{value}</p>
                      <p className="text-[11px] text-cream/55">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gold-soft px-4 py-4">
                  <p className="text-xs text-gold-deep">Available points</p>
                  <p className="font-display text-3xl text-ink">2,450</p>
                </div>
                <div className="rounded-2xl bg-teal-soft px-4 py-4">
                  <p className="text-xs text-teal-deep">Ready to redeem</p>
                  <p className="font-display text-3xl text-ink">PayPal</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            [500, 'K+', 'Active members'],
            [50, 'K+', 'Surveys completed'],
            [100, 'K', 'Total paid out'],
            [4.9, '/5', 'Average rating'],
          ].map(([value, suffix, label]) => (
            <div key={String(label)}>
              <p className="font-display text-4xl text-ink">
                {typeof value === 'number' && value < 10 ? (
                  <>
                    {value}
                    {suffix}
                  </>
                ) : (
                  <>
                    <AnimatedCounter value={Number(value)} />
                    {suffix}
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why join"
          title="A calmer way to take part in research"
          description="Applause One is built for people who want relevant studies, clear rewards, and a portal that keeps every assignment in one place."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <benefit.icon className="size-5" />
                  </div>
                  <h3 className="font-display text-xl">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{benefit.copy}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            light
            eyebrow="How it works"
            title="Four steps from first signup to first reward"
            description="You do not have to wait for an email. Assigned surveys live in your panelist portal the moment they are ready."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="font-display text-3xl text-gold">{step.n}</p>
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-cream/70">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RewardMethodsShowcase />

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Trust"
              title="Research should feel safe"
              description="We collect profile details only to match you with studies. Communication stays optional after the required consents, and you can review preferences any time in your profile."
            />
          </div>
          <div className="grid gap-4">
            {[
              ['Profile matching', 'Demographics and shopping interests help us assign relevant projects.'],
              ['Secure access', 'Your portal uses token-based authentication and protected routes.'],
              ['Clear consent', 'Terms and privacy consent are required before an account is created.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-line bg-cream px-5 py-4">
                <h3 className="font-medium text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-teal px-8 py-14 text-center text-white">
          <h2 className="font-display text-4xl text-balance sm:text-5xl">Ready to turn your opinions into rewards?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join the Applause One consumer panel, complete your profile, and start receiving assigned surveys in your portal.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="gold">
              <Link to="/join">Join Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
