import { Navbar } from '@/components/Navbar'
import { SiteFooter } from '@/components/SiteFooter'

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar forceSolid />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-accent">{eyebrow}</p>}
            <h1 className="font-serif text-5xl font-bold leading-tight sm:text-6xl">{title}</h1>
            {description && <p className="mt-5 text-lg leading-8 text-neutral-600">{description}</p>}
          </div>
          {children}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
