import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { SiteFooter } from '@/components/SiteFooter'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-[#f8f6f3] text-foreground">
      <Navbar forceSolid />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-32 text-center sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-[#eadfce] bg-white px-6 py-16 shadow-[0_18px_48px_rgba(27,20,12,0.05)] sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#c8a96a]">Product not found</p>
          <h1 className="mt-5 font-serif text-4xl font-bold text-[#1f1915] sm:text-5xl">This hamper is no longer available.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5448]">
            The product link may have changed, or the item may currently be unavailable in the catalogue.
          </p>
          <Link href="/shop" className="motion-button mt-8 inline-flex rounded-[1.2rem] bg-[#171412] px-6 py-4 font-semibold text-white">
            Return to shop
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
