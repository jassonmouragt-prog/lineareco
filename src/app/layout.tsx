import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lineareco | Decoração e Eventos em Natal",
  description:
    "Criamos experiências únicas para celebrações especiais, com decoração, curadoria e produção de eventos em Natal — RN.",
  keywords: [
    "decoração de eventos",
    "linareco",
    "festas em natal",
    "casamento natal rn",
    "produção de eventos",
  ],
  authors: [{ name: "Lineareco" }],
  openGraph: {
    title: "Lineareco | Decoração e Eventos em Natal",
    description:
      "Criamos experiências únicas para celebrações especiais, com decoração, curadoria e produção de eventos em Natal — RN.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}