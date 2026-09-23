import { motion } from 'motion/react'
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Gift,
  Lock,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Timer,
  UserPlus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroStage } from '@/components/home/HeroStage'
import { RewardMethodsShowcase } from '@/components/rewards/RewardMethodsShowcase'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Button } from '@/components/ui/button'
import { joinBonuses, joinHighlights, joinIncentive, joinTopics } from '@/config/brand'
import { paths } from '@/config/paths'
import { useAuth } from '@/hooks/useAuth'
import { cardLiftClass, easePremium, stagger, useMotionConfig } from '@/lib/motion'
import { cn } from '@/lib/utils'

const benefits = [
  { title: 'Earn Rewards', copy: 'Turn completed studies into cash, gift cards, digital credit, or donations.', icon: Gift },
  { title: 'Share Your Opinion', copy: 'Help brands understand real shopping, product, and service experiences.', icon: MessageSquareHeart },
  { title: 'Flexible Participation', copy: 'Take assigned surveys when they fit your day — usually 5 to 15 minutes.', icon: Timer },
  { title: 'Trusted Research', copy: 'Every invitation is a legitimate study from Applause One research partners.', icon: Sparkles },
  { title: 'Privacy Protected', copy: 'Your profile is used to match studies, never sold as a public mailing list.', icon: ShieldCheck },
]

const steps = [
  {
    n: '01',
    flow: 'Join',
    title: 'Sign Up',
    copy: 'Create a free panelist account in a few minutes.',
    icon: UserPlus,
  },
  {
    n: '02',
    flow: 'Share your opinion',
    title: 'Complete Your Profile',
    copy: 'Tell us about your household so we can assign relevant studies.',
    icon: MessageSquareHeart,
  },
  {
    n: '03',
    flow: 'Earn points',
    title: 'Receive Assigned Surveys',
    copy: 'Open your portal to see every project assigned to you — not just email links.',
    icon: ClipboardCheck,
  },
  {
    n: '04',
    flow: 'Redeem rewards',
    title: 'Complete Surveys & Earn Rewards',
    copy: 'Finish a study, collect points, and redeem when you are ready.',
    icon: Gift,
  },
]

const trustPoints = [
  ['Profile matching', 'Demographics and shopping interests help us assign relevant projects.'],
  ['Secure access', 'Your portal uses token-based authentication and protected routes.'],
  ['Clear consent', 'Terms and privacy consent are required before an account is created.'],
] as const

const panelFigures = [
  [500, 'K+', 'Active members'],
  [50, 'K+', 'Surveys completed'],
  [100, 'K', 'Total paid out'],
  [4.9, '/5', 'Average rating'],
] as const

