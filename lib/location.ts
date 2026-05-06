/**
 * Privacy-focused location system for Aus Gift Hampers.
 *
 * ✅ Stores ONLY: city, state, country
 * ❌ Never stores: lat, lng, raw GPS coordinates
 * ❌ Coordinates are used only transiently for reverse-geocoding then discarded
 */

export interface UserRegion {
  city: string
  state: string
  country: string
  timestamp: number
}

const STORAGE_KEY = 'agh_user_region'
const DENIED_KEY = 'agh_location_denied'
const ASKED_KEY = 'agh_location_asked'

/* ─────────────────────────────────────────────
   Storage helpers
───────────────────────────────────────────── */

export function getStoredRegion(): UserRegion | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserRegion
  } catch {
    return null
  }
}

export function saveRegion(region: UserRegion): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(region))
  } catch {
    // Storage unavailable – graceful no-op
  }
}

export function isLocationDenied(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DENIED_KEY) === 'true'
}

export function markLocationDenied(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DENIED_KEY, 'true')
}

export function hasBeenAsked(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ASKED_KEY) === 'true'
}

export function markAsked(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ASKED_KEY, 'true')
}

export function clearRegion(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(DENIED_KEY)
  localStorage.removeItem(ASKED_KEY)
}

/* ─────────────────────────────────────────────
   Reverse geocoding (OpenStreetMap Nominatim)
   Coordinates are NEVER stored – only used to
   fetch human-readable city/state/country.
───────────────────────────────────────────── */

interface NominatimResponse {
  address?: {
    city?: string
    town?: string
    village?: string
    suburb?: string
    county?: string
    state?: string
    country?: string
  }
}

async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<UserRegion | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    })
    if (!res.ok) return null

    const data: NominatimResponse = await res.json()
    const addr = data?.address

    if (!addr) return null

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.suburb ||
      addr.county ||
      ''
    const state = addr.state || ''
    const country = addr.country || ''

    if (!city && !state && !country) return null

    return {
      city,
      state,
      country,
      timestamp: Math.floor(Date.now() / 1000),
    }
  } catch {
    return null
  }
}

/* ─────────────────────────────────────────────
   Main request flow
───────────────────────────────────────────── */

export async function requestAndSaveLocation(): Promise<UserRegion | null> {
  if (typeof window === 'undefined') return null
  if (!navigator.geolocation) return null

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        // Coordinates are transient – immediately used for geocoding only
        const { latitude, longitude } = position.coords
        const region = await reverseGeocode(latitude, longitude)
        // After this point, lat/lng are discarded (never stored)

        if (region) {
          saveRegion(region)
          resolve(region)
        } else {
          resolve(null)
        }
      },
      _error => {
        markLocationDenied()
        resolve(null)
      },
      {
        enableHighAccuracy: false,     // approximate is enough
        timeout: 8000,
        maximumAge: 86_400_000,        // 24 h cache in browser
      },
    )
  })
}

/* ─────────────────────────────────────────────
   Formatting helpers (used by WhatsApp)
───────────────────────────────────────────── */

export function formatRegionText(region: UserRegion | null): string {
  if (!region) return 'Not shared'

  const parts = [region.city, region.state, region.country].filter(Boolean)
  return parts.join(', ')
}

export function shouldShowPrompt(): boolean {
  if (typeof window === 'undefined') return false
  return !hasBeenAsked() && !getStoredRegion() && !isLocationDenied()
}
