'use client'

import Image from 'next/image'

interface BlogPost {
  id: number
  image: string
  author: string
  date: string
  title: string
  excerpt: string
}

const blogs: BlogPost[] = [
  {
    id: 1,
    image: '/hamper-1.jpg',
    author: 'Sarah Chen',
    date: 'March 15, 2024',
    title: 'The Art of Thoughtful Gift Giving',
    excerpt: 'Discover how to choose the perfect gift that resonates with your loved ones and creates lasting memories.',
  },
  {
    id: 2,
    image: '/hamper-2.jpg',
    author: 'Emma Watson',
    date: 'March 10, 2024',
    title: 'Luxury Unboxing Experience',
    excerpt: 'Learn why premium packaging matters and how it elevates the gift-giving experience.',
  },
  {
    id: 3,
    image: '/hamper-3.jpg',
    author: 'James Liu',
    date: 'March 5, 2024',
    title: 'Sustainable Gifting Guide',
    excerpt: 'Explore eco-friendly ways to gift without compromising on elegance and luxury.',
  },
  {
    id: 4,
    image: '/hamper-4.jpg',
    author: 'Lisa Anderson',
    date: 'February 28, 2024',
    title: 'Corporate Gifting Trends 2024',
    excerpt: 'Stay ahead with the latest trends in corporate gift hampers and customization options.',
  },
  {
    id: 5,
    image: '/hamper-5.jpg',
    author: 'Michael Brown',
    date: 'February 20, 2024',
    title: 'Seasonal Collection Highlights',
    excerpt: 'Explore our curated seasonal collections perfect for every occasion.',
  },
  {
    id: 6,
    image: '/hamper-6.jpg',
    author: 'Rachel Green',
    date: 'February 15, 2024',
    title: 'Personalization Magic',
    excerpt: 'Make gifts extra special with our personalization options and custom touches.',
  },
]

export function BlogSection() {
  const featuredBlog = blogs[0]
  const gridBlogs = blogs.slice(1, 7)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <p className="text-accent font-light text-sm tracking-widest uppercase mb-4">
            Stories & Insights
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            From Our Blog
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl">
            Explore tips, trends, and stories about luxury gifting and the art of creating meaningful moments.
          </p>
        </div>

        {/* Featured + Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Blog - Left Side */}
          <div className="lg:col-span-1">
            <a href="#" className="group block h-full">
              <div className="relative h-96 overflow-hidden rounded-lg mb-6">
                <Image
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">
                {featuredBlog.author} • {featuredBlog.date}
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                {featuredBlog.title}
              </h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                {featuredBlog.excerpt}
              </p>
            </a>
          </div>

          {/* Blog Grid - Right Side */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {gridBlogs.map((blog) => (
                <a href="#" key={blog.id} className="group block">
                  <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">
                    {blog.author} • {blog.date}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-neutral-600 font-light text-sm line-clamp-2">
                    {blog.excerpt}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-white transition-colors duration-300 rounded-lg font-light"
          >
            View All Stories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
