import Link from 'next/link'
import Image from 'next/image'

const footerGroups = [
  {
    title: 'Shop',
    links: [
      ['New Arrivals', '/shop?view=new-arrivals'],
      ['Shop All', '/shop'],
      ['Collections', '/shop?view=collections'],
      ['Sale', '/shop?view=sale'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Support', '/support'],
      ['Contact Us', '/contact-us'],
      ['Shipping & Delivery', '/shipping-delivery'],
      ['Returns & Refunds', '/returns-refunds'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About Us', '/about-us'],
      ['Our Story', '/our-story'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Privacy Policy', '/privacy-policy'],
      ['Terms & Conditions', '/terms-conditions'],
      ['Refund Policy', '/refund-policy'],
      ['Cookie Policy', '/cookie-policy'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="footer" data-motion-section className="bg-foreground text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div data-motion-child>
            <Image
              src="/logo-W.png"
              alt="Aus Gift Hampers"
              width={170}
              height={62}
              className="mb-6 h-14 w-auto object-contain"
            />
            <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
              Premium gift hampers handcrafted with elegance and care for every special occasion.
            </p>
            <p className="text-white/60 text-xs font-light">Delivering joy across Australia since 2020</p>
          </div>

          {footerGroups.map(group => (
            <div key={group.title} data-motion-child>
              <h4 className="font-serif font-bold text-white mb-6 text-lg">{group.title}</h4>
              <ul className="space-y-4 text-white/70 text-sm font-light">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-accent transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/60 text-sm font-light">© 2026 Aus Gift Hampers. All rights reserved.</p>
          <Link href="/admin/login" className="text-white/60 hover:text-accent transition-colors text-sm">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
