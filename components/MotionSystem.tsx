'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MotionSystem() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.12,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-motion-section]').forEach(section => {
        const children = section.querySelectorAll('[data-motion-child]')

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              once: true,
            },
          }
        )

        if (children.length) {
          gsap.fromTo(
            children,
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 76%',
                once: true,
              },
            }
          )
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(element => {
        const speed = Number(element.dataset.parallax || 0.14)
        gsap.to(element, {
          yPercent: -18 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-image-scale]').forEach(element => {
        gsap.fromTo(
          element,
          { scale: 1 },
          {
            scale: 1.055,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        )
      })
    })

    return () => {
      ctx.revert()
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
