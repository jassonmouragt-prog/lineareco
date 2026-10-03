export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  quote: string;
}

/**
 * Textos extraídos dos depoimentos reais que já existiam no projeto
 * (prints de WhatsApp/Instagram em /public/images/depoimentos).
 * Nenhum texto aqui foi inventado — apenas transcrito e revisado
 * para remove artefatos de leitura (acentuação e pontuação).
 */
export const testimonials: Testimonial[] = [
  {
    id: "duda-guedes",
    name: "Duda Guedes",
    eventType: "Aniversário intimista",
    quote:
      "Pelo segundo ano consecutivo, fecho meus aniversários com a Linear! Paloma, como sempre, é extremamente sofisticada em tudo que faz e não mede esforços para transformar cada desejo em realidade e deixar tudo perfeito. Sou cliente e indico de olhos fechados!\n\nAtendimento impecável, muito capricho e qualidade em cada detalhe.",
  },
  {
    id: "hemily-beatriz",
    name: "Hemily Beatriz",
    eventType: "Aniversário intimista",
    quote:
      "Eu amei cada detalhe! Grata por fazer parte desse momento especial e me ajudar em cada detalhe.",
  },
  {
    id: "rebeca-mateus",
    name: "Rebeca e Mateus",
    eventType: "Casamento",
    quote:
      "Passando mais uma vez para agradecer a você por TUDO. Foi tudo muito lindo, além do que idealizei. Todo mundo comentando da decoração impecável que ficou tudo. Ansiosa pelas fotos pra postar tudo e fazer a sua propaganda.\n\nEssa decoração deu o que falar viuuu, um monte de compartilhamentos e salvos. Fora os comentários que as pessoas fizeram. O gerente de lá falou que foi um dos mais simples e lindo casamento que teve lá.",
  },
  {
    id: "viviane-damyhonn",
    name: "Viviane & Damyhonn",
    eventType: "Jantar de noivado",
    quote:
      "Queria te agradecer por todo o carinho, cuidado e dedicação com a decoração do nosso noivado. Ficou tudo lindo e exatamente com a sensibilidade e aconchego que imaginávamos para esse momento tão especial. Obrigada por ter ajudado a transformar esse dia em uma lembrança tão bonita.",
  },
];