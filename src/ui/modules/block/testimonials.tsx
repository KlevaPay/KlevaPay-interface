'use client'
import { Star } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/carousel";
import Autoplay from "embla-carousel-autoplay"
import React from "react";

function SectionShell({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section
      id={id}
      className="w-full border-t"
      style={{
        background: "var(--brand-gradient)",
        borderColor: "var(--brand-navy)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {children}
      </div>
    </section>
  )
}

export function TestimonialsPartners() {
   const autoplay = React.useRef(
      Autoplay({
        delay: 2000,
      })
    )
  return (
    <SectionShell id="testimonials">
      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-[1.2rem] sm:text-[1.5rem] lg:text-[2rem] font-semibold text-white">What Our Customers Say</h2>
        <p className="mt-1 text-[12px] sm:text-[1rem] lg:text-[1.2rem] text-white/80">
          Join hundreds of businesses already using KlevaPay to process payments.
        </p>
      </div>

      {/* Testimonial Card */}
      <Carousel 
        plugins={[autoplay.current]}
        className="mx-auto max-w-4xl"
      >
        <CarouselContent className="rounded text-foreground shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="bg-white/80 rounded-lg h-full p-5 sm:p-6">
              <>
              <div className="flex items-center gap-1 text-[#f5b301] mb-3" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="fill-[#f5b301] stroke-[#f5b301] size-4" />
                ))}
              </div>
              <p className="text-[14px] text-foreground/90 mb-5">
                “KlevaPay has revolutionized how we accept payments. Our international customers can now pay in crypto while we receive USD. The rates are transparent and the settlements are fast.”
              </p>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[rgba(7,56,99,0.12)] flex items-center justify-center text-[color:var(--brand-navy)] font-semibold">
                  S
                </div>
                <div>
                  <div className="text-[14px] font-medium">Sarah Johnson</div>
                  <div className="text-[12px] text-foreground/60">E‑commerce Store Owner · Fashion Hub (Nigeria)</div>
                </div>
              </div>
              </>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel controls (static UI for now) */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <CarouselPrevious />
          <CarouselNext />
          {/* <button className="size-8 grid place-items-center rounded-full bg-white/80 text-foreground shadow-sm border border-border">
            <ChevronLeft className="size-4" />
          </button>
          
          <button className="size-8 grid place-items-center rounded-full bg-white/80 text-foreground shadow-sm border border-border">
            <ChevronRight className="size-4" />
          </button> */}
        </div>
      </Carousel>

      {/* Partners */}
      <div className="mt-10 sm:mt-12 text-center">
        <div className="text-[14px] font-medium text-white/90 mb-4">Our Integration Partners</div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/80 text-[14px]">
          <span>Flutterwave</span>
          <span>OPay</span>
          <span>Uniswap</span>
          <span>1inch</span>
          <span>Binance Pay</span>
        </div>
      </div>
    </SectionShell>
  )
}
