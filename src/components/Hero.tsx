import Image from "next/image";
import { Heart, MapPin, Flower2, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/data/site";
import { images } from "@/data/images";

const heroCards = [
  {
    icon: Star,
    title: "Eventos",
    subtitle: "personalizados",
  },
  {
    icon: Flower2,
    title: "Decoração",
    subtitle: "exclusiva",
  },
  {
    icon: Heart,
    title: "Momentos",
    subtitle: "inesquecíveis",
  },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative md:h-[650px]">
      <Image
        src={images.hero.src}
        alt={images.hero.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,11,12,.88) 0%, rgba(10,11,12,.5) 48%, rgba(10,11,12,.28) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,19,20,.55) 0%, rgba(16,19,20,0) 26%, rgba(16,19,20,.35) 100%)",
        }}
      />

      <div className="relative px-[14px] py-3">
        <div
          className="relative overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,.22)",
            borderRadius: "18px",
          }}
        >
          <div className="relative flex flex-col justify-between gap-12 px-[6%] pt-[110px] pb-8 md:h-[626px] md:gap-0 md:py-[15%]">
            <div className="flex flex-col items-center text-center md:block md:w-[70%] md:text-left">
              <Reveal>
                <h1 className="max-w-[430px] font-serif text-[46px] leading-[0.98] font-medium text-white lg:text-[58px] xl:text-[64px]">
                  Seu evento
                  <br />
                  começa nos
                  <br />
                  detalhes.
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-5 max-w-[420px] text-[15px] leading-[1.5] text-white/80">
                  Criamos momentos únicos com sofisticação e amor.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium tracking-wide text-white/70 md:justify-start">
                  <MapPin className="h-4 w-4 text-gold" aria-hidden />
                  Natal · RN
                </p>
              </Reveal>

              <Reveal delay={280}>
                <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center rounded-[9px] bg-taupe px-6 text-[12px] font-semibold tracking-[0.05em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brown"
                  >
                    SOLICITAR ORÇAMENTO
                  </a>
                  <a
                    href="#gallery"
                    className="flex h-11 items-center justify-center rounded-[9px] border border-white/40 px-6 text-[12px] font-semibold tracking-[0.05em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    VER NOSSOS EVENTOS
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="flex flex-col items-center gap-3 pb-1 md:absolute md:top-[24%] md:right-[3.5%] md:flex-col md:gap-[10px]">
              {heroCards.map((card, i) => (
                <Reveal key={card.title} delay={180 + i * 130} className="w-full max-w-[240px] md:w-auto">
                  <div
                    className="float-card flex h-[64px] w-full items-center gap-3 rounded-[14px] px-4 md:h-[72px] md:w-[190px]"
                    style={{
                      animationDelay: `${i * 0.9}s`,
                      background: "rgba(90,75,65,.45)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,.22)",
                      boxShadow: "0 10px 30px -18px rgba(0,0,0,.5)",
                    }}
                  >
                    <card.icon className="h-5 w-5 shrink-0 text-gold" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-[13px] leading-tight font-medium text-white">
                        {card.title}
                      </p>
                      <p className="text-[11px] leading-tight text-white/70">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}