import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { services } from "@/data/services";
import { whatsappLink } from "@/data/site";
import { images } from "@/data/images";

export default function About() {
  return (
    <section id="about" className="bg-offwhite">
      <div className="mx-auto max-w-[1400px] px-[5%] py-[80px] md:py-[90px]">
        <div className="grid gap-16 md:grid-cols-[45%_55%] md:gap-10 lg:gap-16">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Reveal>
              <span className="text-[10px] font-semibold tracking-[0.24em] text-taupe">
                SOBRE A LINEAR &amp; CO.
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-5 font-serif text-[42px] leading-[0.98] font-medium text-ink md:text-[50px] lg:text-[54px]">
                Mais do que
                <br />
                decoração.
                <br />
                Criamos
                <br />
                experiências.
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-[300px] text-[14px] leading-[1.65] text-ink/70">
                Cada celebração é pensada nos mínimos detalhes para transformar
                momentos especiais em memórias inesquecíveis.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-6 text-[12px] font-medium tracking-[0.06em] text-brown">
                {services.join("  ·  ")}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-11 items-center gap-2 rounded-[9px] bg-taupe px-6 text-[12px] font-semibold tracking-[0.05em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brown"
              >
                QUERO MEU ORÇAMENTO
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto h-[440px] max-w-[540px] sm:h-[500px] md:max-w-none md:h-[560px]">
              <div className="absolute inset-0 overflow-hidden rounded-[16px]">
                <Image
                  src={images.about.primary.src}
                  alt={images.about.primary.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 44vw"
                  className="object-cover"
                />
              </div>

              <div
                className="float-card absolute top-5 left-5 z-10 flex h-[92px] w-[150px] flex-col justify-center gap-1.5 rounded-[14px] p-3.5"
                style={{
                  animationDelay: "0s",
                  background: "rgba(154,136,116,.68)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <span className="font-serif text-2xl leading-none text-white/90">
                  L
                </span>
                <p className="text-[9px] leading-[1.45] text-white">
                  Excelência em decoração e produção de eventos em Natal.
                </p>
              </div>

              <div
                className="float-card absolute -bottom-5 -right-2 w-[46%] overflow-hidden rounded-[14px] border-[5px] border-offwhite aspect-[3/4] sm:-right-4"
                style={{ animationDelay: "0.55s" }}
              >
                <Image
                  src={images.about.secondary.src}
                  alt={images.about.secondary.alt}
                  fill
                  sizes="(max-width: 768px) 41vw, 20vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}