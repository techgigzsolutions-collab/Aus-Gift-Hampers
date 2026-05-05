export function Reviews() {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Event Organizer',
      review:
        'The hampers from Aus Gift Hampers are absolutely exceptional! The presentation and quality of products exceeded my expectations. My clients loved them!',
      rating: 5,
      initials: 'SM',
    },
    {
      name: 'James Chen',
      role: 'Corporate Client',
      review:
        'We ordered hampers for our team as appreciation gifts. The quality was outstanding and the delivery was prompt. Highly recommended for corporate gifting!',
      rating: 5,
      initials: 'JC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Personal Buyer',
      review:
        'Every item in the hamper was of premium quality. It was the perfect gift for my mother&apos;s birthday. Thank you for making it so special!',
      rating: 5,
      initials: 'ER',
    },
  ]

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
          <p className="text-neutral-600 text-lg">
            Join thousands of satisfied customers who trust Aus Gift Hampers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-accent fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-neutral-700 leading-relaxed mb-6 flex-grow">
                &quot;{testimonial.review}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-neutral-600 mb-6">Join our community of happy customers</p>
          <a
            href="#products"
            className="inline-block px-8 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  )
}
