import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, whatsappLink } from "@/data/site";
import { images } from "@/data/images";
import { galleryImages } from "@/data/gallery";

const footerFeatures = [
  "Resposta rápida",
  "Atendimento humanizado",
  "Projetos exclusivos",
];

const InstagramIcon = ({ className, ...props }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const thumbs = galleryImages.slice(0, 4);

  return (
    <footer id="footer" className="bg-ink">
      <div className="relative">
        <div className="relative overflow-hidden">
          <Image
            src={images.footer.src}
            alt={images.footer.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,19,20,.94) 0%, rgba(16,19,20,.88) 45%, rgba(16,19,20,.96) 100%)",
            }}
          />

          <div className="relative mx-auto max-w-[1400px] px-[5%] pt-[80px] pb-16 md:pt-[90px]">
            <div className="grid gap-12 md:grid-cols-[25%_20%_55%] md:gap-10">
              <div>
                <Reveal>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="Lineareco — Decoração e eventos"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                    <span className="font-serif text-[22px] tracking-[0.16em] text-white">
                      LINEARECO
                    </span>
                  </div>
                  <p className="mt-5 text-[13px] leading-[1.7] text-white/65">
                    Criamos momentos únicos com sofisticação e amor.
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-[12px] text-white/60">
                    <MapPin className="h-4 w-4 text-gold" aria-hidden />
                    Natal — RN
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-[12px] text-white/60 transition-colors hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4 text-gold" aria-hidden />
                    {INSTAGRAM_HANDLE}
                  </a>
                </Reveal>
              </div>

              <div>
                <Reveal delay={90}>
                  <h3 className="text-[11px] font-semibold tracking-[0.22em] text-beige">
                    LINKS
                  </h3>
                  <ul className="mt-5 space-y-3">
                    <li>
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-white/70 transition-colors hover:text-white"
                      >
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-white/70 transition-colors hover:text-white"
                      >
                        WhatsApp
                      </a>
                    </li>
                    <li>
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-white/70 transition-colors hover:text-white"
                      >
                        Contato
                      </a>
                    </li>
                  </ul>
                </Reveal>
              </div>

              <div>
                <Reveal delay={150}>
                  <div
                    className="float-card flex h-full flex-col justify-between gap-6 rounded-[15px] p-7"
                    style={{
                      background: "rgba(16,19,20,.55)",
                      border: "1px solid rgba(255,255,255,.14)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center justify-center rounded-[9px] bg-taupe px-6 text-[12px] font-semibold tracking-[0.06em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brown"
                    >
                      QUERO SOLICITAR MEU ORÇAMENTO
                    </a>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                      {footerFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-[12px] text-white/70"
                        >
                          <Check className="h-3.5 w-3.5 text-gold" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0d0f10]">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-5 px-[5%] py-5">
            <p className="text-[12px] text-white/45">
              © 2024 Lineareco. Todos os direitos reservados.
            </p>
            <div className="flex gap-2.5">
              {thumbs.map((img) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={60}
                  height={40}
                  className="h-10 w-[60px] rounded-[5px] object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}