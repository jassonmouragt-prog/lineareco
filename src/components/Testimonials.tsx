import Image from "next/image";
import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/data/testimonials";
import { images } from "@/data/images";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden">
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

      <div className="relative mx-auto max-w-[1400px] px-[5%] py-[80px] md:py-[90px]">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="text-[10px] font-semibold tracking-[0.24em] text-beige">
              DEPOIMENTOS
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-4 font-serif text-[36px] leading-[1.05] font-medium text-white md:text-[42px]">
              Quem viveu, recomenda.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <div
                className="float-card"
                style={{ animationDelay: `${i * 1.2}s` }}
              >
                <article
                  className="flex h-full flex-col rounded-[14px] p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(50,45,40,.65)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,.18)",
                }}
              >
                <Quote
                  className="h-7 w-7 text-gold/70"
                  aria-hidden
                  strokeWidth={1.2}
                />
                <p className="mt-4 text-[13.5px] leading-[1.7] text-white/85">
                  {t.quote}
                </p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <Image
                    src={t.avatar}
                    alt={`Foto de ${t.name}`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-white/60">{t.event}</p>
                  </div>
                </div>
                </article>
                </div>
              </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-2.5">
          {testimonials.map((t, i) => (
            <span
              key={t.name}
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === 0 ? "w-7 bg-gold" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}