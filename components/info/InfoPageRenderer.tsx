'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronDown,
  Clock,
  Gift,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import type { InfoPage, InfoSection } from '@/lib/infoPages'
import { getWhatsAppHref } from '@/lib/whatsapp'

export function InfoPageRenderer({ page }: { page: InfoPage }) {
  return (
    <>
      <InfoHero page={page} />
      {page.type === 'legal' && <LegalTemplate page={page} />}
      {page.type === 'about' && <AboutTemplate page={page} />}
      {page.type === 'story' && <StoryTemplate page={page} />}
      {page.type === 'support' && <SupportTemplate />}
      {page.type === 'contact' && <ContactTemplate page={page} />}
      {page.type === 'shipping' && <ShippingTemplate page={page} />}
      {page.type === 'returns' && <ReturnsTemplate page={page} />}
      {page.type === 'faq' && <FaqTemplate page={page} />}
      <BottomCta />
    </>
  )
}

function InfoHero({ page }: { page: InfoPage }) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(203,157,88,0.2),transparent_34%),linear-gradient(135deg,#fbf7ef,#fff)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div data-motion-section className="relative mx-auto max-w-7xl">
        <p data-motion-child className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-accent">
          {page.eyebrow}
        </p>
        <h1 data-motion-child className="max-w-4xl font-serif text-5xl font-bold leading-tight text-foreground sm:text-7xl">
          {page.title}
        </h1>
        <p data-motion-child className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          {page.description}
        </p>
      </div>
    </section>
  )
}

