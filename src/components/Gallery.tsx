import Image from "next/image";
import Reveal from "@/components/Reveal";
import { galleryImages } from "@/data/gallery";
import { whatsappLink } from "@/data/site";

export default function Gallery() {
  return (
    <section id="gallery" className="bg-[#101314]">
      <div className="mx-auto max-w-[1400px] px-[2%] py-[70px] md:py-[80px]">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <Reveal>
              <span className="text-[10px] font-semibold tracking-[0.24em] text-beige">
                NOSSO TRABALHO
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-4 font-serif text-[34px] leading-[1.05] font-medium text-white md:text-[40px]">
                Momentos que já ganharam forma.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-full border border-white/25 px-5 text-[12px] font-medium tracking-[0.03em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-taupe">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              VER MAIS EVENTOS
            </a>
          </Reveal>
        </div>

        <div className="mt-12 columns-2 gap-4 lg:columns-3 xl:columns-4">
          {galleryImages.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 4) * 90}
              className="mb-4 break-inside-avoid"
            >
              <figure
                className="group float-card relative w-full overflow-hidden rounded-[12px]"
                style={{ aspectRatio: img.ratio, animationDelay: `${(i % 5) * 0.35}s` }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center rounded-[9px] bg-taupe px-7 text-[12px] font-semibold tracking-[0.05em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brown"
          >
            SOLICITAR ORÇAMENTO
          </a>
        </Reveal>
      </div>
    </section>
  );
}