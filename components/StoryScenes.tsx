'use client'

import Image from 'next/image'
import { Award, MessageCircle, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react'
import { getWhatsAppHref } from '@/lib/whatsapp'

 

const testimonials = [
  {
    quote: 'The presentation felt like opening a luxury editorial spread. Every detail was considered.',
    name: 'Amelia R.',
  },
  {
    quote: 'Fast delivery, elegant packaging, and the recipient messaged before I did. That says enough.',
    name: 'Marcus T.',
  },
  {
    quote: 'Our corporate gifting finally feels premium without becoming complicated.',
    name: 'Nina K.',
  },
]


export function SolutionScene() {
  return (
    <section
      id="solution"
      data-motion-section
      className="terminal-scene relative overflow-hidden bg-[#f7f3ed] px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div data-motion-child className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-black/15">
          <Image
            src="/hamper-2.jpg"
            alt="Curated premium gift hamper"
            fill
            className="object-cover will-change-transform"
            data-image-scale
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-white/12 p-5 text-white backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">Composed gifting</p>
            <p className="mt-2 font-serif text-2xl font-bold">Packed for the moment it is opened.</p>
          </div>
        </div>

        <div className="lg:pl-10">
          <p data-motion-child className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            The answer
          </p>
          <h2 data-motion-child className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            Curated hampers that feel intentional before the ribbon is untied.
          </h2>
          <p data-motion-child className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            We bring together premium goods, balanced textures, elegant packaging, and delivery-ready
            presentation so every order feels personal, polished, and effortless.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['01', 'Curated pairings'],
              ['02', 'Premium packaging'],
              ['03', 'WhatsApp ordering'],
            ].map(([number, label]) => (
              <div key={number} data-motion-child className="border-t border-foreground/15 pt-4">
                <p className="text-sm font-semibold text-accent">{number}</p>
                <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustScene() {
  return (
    <section
      id="trust"
      data-motion-section
      className="terminal-scene terminal-grid overflow-hidden bg-[#12100f] px-4 py-28 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p data-motion-child className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              Trust layer
            </p>
            <h2 data-motion-child className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">
              Built for beautiful arrivals and low-friction decisions.
            </h2>
          </div>
          <p data-motion-child className="max-w-md text-white/64">
            From packaging to delivery support, each interaction is designed to feel calm, premium, and reliable.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            [Truck, 'Reliable delivery', 'Tracked dispatch and clear delivery expectations.'],
            [Sparkles, 'Premium curation', 'Thoughtfully paired products with elegant finishing.'],
            [ShieldCheck, 'Secure checkout', 'Protected admin workflows and Supabase-backed data.'],
          ].map(([Icon, title, copy]) => {
            const TrustIcon = Icon as typeof Truck
            return (
              <div
                key={title as string}
                data-motion-child
                className="group rounded-xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.065]"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <TrustIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-bold">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{copy as string}</p>
              </div>
            )
          })}
        </div>

        <div data-motion-child className="mt-14 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none]">
          {testimonials.map(testimonial => (
            <figure
              key={testimonial.name}
              className="min-w-[82%] rounded-xl border border-white/10 bg-white/[0.04] p-6 sm:min-w-[420px]"
            >
              <div className="mb-6 flex text-accent">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-serif text-2xl leading-snug text-white/90">"{testimonial.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm text-white/58">
                <Award className="h-4 w-4 text-accent" />
                {testimonial.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCtaScene() {
  return (
    <section
      id="final-cta"
      data-motion-section
      className="terminal-scene relative overflow-hidden bg-[#f6f1e8] px-4 py-28 sm:px-6 lg:px-8"
    >
      <div data-parallax="0.24" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,157,88,0.24),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p data-motion-child className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          Final step
        </p>
        <h2 data-motion-child className="font-serif text-5xl font-bold leading-tight text-foreground sm:text-7xl">
          Send a gift that feels already remembered.
        </h2>
        <p data-motion-child className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          Tell us the occasion, delivery window, and budget. We will help you choose the right hamper.
        </p>
        <a
          data-motion-child
          href={getWhatsAppHref("Hi, I'd like help choosing a premium gift hamper.")}
          target="_blank"
          rel="noopener noreferrer"
          className="motion-button cta-pulse mt-10 inline-flex items-center justify-center gap-3 rounded-xl bg-accent px-8 py-4 font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          <MessageCircle className="h-5 w-5" />
          Order via WhatsApp
        </a>
      </div>
    </section>
  )
}
