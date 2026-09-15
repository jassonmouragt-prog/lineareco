import Image from "next/image";
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
              Experiências reais,
              <br className="hidden md:block" /> memórias que ficam.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.title} delay={i * 90} className="mb-5">
              <figure className="group overflow-hidden rounded-[14px] border border-white/15 bg-black/20">
                <div className="relative">
                  <Image
                    src={t.images[0]}
                    alt={`Depoimento: ${t.title}`}
                    width={739}
                    height={1600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block h-px w-8 bg-gold" aria-hidden />
                    <p className="mt-2.5 font-serif text-[19px] leading-snug font-medium text-white">
                      {t.title}
                    </p>
                  </figcaption>
                </div>
                {t.images.length > 1 && (
                  <Image
                    src={t.images[1]}
                    alt={`Depoimento: ${t.title}`}
                    width={739}
                    height={1600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-auto w-full border-t border-white/15 object-cover"
                  />
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}