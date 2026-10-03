"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Maximize2 } from "lucide-react";
import Lightbox, { type LightboxPhoto } from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import { portfolioProjects, type PortfolioProject } from "@/data/gallery";
import { whatsappLink } from "@/data/site";

const MAIN_ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[1/1]"];
// O acervo é majoritariamente vertical (3/4). Mantemos as molduras em
// proporção vertical ou quadrada para não cortar mesa, arranjos e cenário.
const SIDE_ASPECTS: string[][] = [
  ["aspect-[1/1]", "aspect-[4/5]"],
  ["aspect-[4/5]", "aspect-[1/1]"],
  ["aspect-[3/4]", "aspect-[1/1]"],
];

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

function Photo({
  photo,
  index,
  aspect,
  sizes,
  priority,
  onOpen,
}: {
  photo: LightboxPhoto;
  index: number;
  aspect: string;
  sizes: string;
  priority?: boolean;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Ampliar foto: ${photo.alt}`}
      className={`group/photo relative block w-full cursor-zoom-in overflow-hidden rounded-[12px] ${aspect} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        quality={85}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover/photo:scale-[1.02]"
        style={{ objectPosition: photo.position ?? "center" }}
      />
      <span
        aria-hidden
        className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/photo:opacity-100"
      >
        <Maximize2 className="h-3 w-3" />
      </span>
    </button>
  );
}

function ProjectBlock({
  project,
  index,
  onOpen,
}: {
  project: PortfolioProject;
  index: number;
  onOpen: (projectIndex: number, photoIndex: number) => void;
}) {
  const [cover, ...rest] = project.photos;
  const isReversed = index % 2 === 1;
  const mainAspect = MAIN_ASPECTS[index % MAIN_ASPECTS.length];
  const sideAspects = SIDE_ASPECTS[index % SIDE_ASPECTS.length];
  const showAll = project.photos.length > 2;

  return (
    <article className="border-t border-white/10 pt-10 first:border-0 first:pt-0 md:pt-14">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-start md:gap-10">
        <figure
          className={`${isReversed ? "md:col-start-6 md:row-start-1" : "md:col-start-1"} md:col-span-7`}
        >
          <Photo
            photo={cover}
            index={0}
            aspect={mainAspect}
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 58vw, 44vw"
            onOpen={(photoIndex) => onOpen(index, photoIndex)}
          />
        </figure>

        <div
          className={`${isReversed ? "md:col-start-1 md:row-start-1" : "md:col-start-8 md:row-start-1"} flex flex-col gap-5 md:col-span-5`}
        >
          <Reveal delay={80}>
            <div className="max-w-[280px]">
              <span className="block h-px w-8 bg-gold" aria-hidden />
              <p className="mt-3 text-[10px] font-semibold tracking-[0.24em] text-gold">
                {project.label}
              </p>
              <h3 className="mt-2 font-serif text-[24px] leading-[1.15] font-medium text-white md:text-[27px]">
                {project.title}
              </h3>
              {project.category && (
                <p className="mt-2 text-[10px] font-medium tracking-[0.2em] text-white/45 uppercase">
                  {project.category}
                </p>
              )}
            </div>
          </Reveal>

          <div className="no-scrollbar -mr-[5%] flex snap-x snap-mandatory gap-3 overflow-x-auto pr-[5%] md:mr-0 md:flex-col md:gap-4 md:overflow-visible md:pr-0">
            {rest.map((photo, photoIndex) => (
              <div
                key={photo.src}
                className={`w-[62vw] max-w-[240px] shrink-0 snap-start md:w-auto md:max-w-none ${
                  photoIndex % 2 === 1 ? "md:translate-y-5" : ""
                }`}
              >
                <Photo
                  photo={photo}
                  index={photoIndex + 1}
                  aspect={sideAspects[photoIndex % sideAspects.length]}
                  sizes="(max-width: 768px) 62vw, (max-width: 1280px) 30vw, 22vw"
                  onOpen={(absoluteIndex) => onOpen(index, absoluteIndex)}
                />
              </div>
            ))}
          </div>

          {showAll && (
            <button
              type="button"
              onClick={() => onOpen(index, 0)}
              className="group/link flex w-fit items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase transition-colors duration-300 hover:text-white"
            >
              Ver projeto completo
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [lightbox, setLightbox] = useState<{
    projectIndex: number;
    photoIndex: number;
  } | null>(null);

  const activeProject = lightbox
    ? portfolioProjects[lightbox.projectIndex]
    : null;

  const openLightbox = (projectIndex: number, photoIndex: number) =>
    setLightbox({ projectIndex, photoIndex });

  return (
    <section id="portfolio" className="bg-[#101314]">
      <div className="mx-auto max-w-[1400px] px-[5%] pt-[80px] pb-[90px] md:pt-[100px] md:pb-[110px]">
        <div className="flex flex-col items-center gap-7 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="md:max-w-[560px]">
            <Reveal>
              <span className="text-[10px] font-semibold tracking-[0.24em] text-beige">
                NOSSO PORTFÓLIO
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-4 font-serif text-[34px] leading-[1.05] font-medium text-white md:text-[42px]">
                Momentos que ganharam forma.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 text-[13.5px] leading-[1.7] text-white/60">
                Cada celebração recebe uma identidade própria. Conheça alguns
                dos eventos que transformamos em experiências inesquecíveis.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-full border border-white/25 px-5 text-[12px] font-medium tracking-[0.03em] whitespace-nowrap text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              <WhatsappIcon className="h-4 w-4 fill-taupe" />
              VER MAIS EVENTOS
            </a>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-24">
          {portfolioProjects.map((project, index) => (
            <ProjectBlock
              key={project.id}
              project={project}
              index={index}
              onOpen={openLightbox}
            />
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center md:mt-24">
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

      {activeProject && lightbox && (
        <Lightbox
          photos={activeProject.photos}
          index={lightbox.photoIndex}
          label={`${activeProject.label} · ${activeProject.title}`}
          onClose={() => setLightbox(null)}
          onNavigate={(photoIndex) =>
            setLightbox((current) =>
              current ? { ...current, photoIndex } : current,
            )
          }
        />
      )}
    </section>
  );
}