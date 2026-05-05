'use client'

import { useState, useEffect } from 'react'
import { getWhatsAppHref } from '@/lib/whatsapp'

interface HeaderProps {
  isEditing: boolean
  onAdminToggle: () => void
  cartCount: number
}

export function Header({ isEditing, onAdminToggle, cartCount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-foreground text-lg">Aus Gift Hampers</h1>
            <p className="text-xs text-accent font-semibold">Premium Collections</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* WhatsApp Quick Link */}
          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-secondary transition-colors duration-300"
            aria-label="Contact on WhatsApp"
          >
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.158l-.34-.181-3.52.352 2.381-2.618A9.987 9.987 0 012.5 12.01C2.5 6.485 7.081 2 12.5 2s10 4.485 10 10-4.581 10-10 10c-1.629 0-3.168-.333-4.581-.94l-.356-.187-3.75.736 2.467-3.022z" />
            </svg>
          </a>

          {/* Cart Badge */}
          {cartCount > 0 && (
            <div className="relative">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
          )}

          {/* Admin Toggle */}
          <button
            onClick={onAdminToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              isEditing
                ? 'bg-accent text-white'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
            aria-label="Toggle admin mode"
          >
            {isEditing ? 'Admin On' : 'Admin'}
          </button>
        </div>
      </div>
    </header>
  )
}
