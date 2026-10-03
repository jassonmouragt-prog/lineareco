export const BRAND_NAME = "Linear & Co.";
export const BRAND_NAME_UPPER = "LINEAR & CO.";

export const WHATSAPP_NUMBER = "5584999999999";
export const INSTAGRAM_HANDLE = "@lineareco";
export const INSTAGRAM_URL = "https://www.instagram.com/lineareco";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Quero solicitar um orçamento da Linear & Co.";

export function whatsappLink(
  message: string = WHATSAPP_DEFAULT_MESSAGE,
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Portfólio", href: "#portfolio" },
  { label: "Sobre", href: "#about" },
  { label: "Diferenciais", href: "#differentials" },
  { label: "Depoimentos", href: "#testimonials" },
  { label: "Contato", href: "#footer" },
] as const;