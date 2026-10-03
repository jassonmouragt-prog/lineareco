"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/data/testimonials";
import { images } from "@/data/images";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-testimonial-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="relative overflow-hidden">
      <Image
        src={images.testimonials.src}
        alt={images.testimonials.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(22,20,18,.86) 0%, rgba(28,26,24,.78) 55%, rgba(22,20,18,.9) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-[5%] pt-[80px] pb-[90px] md:pt-[100px] md:pb-[110px]">
        <div className="flex flex-col items-center gap-7 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="md:max-w-[520px]">
            <Reveal>
              <span className="text-[10px] font-semibold tracking-[0.24em] text-beige">
                DEPOIMENTOS
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-4 font-serif text-[34px] leading-[1.05] font-medium text-white md:text-[42px]">
                Experiências reais, memórias que ficam.
              </h2>
            </Reveal>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Depoimento anterior"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Próximo depoimento"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar -mx-[5%] mt-12 flex snap-x snap-mandatory scroll-pl-[5%] gap-5 overflow-x-auto px-[5%] pb-2 md:mt-16"
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              data-testimonial-card
              className="w-[84vw] max-w-[420px] shrink-0 snap-start md:w-[47%] md:max-w-none lg:w-[31.5%]"
            >
              <Reveal delay={i * 90} className="h-full">
                <figure
                  className="flex h-full flex-col justify-between rounded-[14px] border p-7 md:p-8"
                  style={{
                    background: "rgba(255,255,255,.04)",
                    borderColor: "rgba(255,255,255,.12)",
                  }}
                >
                  <div>
                    <span
                      aria-hidden
                      className="block font-serif text-[46px] leading-[0.6] text-white/25"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-5 font-serif text-[18px] leading-[1.55] text-white/90 md:text-[19px]">
                      {testimonial.quote.split("\n\n").map((paragraph, p) => (
                        <p key={p} className="mt-3 first:mt-0">
                          {paragraph}
                        </p>
                      ))}
                    </blockquote>
                  </div>

                  <figcaption className="mt-8 border-t border-white/10 pt-5">
                    <p className="text-[13px] font-semibold tracking-[0.02em] text-white">
                      {testimonial.name}
                    </p>
                    <p className="mt-1.5 text-[10px] font-medium tracking-[0.2em] text-white/45 uppercase">
                      {testimonial.eventType}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}