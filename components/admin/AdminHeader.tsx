'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

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

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo-B.png"
              alt="Aus Gift Hampers"
              width={80}
              height={25}
              priority
              className="object-contain"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-wrap items-center gap-3">

            {/* USER CARD */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(35,24,12,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f0e4] text-[#b4873f]">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#221b14]">
                  {user?.email || 'Admin user'}
                </p>
                <p className="text-xs text-[#7b6d5d]">
                  Secure admin session
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d7b873] bg-white/80 px-4 py-3 text-sm font-semibold text-[#9a6d2c] transition-all duration-200 hover:bg-[#fff8ec] hover:scale-[1.03]"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              View Store
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#f2d9d5] bg-[#fff5f3] px-4 py-3 text-sm font-semibold text-[#b14e40] transition-all duration-200 hover:bg-[#fdeae6] hover:scale-[1.03]"
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
