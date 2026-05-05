export function About() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm md:text-base tracking-widest uppercase mb-3">
            About Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Who We Are
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 bg-gradient-to-br from-accent/20 to-secondary rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-24 h-24 text-accent/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 012-2h5.5a2 2 0 011.823 1.115l2.102 4.692a2 2 0 01.075.855v5.438a2 2 0 01-2 2H4a2 2 0 01-2-2v-5.438a2 2 0 01.075-.855l2.102-4.692A2 2 0 016.5 6H12m0 0H6.5m5.5 0h5.5M6 19h12" />
                </svg>
                <p className="text-accent font-semibold">Premium Gift Collections</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Crafting Moments of Joy
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-4">
                At Aus Gift Hampers, we believe that gifting is more than just exchanging presents—it's about sharing moments of joy, appreciation, and connection. Each hamper is thoughtfully curated to celebrate life's special occasions.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Our passion for excellence drives us to source the finest ingredients and artisanal products from around the world, ensuring that every hamper reflects our commitment to premium quality and attention to detail.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Handcrafted with Love</p>
                  <p className="text-sm text-neutral-600">Every hamper is carefully assembled by hand</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Premium Quality Products</p>
                  <p className="text-sm text-neutral-600">Only the finest ingredients make it to our hampers</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Customer First Approach</p>
                  <p className="text-sm text-neutral-600">Your satisfaction is our ultimate goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
