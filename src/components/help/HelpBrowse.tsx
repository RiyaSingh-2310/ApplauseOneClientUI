import {
  AlertCircle,
  CheckCircle2,
  Gem,
  PlayCircle,
  Settings,
  Smartphone,
  TrendingUp,
  Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import { HelpArticleCard } from '@/components/help/HelpArticleCard'
import { helpCategories, helpResources, helpStats, helpTutorial } from '@/content/help'
import { cardLiftClass, easePremium, useMotionConfig } from '@/lib/motion'
import { cn } from '@/lib/utils'

const categoryIcons = {
  smartphone: Smartphone,
  trending: TrendingUp,
  gem: Gem,
  settings: Settings,
}

const resourceIcons = {
  users: Users,
  alert: AlertCircle,
  check: CheckCircle2,
}

export function HelpBrowse({
  query,
  onResource,
}: {
  query: string
  onResource: (id: string) => void
}) {
  const { duration, reduce } = useMotionConfig()
  const needle = query.trim().toLowerCase()
  const categories = helpCategories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          !needle ||
          article.title.toLowerCase().includes(needle) ||
          article.copy.toLowerCase().includes(needle) ||
          category.title.toLowerCase().includes(needle),
      ),
    }))
    .filter((category) => category.articles.length > 0)

  return (
    <div>
      <div className="text-center">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Help Categories</h2>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          Browse our comprehensive help articles organized by topic.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.icon]
          return (
            <motion.section
              key={category.id}
              className="rounded-[1.6rem] border border-line bg-white p-5 shadow-card sm:p-6"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration, delay: reduce ? 0 : index * 0.05, ease: easePremium }}
            >
              <h3 className="flex items-center gap-3 font-display text-xl text-ink">
                <span className="grid size-10 place-items-center rounded-xl bg-teal-soft text-teal">
                  <Icon className="size-5" />
                </span>
                {category.title}
              </h3>
              <div className="mt-4 grid gap-1">
                {category.articles.map((article) => (
                  <HelpArticleCard key={article.title} title={article.title} copy={article.copy} icon={article.icon} />
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>

      {categories.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-soft">No help articles match that search.</p>
      ) : null}

      <div className="mt-10 grid gap-4 rounded-[1.6rem] border border-teal/15 bg-teal-soft/50 px-6 py-8 sm:grid-cols-3 sm:px-8">
        {helpStats.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-display text-3xl text-teal sm:text-4xl">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-ink">{item.label}</p>
            <p className="mt-0.5 text-xs text-muted">{item.hint}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <div className="text-center">
          <h2 className="font-display text-3xl text-ink">Additional Resources</h2>
          <p className="mt-2 text-sm text-ink-soft">Explore more ways to get help and stay informed about updates</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => onResource('tutorial')}
            className={cn(
              'group flex h-full flex-col items-center rounded-[1.6rem] border border-line bg-white p-6 text-center shadow-card',
              cardLiftClass,
            )}
          >
            <span className="relative grid h-20 w-full place-items-center overflow-hidden rounded-2xl bg-teal-soft text-teal">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255_/_0.7),transparent_55%)]" />
              <PlayCircle className="relative size-10 transition-transform duration-200 motion-safe:group-hover:scale-105" />
              <span className="sr-only">Watch tutorial</span>
            </span>
            <h3 className="mt-5 font-display text-xl text-ink">{helpTutorial.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{helpTutorial.copy}</p>
            <span className="mt-5 inline-flex h-11 items-center rounded-full bg-teal px-5 text-sm font-medium text-white">
              {helpTutorial.cta}
            </span>
          </button>
          {helpResources.map((item) => {
            const Icon = resourceIcons[item.icon]
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onResource(item.id)}
                className={cn(
                  'group flex h-full flex-col items-center rounded-[1.6rem] border border-line bg-white p-6 text-center shadow-card',
                  cardLiftClass,
                )}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-teal-soft text-teal transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{item.copy}</p>
                <span className="mt-5 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-ink">
                  {item.cta}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
