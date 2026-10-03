import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Header from "@/components/Header";
import { BRAND_NAME, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/data/site";
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

const TITLE = "Linear & Co. | Decoração e Eventos em Natal RN";
const DESCRIPTION =
  "Decoração e produção de eventos em Natal/RN. A Linear & Co. cria celebrações personalizadas com elegância, curadoria e atenção a cada detalhe.";
const SITE_URL = "https://lineareco.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "decoração de eventos",
    "linear & co",
    "lineareco",
    "festas em natal",
    "casamento natal rn",
    "produção de eventos",
    "decoração de casamento",
    "eventos intimateiros natal",
  ],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/E92657BE-C064-42B5-BD72-5CC405A6A726.JPG.webp",
        width: 1280,
        height: 854,
        alt: `${BRAND_NAME} — decoração e produção de eventos em Natal/RN`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      "/images/E92657BE-C064-42B5-BD72-5CC405A6A726.JPG.webp",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: BRAND_NAME,
      description: DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/images/E92657BE-C064-42B5-BD72-5CC405A6A726.JPG.webp`,
      telephone: `+${WHATSAPP_NUMBER}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Natal",
        addressRegion: "RN",
        addressCountry: "BR",
      },
      areaServed: {
        "@type": "City",
        name: "Natal",
      },
      sameAs: [INSTAGRAM_URL],
      knowsAbout: [
        "Decoração de eventos",
        "Produção de eventos",
        "Casamentos",
        "Aniversários",
        "Jantares de noivado",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: [INSTAGRAM_URL],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}