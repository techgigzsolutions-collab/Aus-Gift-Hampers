export type InfoPageType =
  | 'legal'
  | 'about'
  | 'story'
  | 'support'
  | 'contact'
  | 'shipping'
  | 'returns'
  | 'faq'

export interface InfoSection {
  id: string
  heading: string
  body: string
  bullets?: string[]
}

export interface InfoPage {
  type: InfoPageType
  title: string
  eyebrow: string
  description: string
  lastUpdated?: string
  sections: InfoSection[]
}

export const infoPages = {
  support: {
    type: 'support',
    title: 'Support',
    eyebrow: 'Help desk',
    description: 'A calm place to find delivery answers, order help, returns guidance, and gifting support.',
    sections: [
      {
        id: 'order-help',
        heading: 'Order help',
        body: 'For active or upcoming orders, share your name, product, delivery suburb, and preferred date so we can guide you quickly.',
        bullets: ['Product recommendations', 'Delivery timing', 'Order changes', 'Corporate gifting'],
      },
      {
        id: 'quickest-path',
        heading: 'Quickest path',
        body: 'WhatsApp is the fastest way to get help with availability, urgent delivery questions, and curated recommendations.',
      },
    ],
  },
  'contact-us': {
    type: 'contact',
    title: 'Contact Us',
    eyebrow: 'Concierge',
    description: 'Tell us who you are gifting, when it needs to arrive, and the tone you want the hamper to carry.',
    sections: [
      {
        id: 'contact-info',
        heading: 'Contact details',
        body: 'For the fastest response, message us on WhatsApp. For corporate enquiries, include order volume, delivery locations, budget, and branding needs.',
        bullets: ['WhatsApp support', 'Corporate gifting requests', 'Custom hamper guidance'],
      },
    ],
  },
  'shipping-delivery': {
    type: 'shipping',
    title: 'Shipping & Delivery',
    eyebrow: 'Delivery guide',
    description: 'Everything you need to know about timing, shipping regions, costs, and tracking expectations.',
    sections: [
      {
        id: 'delivery-time',
        heading: 'Delivery time',
        body: 'Most hampers are delivered within 5-7 business days unless a product page states otherwise.',
        bullets: ['5-7 business days standard estimate', 'Peak seasons may require extra time', 'Order early for major gifting dates'],
      },
      {
        id: 'regions',
        heading: 'Shipping regions',
        body: 'We support delivery across Australia where courier coverage and product suitability allow.',
      },
      {
        id: 'costs',
        heading: 'Costs',
        body: 'Products with free shipping are clearly marked. Other shipping costs may be confirmed during checkout or enquiry.',
      },
      {
        id: 'tracking',
        heading: 'Tracking',
        body: 'When tracking is available, delivery updates will be shared through the relevant order communication channel.',
      },
    ],
  },
  'returns-refunds': {
    type: 'returns',
    title: 'Returns & Refunds',
    eyebrow: 'Order care',
    description: 'A clear, fair process for damaged items, incorrect orders, and refund requests.',
    sections: [
      {
        id: 'eligibility',
        heading: 'Eligibility',
        body: 'Eligibility depends on product type, condition, fulfilment status, and the nature of the issue.',
        bullets: ['Damaged or incorrect items are reviewed promptly', 'Perishable items may have limited return eligibility', 'Photos help us resolve issues faster'],
      },
      {
        id: 'time-window',
        heading: 'Time window',
        body: 'Contact us as soon as possible after delivery so we can assess the issue while details are fresh.',
      },
      {
        id: 'process',
        heading: 'Process',
        body: 'Share your order details, photos where relevant, and a clear description of the concern.',
      },
      {
        id: 'refund-method',
        heading: 'Refund method',
        body: 'Approved refunds are processed through the original or agreed payment method where available.',
      },
    ],
  },
  faq: {
    type: 'faq',
    title: 'FAQ',
    eyebrow: 'Answers',
    description: 'Quick answers about delivery, customisation, tracking, WhatsApp ordering, and corporate gifting.',
    sections: [
      {
        id: 'delivery',
        heading: 'How long does delivery take?',
        body: 'Most products estimate 5-7 business days. Timeframes can vary based on product availability, destination, and peak periods.',
      },
      {
        id: 'customise',
        heading: 'Can I customize hampers?',
        body: 'Yes. Share the occasion, recipient preferences, budget, and delivery date through WhatsApp.',
      },
      {
        id: 'track',
        heading: 'How do I track my order?',
        body: 'When tracking is available, we will share details through the order communication channel.',
      },
      {
        id: 'whatsapp',
        heading: 'Can I order through WhatsApp?',
        body: 'Yes. Product detail pages generate a WhatsApp message with product name, quantity, price, and delivery estimate.',
      },
      {
        id: 'corporate',
        heading: 'Do you offer corporate gifting?',
        body: 'Yes. We can help with bulk orders, curated selections, branded notes, and coordinated delivery planning.',
      },
    ],
  },
  'about-us': {
    type: 'about',
    title: 'About Aus Gift Hampers',
    eyebrow: 'Company',
    description: 'Premium gift hampers composed with thoughtful curation, elegant packaging, and a deeply human sense of occasion.',
    sections: [
      {
        id: 'origin',
        heading: 'Brand origin',
        body: 'Aus Gift Hampers began with a simple belief: gifting should feel considered from the first click to the final unboxing.',
      },
      {
        id: 'mission',
        heading: 'Mission',
        body: 'To make premium gifting feel effortless, personal, and beautifully presented for every meaningful occasion.',
      },
      {
        id: 'vision',
        heading: 'Vision',
        body: 'To become a trusted destination for modern gifting across Australia, combining digital ease with elevated presentation.',
      },
    ],
  },
  'our-story': {
    type: 'story',
    title: 'Our Story',
    eyebrow: 'Origin',
    description: 'A gifting brand shaped around the feeling of a perfect arrival.',
    sections: [
      {
        id: 'founder-vision',
        heading: 'Founder vision',
        body: 'We wanted gifting to feel less transactional and more personal, without making the ordering process complicated.',
      },
      {
        id: 'customer-impact',
        heading: 'Customer impact',
        body: 'Every hamper is designed to help the sender feel confident and the recipient feel genuinely seen.',
      },
    ],
  },
  'privacy-policy': {
    type: 'legal',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: 'May 5, 2026',
    description: 'How Aus Gift Hampers collects, uses, protects, and manages customer information.',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: 'This policy explains how we handle information when you browse, enquire, save products, or place an order.',
      },
      {
        id: 'information-we-collect',
        heading: 'Information We Collect',
        body: 'We may collect contact, order, delivery, and communication details needed to provide our service.',
        bullets: ['Name and contact details', 'Order and delivery preferences', 'Messages sent through forms or WhatsApp', 'Website usage and preference data'],
      },
      {
        id: 'how-we-use-data',
        heading: 'How We Use Data',
        body: 'Information helps us process orders, provide support, improve the website, and communicate about relevant enquiries.',
      },
      {
        id: 'user-rights',
        heading: 'User Rights',
        body: 'You can request access, correction, or deletion of eligible personal information by contacting us.',
      },
    ],
  },
  'terms-conditions': {
    type: 'legal',
    title: 'Terms & Conditions',
    eyebrow: 'Legal',
    lastUpdated: 'May 5, 2026',
    description: 'The terms that apply when using the Aus Gift Hampers website and ordering products.',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: 'By using this website, you agree to use it responsibly and provide accurate information for enquiries and orders.',
      },
      {
        id: 'products-availability',
        heading: 'Products & Availability',
        body: 'Product details, pricing, stock, and delivery estimates may change. We aim to keep information accurate and current.',
      },
      {
        id: 'shipping-conditions',
        heading: 'Shipping Conditions',
        body: 'Delivery depends on location, courier availability, product suitability, and preparation requirements.',
      },
      {
        id: 'payments-orders',
        heading: 'Payments & Orders',
        body: 'Orders are confirmed based on availability, payment, and delivery feasibility.',
      },
    ],
  },
  'refund-policy': {
    type: 'legal',
    title: 'Refund Policy',
    eyebrow: 'Legal',
    lastUpdated: 'May 5, 2026',
    description: 'Refund rules and review process for damaged, incorrect, or eligible order concerns.',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: 'We review refund requests fairly based on order status, product condition, and the reason for the request.',
      },
      {
        id: 'refund-rules',
        heading: 'Refund Rules',
        body: 'Perishable, customised, or fulfilled products may have limited refund eligibility unless damaged or incorrect.',
        bullets: ['Report issues promptly', 'Include photos where relevant', 'Keep packaging until the review is complete'],
      },
      {
        id: 'refund-method',
        heading: 'Refund Method',
        body: 'Approved refunds are returned through the original or agreed payment method where possible.',
      },
    ],
  },
  'cookie-policy': {
    type: 'legal',
    title: 'Cookie Policy',
    eyebrow: 'Legal',
    lastUpdated: 'May 5, 2026',
    description: 'How cookies and similar technologies support website functionality and experience.',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: 'Cookies help the site remember preferences, support essential behaviour, and improve performance.',
      },
      {
        id: 'cookies-usage',
        heading: 'Cookies Usage',
        body: 'We may use cookies for essential site features, saved preferences, analytics, and performance insights.',
      },
      {
        id: 'your-choices',
        heading: 'Your Choices',
        body: 'You can manage cookies in your browser settings, though some features may not work as intended if disabled.',
      },
    ],
  },
} satisfies Record<string, InfoPage>

export type InfoPageSlug = keyof typeof infoPages
