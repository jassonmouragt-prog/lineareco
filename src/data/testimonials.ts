import { avatars } from "@/data/images";

export interface Testimonial {
  quote: string;
  name: string;
  event: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "A Lineareco superou todas as nossas expectativas! Cada detalhe foi pensado com muito carinho, e o resultado foi um evento impecável e inesquecível.",
    name: "Juliana M.",
    event: "Aniversário de 30 anos",
    avatar: avatars.juliana,
  },
  {
    quote:
      "Profissionais incríveis! Organização, pontualidade e uma decoração que deixou todos os convidados encantados. Recomendo de olhos fechados!",
    name: "Carlos & Marina",
    event: "Casamento",
    avatar: avatars.carlosMarina,
  },
  {
    quote:
      "Atendimento maravilhoso do início ao fim. A Lineareco transmite confiança e transforma ideias em experiências lindas e cheias de significado.",
    name: "Amanda L.",
    event: "Festa Infantil",
    avatar: avatars.amanda,
  },
];