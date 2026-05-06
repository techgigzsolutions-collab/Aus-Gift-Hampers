'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Shield, X } from 'lucide-react'
import {
  markAsked,
  markLocationDenied,
  requestAndSaveLocation,
  shouldShowPrompt,
  type UserRegion,
} from '@/lib/location'

interface LocationPromptProps {
  onRegionDetected?: (region: UserRegion) => void
}

export function LocationPrompt({ onRegionDetected }: LocationPromptProps) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Delay showing the prompt until after initial render settles */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (shouldShowPrompt()) {
        setVisible(true)
      }
    }, 1800)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleAllow = async () => {
    setLoading(true)
    markAsked()

    const region = await requestAndSaveLocation()

    setLoading(false)

    if (region) {
      const cityLabel = [region.city, region.state].filter(Boolean).join(', ')
      setDetected(cityLabel || region.country)
      onRegionDetected?.(region)
      // Auto-close after showing the toast
      timerRef.current = setTimeout(() => setVisible(false), 2200)
    } else {
      setVisible(false)
    }
  }

  const handleDismiss = () => {
    markAsked()
    markLocationDenied()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {/* ── Backdrop (desktop only) ─── */}
      <div
        className="fixed inset-0 z-[200] hidden bg-black/20 backdrop-blur-[2px] md:block"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* ── Panel ─────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Location permission request"
        className={[
          /* shared */
          'fixed z-[201] w-full',
          /* mobile: bottom sheet */
          'bottom-0 left-0 right-0 rounded-t-[2rem]',
          /* desktop: centered modal */
          'md:bottom-auto md:left-1/4 md:right-auto md:top-1/2',
          'md:-translate-x-1/2 md:-translate-y-1/2',
          'md:max-w-md md:rounded-[2rem]',
          /* glass card */
          'border border-[#e8dfd2] bg-[#faf8f4]/95 shadow-[0_32px_80px_rgba(20,15,8,0.22)]',
          'backdrop-blur-xl',
          /* entrance animation */
          'animate-location-slide',
        ].join(' ')}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#e2d9cc] bg-white/80 text-[#6b5f52] transition hover:bg-white hover:text-[#1f1915]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 pb-7 pt-8">
          {/* Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f5e9d0,#eedbb8)] shadow-[0_8px_20px_rgba(200,169,106,0.22)]">
            <MapPin className="h-7 w-7 text-[#c8a96a]" strokeWidth={1.8} />
          </div>

          {/* Content */}
          {detected ? (
            <div className="py-2 text-center">
              <p className="font-serif text-2xl font-bold text-[#1f1915]">
                📍 {detected} detected
              </p>
              <p className="mt-2 text-sm text-[#7d6f60]">
                We'll use this to personalise your delivery support.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl font-bold leading-snug text-[#1f1915] sm:text-3xl">
                Enable Approximate<br />Location Access
              </h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-[#5c5046]">
                We only use your city and region to improve delivery
                assistance and customer support.
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAllow}
                  disabled={loading}
                  className="motion-button flex flex-1 items-center justify-center gap-2 rounded-[1.2rem] bg-[linear-gradient(90deg,#c79a47,#ddb362)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(200,169,106,0.3)] transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Detecting…
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4" />
                      Allow Location
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="flex-1 rounded-[1.2rem] border border-[#e2d9cc] bg-white px-5 py-3.5 text-sm font-semibold text-[#4f4538] transition hover:border-[#c8a96a] hover:text-[#1f1915]"
                >
                  Maybe Later
                </button>
              </div>

              {/* Privacy note */}
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#f5f0e8] px-4 py-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a96a]" />
                <p className="text-xs leading-5 text-[#6b5f52]">
                  Your location is never shared publicly and exact GPS
                  coordinates are never stored.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes location-slide {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) {
          @keyframes location-slide {
            from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
          }
        }
        .animate-location-slide {
          animation: location-slide 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </>
  )
}
