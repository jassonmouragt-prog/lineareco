"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  BRAND_NAME,
  BRAND_NAME_UPPER,
  NAV_LINKS,
  whatsappLink,
} from "@/data/site";

const Logo = () => (
  <a href="#inicio" className="flex items-center gap-2 sm:gap-3">
    <Image
      src="/logo.png"
      alt={`${BRAND_NAME} — Decoração e eventos`}
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
    />
    <span className="font-serif text-[13px] tracking-[0.16em] whitespace-nowrap text-white sm:text-[17px]">
      {BRAND_NAME_UPPER}
    </span>
  </a>
);

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-[calc(100%-40px)] max-w-[1440px]">
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(15,15,14,.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "0 0 18px 18px",
          }}
        >
          <Logo />

          <nav className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium tracking-[0.02em] text-white/85 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full bg-taupe px-5 text-[12px] font-semibold tracking-[0.04em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brown sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              SOLICITAR ORÇAMENTO
            </a>

            <button
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="mx-auto w-[calc(100%-40px)] max-w-[1440px] lg:hidden"
          style={{
            background: "rgba(21,24,25,.92)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "0 0 18px 18px",
          }}
        >
          <nav className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 text-sm text-white/85 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 flex h-11 items-center justify-center rounded-full bg-taupe text-[12px] font-semibold tracking-[0.04em] text-white"
            >
              SOLICITAR ORÇAMENTO
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}