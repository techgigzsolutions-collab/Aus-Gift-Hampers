import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { SiteFooter } from '@/components/SiteFooter'
import { InfoPageRenderer } from '@/components/info/InfoPageRenderer'
import { infoPages, type InfoPageSlug } from '@/lib/infoPages'

interface InfoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: InfoPageProps) {
  const { slug } = await params
  const page = infoPages[slug as InfoPageSlug]

  if (!page) return {}

  return {
    title: `${page.title} | Aus Gift Hampers`,
    description: page.description,
  }
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params
  const page = infoPages[slug as InfoPageSlug]

  if (!page) notFound()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar forceSolid />
      <InfoPageRenderer page={page} />
      <SiteFooter />
    </main>
  )
}