export function HomePage() {
  const { user } = useAuth()
  const { reduce, duration } = useMotionConfig()
  const portalTo = user ? paths.dashboard : paths.login
  const portalLabel = user ? 'Go to Dashboard' : 'Login'

  return (
    <div>
      <section className="hero-grid relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute -top-24 left-[6%] size-72 rounded-full bg-teal/10 blur-3xl" />
          <span className="absolute top-16 right-0 size-80 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: easePremium }}
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-teal uppercase">Consumer research panel</p>
            <h1 className="font-display mt-5 max-w-xl text-[2.75rem] leading-[1.02] text-balance text-ink sm:text-6xl lg:text-[4.5rem]">
              Your opinions.
              <span className="mt-1 block text-teal">Your rewards.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-ink-soft">
              Applause One invites panelists to share opinions through assigned research surveys. Complete studies on everyday products and services, then redeem points for rewards that fit you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={paths.join}>
                  Join Now
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={paths.howItWorks}>See how it works</Link>
              </Button>
            </div>
            {/* <Link
              to={portalTo}
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-teal"
            >
              {portalLabel}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link> */}
            <ul className="mt-8 flex flex-wrap gap-2 text-sm text-ink-soft">
              <li className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 shadow-soft">
                <Lock className="size-3.5 text-teal" /> Privacy protected
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 shadow-soft">
                <ShieldCheck className="size-3.5 text-teal" /> Fair reward system
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 shadow-soft">
                <BadgeCheck className="size-3.5 text-teal" /> Free to join
              </li>
            </ul>
          </motion.div>
          <HeroStage />
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Panel figures">
        <div className="grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-line/80 bg-white shadow-lift md:grid-cols-4">
          {panelFigures.map(([value, suffix, label]) => (
            <div key={label} className="border-line/80 px-5 py-7 sm:px-7 md:border-l md:first:border-l-0">
              <p className="font-display text-4xl text-ink sm:text-5xl">
                {value < 10 ? (
                  <>
                    {value}
                    {suffix}
                  </>
                ) : (
                  <>
                    <AnimatedCounter value={value} />
                    {suffix}
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Why join"
            title="A calmer way to take part in research"
            description="Applause One is built for people who want relevant studies, clear rewards, and a portal that keeps every assignment in one place."
          />
        </AnimatedSection>
        <motion.div
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6"
          variants={stagger}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration, ease: easePremium } } }}
              className={cn(
                'group rounded-[1.6rem] border border-line/80 bg-white p-6 shadow-card',
                cardLiftClass,
                index < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
              )}
            >
              <div className="mb-5 grid size-11 place-items-center rounded-2xl bg-teal-soft text-teal transition-colors duration-200 group-hover:bg-teal group-hover:text-white">
                <benefit.icon className="size-5" />
              </div>
              <h3 className="font-display text-2xl text-ink">{benefit.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink-soft">{benefit.copy}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="border-y border-line/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading eyebrow="Rewards" title="A clear reason to take part" description={joinIncentive.disclaimer} />
          </AnimatedSection>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {joinHighlights.map((item, index) => (
              <AnimatedSection key={item.label} delay={index * 0.06}>
                <article className={cn('h-full rounded-[1.6rem] border border-line bg-cream px-6 py-8', cardLiftClass)}>
                  <p className="font-display text-4xl text-teal sm:text-5xl">{item.value}</p>
                  <h3 className="mt-4 font-display text-2xl text-ink">{item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{item.hint}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to={paths.rewards}>
                Explore rewards
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionHeading
              eyebrow="How it works"
              title="Four steps from first signup to first reward"
              description="You do not have to wait for an email. Assigned surveys live in your panelist portal the moment they are ready."
            />
          </AnimatedSection>
          <div className="relative mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <span
              className="pointer-events-none absolute top-11 right-[12%] left-[12%] hidden h-px bg-linear-to-r from-transparent via-gold/70 to-transparent xl:block"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <AnimatedSection key={step.n} delay={index * 0.06} className="h-full">
                <article className={cn('flex h-full flex-col rounded-[1.6rem] border border-line/80 bg-white p-6 shadow-card', cardLiftClass)}>
                  <div className="flex items-center justify-between">
                    <span className="relative z-10 grid size-12 place-items-center rounded-full bg-ink font-display text-sm text-gold">
                      {step.n}
                    </span>
                    <step.icon className="size-5 text-teal" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-ink">{step.flow}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    <span className="font-medium text-ink">{step.title}.</span> {step.copy}
                  </p>
                </article>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button asChild variant="gold" size="lg">
              <Link to={paths.howItWorks}>Read the full process</Link>
            </Button>
          </div>
        </div>
      </section>

      <RewardMethodsShowcase />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Studies"
            title="Opinions brands actually ask for"
            description="Invitations depend on your profile and the studies that are open. These are the kinds of topics members are often asked about."
          />
        </AnimatedSection>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {joinTopics.map((topic) => (
            <li
              key={topic}
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-line/80 bg-white px-5 py-4 text-sm font-medium text-ink shadow-card',
                cardLiftClass,
              )}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line/70 bg-white">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Extras"
            title="More than a single survey payout"
            description="Bonuses are described in your account materials and can change. They are opportunities, not a guaranteed income."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {joinBonuses.map((bonus, index) => (
              <li key={bonus} className={cn('rounded-2xl border border-line bg-cream px-5 py-5', cardLiftClass)}>
                <p className="font-display text-sm text-gold-deep">0{index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-ink">{bonus}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Trust"
            title="Research should feel safe"
            description="We collect profile details only to match you with studies. Communication stays optional after the required consents, and you can review preferences any time in your profile."
          />
          <div className="grid gap-3">
            {trustPoints.map(([title, copy]) => (
              <div key={title} className={cn('rounded-2xl border border-line/80 bg-white px-5 py-4 shadow-card', cardLiftClass)}>
                <h3 className="font-medium text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-ink-soft">{copy}</p>
              </div>
            ))}
            <p className="pt-1 text-sm text-muted">
              <Link to={paths.privacyPolicy} className="font-medium text-teal underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <span className="px-2 text-line">·</span>
              <Link to={paths.termsConditions} className="font-medium text-teal underline-offset-4 hover:underline">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-cream sm:px-12"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration, ease: easePremium }}
        >
          <div className="pointer-events-none absolute -top-16 left-0 size-56 rounded-full bg-teal/25 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute right-0 -bottom-16 size-56 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Join the panel</p>
            <h2 className="font-display mt-4 text-4xl text-balance sm:text-5xl lg:text-6xl">Your opinion has value.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-cream/70">
              Join the Applause One consumer panel, complete your profile, and start receiving assigned surveys in your portal.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="gold">
                <Link to={paths.join}>Join Applause One</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-cream hover:bg-white hover:text-ink">
                <Link to={portalTo}>{portalLabel}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
