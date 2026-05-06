'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(searchParams.get('redirectedFrom') || '/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(205,151,75,0.16),transparent_34%),#fbfaf8]">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/60 bg-white/82 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="flex items-center" aria-label="Aus Gift Hampers home">
            <Image src="/logo-B.png" alt="Aus Gift Hampers" width={160} height={58} priority className="h-16 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#4f4538] sm:flex">
            <Link href="/shop" className="transition-colors hover:text-accent">Shop</Link>
            <Link href="/contact-us" className="transition-colors hover:text-accent">Contact</Link>
          </nav>
          <Link
            href="/"
            className="rounded-xl border border-accent px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Open Store
          </Link>
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl border border-white p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">A</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Aus Gift Hampers</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <label className="block">
              <span className="block text-sm font-medium text-foreground mb-2">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-foreground mb-2">Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
