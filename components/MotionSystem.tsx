'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MotionSystem() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    // ─────────────────────────────────────────────
    // DISABLE LENIS COMPLETELY ON ADMIN PAGES
    // Native scrolling works best for dashboards/tables
    // ─────────────────────────────────────────────
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) {
      document.documentElement.style.scrollBehavior = 'auto'
      document.body.style.scrollBehavior = 'auto'

      return
    }

    // ─────────────────────────────────────────────
    // LENIS
    // ─────────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      syncTouch: false,
      infinite: false,
      autoResize: true,
    })

    // Sync GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // GSAP ticker sync
    gsap.ticker.add(time => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // ─────────────────────────────────────────────
    // ANIMATIONS
    // ─────────────────────────────────────────────
    const ctx = gsap.context(() => {

      // SECTION REVEALS
      gsap
        .utils
        .toArray<HTMLElement>('[data-motion-section]')
        .forEach(section => {

          const children =
            section.querySelectorAll('[data-motion-child]')

          gsap.fromTo(
            section,
            {
              autoAlpha: 0,
              y: 40,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                once: true,
              },
            }
          )

          if (children.length) {
            gsap.fromTo(
              children,
              {
                autoAlpha: 0,
                y: 28,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 80%',
                  once: true,
                },
              }
            )
          }
        })

      // PARALLAX
      gsap
        .utils
        .toArray<HTMLElement>('[data-parallax]')
        .forEach(element => {

          const speed = Number(
            element.dataset.parallax || 0.12
          )

          gsap.to(element, {
            yPercent: -15 * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        })

      // IMAGE SCALE
      gsap
        .utils
        .toArray<HTMLElement>('[data-image-scale]')
        .forEach(element => {

          gsap.fromTo(
            element,
            {
              scale: 1,
            },
            {
              scale: 1.04,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          )
        })
    })

    // ─────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────
    return () => {
      ctx.revert()

      ScrollTrigger.getAll().forEach(trigger =>
        trigger.kill()
      )

      gsap.ticker.remove(time => {
        lenis.raf(time * 1000)
      })

      lenis.destroy()
    }
  }, [pathname])

  return null
}