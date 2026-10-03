/**
 * Imagens do site (fora do portfólio).
 *
 * Estas cópias são independentes das pastas em `public/images/portfolio/`
 * de propósito: o cliente pode apagar ou reorganizar qualquer projeto do
 * portfólio sem risco de quebrar o Hero, o Sobre ou o Rodapé.
 *
 * O portfólio em si é gerado por `npm run portfolio` — não edite
 * `src/data/gallery.generated.ts` na mão.
 */
export const images = {
  hero: {
    src: "/images/E92657BE-C064-42B5-BD72-5CC405A6A726.JPG.webp",
    alt: "Ambiente de evento decorado pela Linear & Co. com iluminação acolhedora",
  },
  about: {
    primary: {
      src: "/images/sobre-destaque.webp",
      alt: "Mesa de evento decorada com detalhes pela Linear & Co.",
    },
    secondary: {
      src: "/images/sobre-detalhe-1.webp",
      alt: "Detalhe de decoração em evento pela Linear & Co.",
    },
    tertiary: {
      src: "/images/sobre-detalhe-2.webp",
      alt: "Celebração decorada pela equipe da Linear & Co.",
    },
  },
  testimonials: {
    src: "/images/E92657BE-C064-42B5-BD72-5CC405A6A726.JPG.webp",
    alt: "Ambiente de evento decorado pela Linear & Co. com iluminação acolhedora",
  },
  footer: {
    src: "/images/rodape.webp",
    alt: "Celebração realizada pela Linear & Co.",
  },
} as const;
