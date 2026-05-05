'use client'

import { useEffect, useState } from 'react'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCommerce } from '@/components/commerce/CommerceProvider'

interface NavLink {
  label: string
  id: string
}

const navLinks: NavLink[] = [
  { label: 'Home', id: 'hero' },
  { label: 'Shop', id: 'products' },
  { label: 'Contact', id: '/contact-us' },
]

interface NavbarProps {
  cartCount?: number
  wishlistCount?: number
  forceSolid?: boolean
}

export function Navbar({ cartCount: cartCountProp, wishlistCount: wishlistCountProp, forceSolid = false }: NavbarProps) {
  const commerce = useCommerce()
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const cartCount = cartCountProp ?? commerce.cartCount
  const wishlistCount = wishlistCountProp ?? commerce.wishlistCount
  const isHomePage = pathname === '/'

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return

      ticking = true
      requestAnimationFrame(() => {
        setIsScrolled(forceSolid || window.scrollY > 42)

        if (isHomePage) {
          const sectionLinks = navLinks.filter(link => !link.id.startsWith('/'))
          const sections = sectionLinks.map(link => document.getElementById(link.id))
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i]
            if (section && section.offsetTop <= window.scrollY + 140) {
              setActiveSection(sectionLinks[i].id)
              break
            }
          }
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceSolid, isHomePage])

  const handleNavClick = (id: string) => {
    if (id.startsWith('/')) {
      router.push(id)
      return
    }

    if (!isHomePage) {
      router.push(`/#${id}`)
      return
    }

    const element = document.getElementById(id)
    if (!element) return

    const navbarOffset = 76
    const top = element.getBoundingClientRect().top + window.scrollY - navbarOffset
    window.history.replaceState(null, '', `/#${id}`)
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveSection(id)
  }

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || forceSolid
            ? 'bg-transparent text-foreground backdrop-blur-xl shadow-sm border-b border-white/60'
            : 'bg-transparent text-white'
        }`}
      >
        <div className="max-w-full mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20 gap-4">
            <button
  onClick={() => handleNavClick('hero')}
  className="flex items-center shrink-0 hover:scale-105 transition-transform"
  aria-label="Aus Gift Hampers home"
>
  <div className="relative h-16 w-[140px] sm:h-18 sm:w-[160px]">
    
    {/* White Logo */}
    <Image
      src="/logo-W.png"
      alt="Aus Gift Hampers"
      fill
      priority
      className={`object-contain transition-opacity duration-500 ease-in-out ${
        isScrolled ? "opacity-0" : "opacity-100"
      }`}
    />

    {/* Black Logo */}
    <Image
      src="/logo-B.png"
      alt="Aus Gift Hampers"
      fill
      priority
      className={`object-contain transition-opacity duration-500 ease-in-out ${
        isScrolled ? "opacity-100" : "opacity-0"
      }`}
    />

  </div>
</button>

            <div className="hidden lg:flex items-center gap-5 flex-1 justify-center">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 text-md font-light transition-colors duration-200 whitespace-nowrap after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-accent after:transition-transform after:duration-300 after:ease-out ${
                    activeSection === link.id
                      ? 'text-accent font-medium after:w-full after:scale-x-100'
                      : 'hover:text-accent after:w-full after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link href="/shop" className="hover:text-accent transition-colors" aria-label="Search products">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <Link href="/wishlist" className="hover:text-accent transition-colors relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] leading-4 text-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={commerce.openMiniCart} className="hover:text-accent transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-foreground text-white text-[10px] leading-4 text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
