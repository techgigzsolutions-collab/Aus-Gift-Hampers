'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, Bell, LayoutDashboard, LogOut, Package2, ShieldCheck, Sparkles } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface AdminHeaderProps {
  user: any
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-[#e8dfd2] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,238,0.92))] shadow-[0_18px_40px_rgba(35,24,12,0.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d5b57a,#b4873f)] shadow-[0_14px_28px_rgba(176,130,61,0.28)]">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#b4873f]">Control Room</p>
              <h1 className="font-serif text-2xl font-bold text-[#221b14]">Aus Gift Hampers Admin</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#eadfce] bg-white/90 p-2 shadow-[0_10px_24px_rgba(35,24,12,0.04)]">
              {[
                [LayoutDashboard, 'Dashboard', '/admin/dashboard'],
                [Package2, 'Products', '/admin/dashboard'],
                [BarChart3, 'Insights', '/admin/dashboard'],
              ].map(([Icon, label, href]) => {
                const NavIcon = Icon as typeof LayoutDashboard
                return (
                  <Link
                    key={label as string}
                    href={href as string}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                      label === 'Products'
                        ? 'bg-[#1f1915] text-white shadow-[0_12px_24px_rgba(31,25,21,0.16)]'
                        : 'text-[#5b5043] hover:bg-[#f5efe7] hover:text-[#1f1915]'
                    }`}
                  >
                    <NavIcon className="h-4 w-4" strokeWidth={1.8} />
                    {label as string}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-2 rounded-2xl border border-[#eadfce] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(35,24,12,0.04)] sm:flex">
              <Bell className="h-4 w-4 text-[#b4873f]" strokeWidth={1.8} />
              <span className="text-sm font-medium text-[#5b5043]">Live catalog sync</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(35,24,12,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f0e4] text-[#b4873f]">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#221b14]">{user?.email || 'Admin user'}</p>
                <p className="text-xs text-[#7b6d5d]">Secure admin session</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#f2d9d5] bg-[#fff5f3] px-4 py-3 text-sm font-semibold text-[#b14e40] transition-colors hover:bg-[#fdeae6]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
