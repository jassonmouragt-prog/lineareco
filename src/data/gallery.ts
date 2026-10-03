export interface PortfolioPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
}

export interface PortfolioProject {
  id: string;
  label: string;
  title: string;
  category: string;
  photos: PortfolioPhoto[];
}

/**
 * Como os grupos foram definidos
 * ------------------------------
 * As fotos em HEIC do próprio acervo têm EXIF (iPhone 11/13), então a data de
 * captura foi usada como evidência real de que belongem ao mesmo evento:
 *
 *   · 08/08/2026 12:38–12:42 → IMG_0050, IMG_0055, IMG_0056, IMG_0062
 *   · 01/03/2026 18:54–18:56 → 69792F6E, CDFC5B34
 *   · 04/01/2026 17:28–17:29 → 433E8963, 4289929A
 *
 * As fotos que chegaram pelo WhatsApp/DM vieram sem nenhum metadado
 * (EXIF e XMP removidos). Para elas só existe a evidência do lote de origem
 * (dimensões idênticas = mesma exportação):
 *
 *   · 2340×4160 → 3B5862A5, A1EFA107, 9166052F
 *   · 854×1280  → 46E60A32, 4C28C3F9, 79134639
 *
 * ⚠️ Os agrupamentos marcados com `provisório` abaixo ainda NÃO foram
 * confirmados visualmente. Basta reordenar os `photos` de cada projeto para
 * mudar a composição — nenhuma foto é perdida ao reagrupar.
 *
 * Nomes de clientes não são inventados: enquanto o evento não for
 * identificado, usamos rótulos neutros ("Projeto 0X") e categoria neutra.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "projeto-01",
    label: "PROJETO 01",
    title: "Projeto 01",
    category: "Celebração",
    photos: [
      {
        src: "/images/IMG_0050.webp",
        alt: "Ambientação de evento realizada pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/IMG_0055.webp",
        alt: "Mesa decorada pela Linear & Co. com arranjos e ornamentos.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/IMG_0056.webp",
        alt: "Mesa de evento decorada com detalhes pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/IMG_0062.webp",
        alt: "Cenário de celebração projetado pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
    ],
  },
  {
    id: "projeto-02",
    label: "PROJETO 02",
    title: "Projeto 02",
    category: "Celebração",
    photos: [
      {
        src: "/images/69792F6E-2BCD-47AF-802D-6D200C38347A.webp",
        alt: "Decoração de evento produzida pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/CDFC5B34-DD7B-47D2-96AC-54F095C7EB9E.webp",
        alt: "Ambiente de celebração preparado pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/34393AF3-22E7-4AD6-B093-0A34DCF0BF6F.JPG.webp",
        alt: "Arranjos e ornamentos de evento da Linear & Co.",
        width: 720,
        height: 1280,
      },
      {
        src: "/images/90EA6840-7CE4-437E-9A1E-3F7F7E7B3387.JPG.webp",
        alt: "Detalhe de decoração de evento da Linear & Co.",
        width: 887,
        height: 1183,
      },
    ],
  },
  {
    id: "projeto-03",
    label: "PROJETO 03",
    title: "Projeto 03",
    category: "Celebração",
    photos: [
      {
        src: "/images/4289929A-9746-490F-809D-338154572F91.webp",
        alt: "Mesa de evento assinada pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/433E8963-FA01-413E-B275-F4E28E271007.webp",
        alt: "Mesa decorada pela Linear & Co. para evento.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/2DA0FC65-94AC-42B3-9FDA-18BF0E1A7594.JPG.webp",
        alt: "Detalhes de mesa de evento da Linear & Co.",
        width: 1200,
        height: 1600,
      },
      {
        src: "/images/AB973DCA-BBDC-46EA-92DE-99615F6AC048.JPG.webp",
        alt: "Decoração de celebração produzida pela Linear & Co.",
        width: 960,
        height: 1280,
      },
    ],
  },
  {
    id: "projeto-04",
    label: "PROJETO 04",
    title: "Projeto 04",
    category: "Celebração",
    photos: [
      {
        src: "/images/07041D11-7233-4FFC-AE6C-3918CFF4806B.webp",
        alt: "Decoração de festa realizada pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/3B5862A5-E526-44BC-ABFA-26C957A7CE01.JPG.webp",
        alt: "Celebração decorada pela equipe da Linear & Co.",
        width: 2340,
        height: 4160,
      },
      {
        src: "/images/A1EFA107-C514-4D90-9BDA-0C7B9F7D6E35.JPG.webp",
        alt: "Ambiente decorado para celebração pela Linear & Co.",
        width: 2340,
        height: 4160,
      },
      {
        src: "/images/9166052F-F883-472C-BB03-C3B1650AAA85.JPG.webp",
        alt: "Ornamentação de celebração da Linear & Co.",
        width: 2340,
        height: 4160,
      },
    ],
  },
  {
    id: "projeto-05",
    label: "PROJETO 05",
    title: "Projeto 05",
    category: "Celebração",
    photos: [
      {
        src: "/images/6736DB5B-19E3-49AB-9A0C-0709B7D8FE8B.webp",
        alt: "Ambientação de celebração pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/46E60A32-A08E-4A91-AFB5-BE4F8C33DC01.JPG.webp",
        alt: "Mesa de celebração decorada pela Linear & Co.",
        width: 854,
        height: 1280,
      },
      {
        src: "/images/4C28C3F9-88EA-46B7-98FE-4A7C5A908403.JPG.webp",
        alt: "Detalhes de decoração em evento da Linear & Co.",
        width: 854,
        height: 1280,
      },
      {
        src: "/images/79134639-5955-4F08-A12F-D3160B6FC42F.JPG.webp",
        alt: "Mesa decorada pela Linear & Co. para evento.",
        width: 854,
        height: 1280,
      },
    ],
  },
  {
    id: "projeto-06",
    label: "PROJETO 06",
    title: "Projeto 06",
    category: "Celebração",
    photos: [
      {
        src: "/images/56E6F460-211B-4BD1-9B3F-BA5560F18A8B.webp",
        alt: "Arranjos e ornamentos de evento da Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/IMG_0798.webp",
        alt: "Ornamentos de evento produzidos pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/09080AE5-3954-4696-9AFA-2ABBFEF8FE00.webp",
        alt: "Celebração decorada pela equipe da Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/5B24BA6A-751C-4D39-9CE2-3C36F994D31F.webp",
        alt: "Cenário de evento decorado pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
    ],
  },
  {
    id: "projeto-07",
    label: "PROJETO 07",
    title: "Projeto 07",
    category: "Celebração",
    photos: [
      {
        src: "/images/3DD22690-71AD-471F-856A-E9409052993D.webp",
        alt: "Decoração de festa realizada pela Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/48C9A84A-2543-43D6-8A27-FCAE1F858CB3.webp",
        alt: "Detalhe de decoração de evento da Linear & Co.",
        width: 3024,
        height: 4032,
      },
      {
        src: "/images/25AF9764-1BE1-4720-BDB3-DDBE308459AD.webp",
        alt: "Detalhe de decoração em evento da Linear & Co.",
        width: 3024,
        height: 4032,
      },
    ],
  },
];