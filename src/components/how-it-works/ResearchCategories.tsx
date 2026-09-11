import { Briefcase, HeartPulse, ShoppingBag, Stethoscope } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { joinIncentive } from '@/config/brand'
import { researchCategories } from '@/content/howItWorks'
import { useMotionConfig, easePremium } from '@/lib/motion'
import { cn } from '@/lib/utils'

function CategoryPanel({
  badge,
  title,
  copy,
  topicsLabel,
  topics,
  timeLabel,
  time,
  range,
  rangeHint,
  cta,
  icon: Icon,
  className,
}: {
  badge: string
  title: string
  copy: string
  topicsLabel: string
  topics: string
  timeLabel: string
  time: string
  range: string
  rangeHint: string
  cta: string
  icon: typeof ShoppingBag
  className?: string
}) {
  return (
    <motion.article
      className={cn(
        'rounded-[1.7rem] border border-line bg-white p-6 shadow-card sm:p-8',
        'transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lift',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-teal-soft text-teal">
          <Icon className="size-5" />
        </span>
        <Badge tone="default">{badge}</Badge>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
        <div>
          <h3 className="font-display text-2xl text-ink sm:text-3xl">{title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">{copy}</p>
          <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase">{topicsLabel}</p>
          <p className="mt-1 text-sm text-ink-soft">{topics}</p>
          <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted uppercase">{timeLabel}</p>
          <p className="mt-1 text-sm text-ink-soft">{time}</p>
        </div>
        <div className="grid gap-3">
          <div className="rounded-2xl bg-teal px-5 py-4 text-center text-white">
            <p className="font-display text-3xl">{range}</p>
            <p className="mt-1 text-xs text-white/75">{rangeHint}</p>
          </div>
          <Button asChild className="w-full">
            <Link to="/join">{cta}</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export function ResearchCategories() {
  const { duration, reduce } = useMotionConfig()
  const { consumer, professional, healthcare, multi } = researchCategories

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow={researchCategories.eyebrow}
            title={
              <>
                {researchCategories.titleLead}{' '}
                <span className="text-teal">{researchCategories.titleAccent}</span>
              </>
            }
            description={researchCategories.description}
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration, ease: easePremium }}
          >
            <CategoryPanel {...consumer} icon={ShoppingBag} />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration, delay: reduce ? 0 : 0.06, ease: easePremium }}
          >
            <CategoryPanel {...professional} icon={Briefcase} />
          </motion.div>

          <p className="pt-4 text-center">
            <Badge tone="success">{researchCategories.healthcareEyebrow}</Badge>
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            {healthcare.map((item, index) => (
              <motion.article
                key={item.title}
                className="flex h-full flex-col rounded-[1.7rem] border border-line bg-white p-6 shadow-card transition-transform duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lift sm:p-8"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration, delay: reduce ? 0 : index * 0.08, ease: easePremium }}
              >
                <span className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
                  {index === 0 ? <HeartPulse className="size-6" /> : <Stethoscope className="size-6" />}
                </span>
                <h3 className="font-display mt-5 text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-ink-soft">{item.copy}</p>
                <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-muted uppercase">{item.topicsLabel}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.topics}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Duration</dt>
                    <dd className="mt-1 font-medium text-ink">{item.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Frequency</dt>
                    <dd className="mt-1 font-medium text-ink">{item.frequency}</dd>
                  </div>
                </dl>
                <div className="mt-5 rounded-2xl bg-teal px-5 py-4 text-center text-white">
                  <p className="font-display text-3xl">{item.range}</p>
                  <p className="mt-1 text-xs text-white/75">{item.rangeHint}</p>
                </div>
                <Button asChild className="mt-3 w-full">
                  <Link to="/join">{item.cta}</Link>
                </Button>
              </motion.article>
            ))}
          </div>

          <motion.article
            className="rounded-[1.7rem] border border-line bg-cream px-6 py-10 text-center shadow-card sm:px-10"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration, ease: easePremium }}
          >
            <h3 className="font-display text-2xl text-ink sm:text-3xl">{multi.title}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-soft">{multi.copy}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {multi.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-white px-4 py-2 text-sm text-teal shadow-soft">
                  {chip}
                </span>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link to="/join">{multi.cta}</Link>
            </Button>
            <p className="mx-auto mt-4 max-w-lg text-xs leading-5 text-muted">{joinIncentive.disclaimer}</p>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
