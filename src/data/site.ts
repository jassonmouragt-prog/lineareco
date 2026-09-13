export const WHATSAPP_NUMBER = "5584999999999";
export const INSTAGRAM_HANDLE = "@camilly6568";
export const INSTAGRAM_URL = "https://www.instagram.com/camilly6568";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Quero solicitar um orçamento da Lineareco.";

export function whatsappLink(
  message: string = WHATSAPP_DEFAULT_MESSAGE,
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Nossos eventos", href: "#gallery" },
  { label: "Decoração", href: "#about" },
  { label: "Sobre nós", href: "#about" },
  { label: "Galeria", href: "#gallery" },
  { label: "Contato", href: "#footer" },
] as const;