function LegalTemplate({ page }: { page: InfoPage }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Last updated</p>
          <p className="mt-2 font-serif text-xl font-bold">{page.lastUpdated}</p>
          <div className="my-6 h-px bg-border" />
          <p className="mb-4 text-sm font-semibold">Contents</p>
          <nav className="space-y-2">
            {page.sections.map(section => (
              <a key={section.id} href={`#${section.id}`} className="block rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-secondary hover:text-foreground">
                {section.heading}
              </a>
            ))}
          </nav>
        </aside>

        <article data-motion-section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-10">
          <div data-motion-child className="mb-10 rounded-2xl bg-secondary/45 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Last updated</p>
            <p className="mt-2 text-neutral-700">{page.lastUpdated}</p>
          </div>
          <div className="space-y-12">
            {page.sections.map(section =>
              section.id === 'location-permissions' ? (
                <LocationPrivacyCard key={section.id} section={section} />
              ) : (
                <section key={section.id} id={section.id} data-motion-child className="scroll-mt-28">
                  <h2 className="font-serif text-3xl font-bold">{section.heading}</h2>
                  <p className="mt-4 leading-8 text-neutral-650">{section.body}</p>
                  {section.bullets && <BulletList items={section.bullets} />}
                  <div className="mt-8 h-px bg-border" />
                </section>
              )
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

function AboutTemplate({ page }: { page: InfoPage }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-20">
        <div data-motion-section className="grid gap-8 lg:grid-cols-3">
          {page.sections.map(section => (
            <div key={section.id} data-motion-child className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{section.id}</p>
              <h2 className="font-serif text-3xl font-bold">{section.heading}</h2>
              <p className="mt-4 leading-7 text-neutral-600">{section.body}</p>
            </div>
          ))}
        </div>

        <div data-motion-section className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div data-motion-child className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-black/15">
            <Image src="/hamper-6.jpg" alt="Elegant premium hamper packaging" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
          <div>
            <p data-motion-child className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-accent">Why choose us</p>
            <h2 data-motion-child className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Designed for the moment the recipient opens it.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [Sparkles, 'Premium Quality'],
                [HeartHandshake, 'Handcrafted'],
                [Truck, 'Fast Delivery'],
                [Gift, 'Elegant Packaging'],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof Sparkles
                return (
                  <div key={label as string} data-motion-child className="rounded-xl border border-border bg-white p-5">
                    <ItemIcon className="mb-4 h-6 w-6 text-accent" />
                    <p className="font-semibold">{label as string}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryTemplate({ page }: { page: InfoPage }) {
  const timeline = [
    ['2020', 'Start', 'A sharper idea for gifting: premium, personal, and easier to order.'],
    ['Growth', 'Expansion', 'More curated categories, better delivery guidance, and support for corporate gifting.'],
    ['Today', 'Brand vision', 'A refined digital experience for meaningful hampers across Australia.'],
  ]

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div data-motion-section className="relative space-y-8 border-l border-accent/35 pl-8">
          {timeline.map(([year, title, body]) => (
            <div key={year} data-motion-child className="relative rounded-2xl border border-border bg-white p-6 shadow-sm">
              <span className="absolute -left-[43px] top-8 h-5 w-5 rounded-full border-4 border-background bg-accent" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{year}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">{title}</h2>
              <p className="mt-4 leading-7 text-neutral-600">{body}</p>
            </div>
          ))}
        </div>
        <div data-motion-section className="mt-20 grid gap-6 lg:grid-cols-2">
          {page.sections.map(section => (
            <div key={section.id} data-motion-child className="rounded-2xl bg-foreground p-8 text-white">
              <h2 className="font-serif text-3xl font-bold">{section.heading}</h2>
              <p className="mt-4 leading-7 text-white/70">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SupportTemplate() {
  const cards = [
    [Mail, 'Contact Us', 'Talk to us about product selection, orders, and custom gifting.', '/contact-us'],
    [Truck, 'Shipping', 'Delivery windows, regions, tracking, and shipping expectations.', '/shipping-delivery'],
    [RotateCcw, 'Returns', 'What to do if an item arrives damaged, incorrect, or needs review.', '/returns-refunds'],
    [ChevronDown, 'FAQ', 'Quick answers for common ordering and delivery questions.', '/faq'],
  ]

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div data-motion-section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([Icon, title, copy, href]) => {
          const CardIcon = Icon as typeof Mail
          return (
            <Link key={href as string} href={href as string} data-motion-child className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <CardIcon className="mb-8 h-7 w-7 text-accent transition-transform group-hover:scale-110" />
              <h2 className="font-serif text-2xl font-bold">{title as string}</h2>
              <p className="mt-4 text-sm leading-6 text-neutral-600">{copy as string}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function ContactTemplate({ page }: { page: InfoPage }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.78fr]">
        <form data-motion-section className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label data-motion-child className="block">
              <span className="mb-2 block text-sm font-semibold">Name</span>
              <input className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
            </label>
            <label data-motion-child className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <input type="email" className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
            </label>
          </div>
          <label data-motion-child className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold">Message</span>
            <textarea rows={7} className="w-full resize-none rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent" />
          </label>
          <button data-motion-child type="button" className="motion-button mt-6 rounded-xl bg-foreground px-6 py-3 font-semibold text-white">
            Send message
          </button>
        </form>

        <aside data-motion-section className="rounded-3xl bg-foreground p-8 text-white">
          <MessageCircle data-motion-child className="h-8 w-8 text-accent" />
          <h2 data-motion-child className="mt-6 font-serif text-3xl font-bold">WhatsApp is fastest.</h2>
          <p data-motion-child className="mt-4 leading-7 text-white/70">{page.sections[0].body}</p>
          <div data-motion-child className="mt-8 space-y-4 text-sm text-white/70">
            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> Australia-wide delivery support</p>
            <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-accent" /> 5-7 business day guidance</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function ShippingTemplate({ page }: { page: InfoPage }) {
  return <IconSectionTemplate page={page} icons={[Clock, MapPin, PackageCheck, Truck]} />
}

function ReturnsTemplate({ page }: { page: InfoPage }) {
  return <IconSectionTemplate page={page} icons={[ShieldCheck, Clock, PackageCheck, RotateCcw]} />
}

function IconSectionTemplate({ page, icons }: { page: InfoPage; icons: Array<typeof Clock> }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div data-motion-section className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        {page.sections.map((section, index) => {
          const Icon = icons[index] || PackageCheck
          return (
            <div key={section.id} data-motion-child className="rounded-2xl border border-border bg-white p-7 shadow-sm">
              <Icon className="mb-8 h-7 w-7 text-accent" />
              <h2 className="font-serif text-3xl font-bold">{section.heading}</h2>
              <p className="mt-4 leading-7 text-neutral-600">{section.body}</p>
              {section.bullets && <BulletList items={section.bullets} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function FaqTemplate({ page }: { page: InfoPage }) {
  const [openId, setOpenId] = useState(page.sections[0]?.id)

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div data-motion-section className="mx-auto max-w-4xl space-y-4">
        {page.sections.map(section => {
          const isOpen = openId === section.id
          return (
            <div key={section.id} data-motion-child className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <button onClick={() => setOpenId(isOpen ? '' : section.id)} className="flex w-full items-center justify-between gap-5 p-6 text-left">
                <span className="font-serif text-2xl font-bold">{section.heading}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-accent transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 leading-7 text-neutral-600">{section.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map(item => (
        <li key={item} className="flex gap-3 text-neutral-650">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LocationPrivacyCard({ section }: { section: InfoSection }) {
  return (
    <section id={section.id} data-motion-child className="scroll-mt-28">
      <div className="rounded-3xl border border-[#d9b97b]/60 bg-[linear-gradient(135deg,#fdf8ee,#faf4e5)] p-7 shadow-[0_18px_50px_rgba(200,169,106,0.13)]">
        {/* Header */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f5e9d0,#eedbb8)] shadow-[0_8px_20px_rgba(200,169,106,0.18)]">
            <MapPin className="h-6 w-6 text-[#c8a96a]" strokeWidth={1.8} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1f1915]">{section.heading}</h2>
        </div>

        {/* Body */}
        <p className="leading-8 text-[#4f4538]">{section.body}</p>

        {/* Bullet points */}
        {section.bullets && (
          <ul className="mt-5 space-y-3">
            {section.bullets.map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a96a]" />
                <span className="text-[#4f4538]">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#e8d9b7] bg-white/60 px-4 py-3">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#c8a96a]" />
          <p className="text-xs text-[#6b5f52]">
            You can revoke location permissions anytime from your browser settings.
          </p>
        </div>
      </div>
      <div className="mt-8 h-px bg-border" />
    </section>
  )
}

function BottomCta() {
  return (
    <section data-motion-section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-[radial-gradient(circle_at_top,rgba(203,157,88,0.22),transparent_42%),#11100f] p-8 text-center text-white shadow-2xl sm:p-12">
        <p data-motion-child className="text-xs font-semibold uppercase tracking-[0.34em] text-accent">Need help or ready to order?</p>
        <h2 data-motion-child className="mt-5 font-serif text-4xl font-bold sm:text-5xl text-foreground">Let us help you choose the right hamper.</h2>
        <div data-motion-child className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact-us" className="motion-button rounded-xl bg-white px-6 py-3 font-semibold text-foreground">
            Contact Us
          </Link>
          <a href={getWhatsAppHref("Hi, I'd like help choosing a premium gift hamper.")} target="_blank" rel="noopener noreferrer" className="motion-button rounded-xl bg-accent px-6 py-3 font-semibold text-white">
            WhatsApp Order
          </a>
        </div>
      </div>
    </section>
  )
}
