import { Navbar } from '@/components/Navbar'

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#f8f6f3] text-foreground">
      <Navbar forceSolid />
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#eadfce] bg-white/70 p-6 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
            <div className="grid gap-4 lg:grid-cols-[92px_minmax(0,1fr)]">
              <div className="flex gap-3 lg:flex-col">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-24 w-24 animate-pulse rounded-[1.4rem] bg-[#eee6da]" />
                ))}
              </div>
              <div className="aspect-[0.96/1] animate-pulse rounded-[1.8rem] bg-[#eee6da]" />
            </div>
            <div className="space-y-5">
              <div className="h-4 w-32 animate-pulse rounded-full bg-[#eee6da]" />
              <div className="h-16 w-3/4 animate-pulse rounded-[1rem] bg-[#eee6da]" />
              <div className="h-8 w-48 animate-pulse rounded-full bg-[#eee6da]" />
              <div className="h-12 w-56 animate-pulse rounded-[1rem] bg-[#eee6da]" />
              <div className="h-24 w-full animate-pulse rounded-[1.2rem] bg-[#eee6da]" />
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-32 animate-pulse rounded-[1.4rem] bg-[#eee6da]" />
                ))}
              </div>
              <div className="h-16 w-full animate-pulse rounded-[1.2rem] bg-[#eee6da]" />
              <div className="h-14 w-full animate-pulse rounded-[1.2rem] bg-[#eee6da]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
