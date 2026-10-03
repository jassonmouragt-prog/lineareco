"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  index: number | null;
  label: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SWIPE_THRESHOLD = 48;

export default function Lightbox({
  photos,
  index,
  label,
  onClose,
  onNavigate,
}: LightboxProps) {
  const open = index !== null;
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null || photos.length === 0) return;
      onNavigate((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, go, onClose]);

  if (!open || index === null) return null;

  const photo = photos[index];
  if (!photo) return null;

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de fotos — ${label}`}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(8,9,10,.96)" }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <p className="text-[10px] font-semibold tracking-[0.24em] text-beige">
          {label}
        </p>
        <p className="text-[11px] font-medium tabular-nums tracking-[0.16em] text-white/60">
          {index + 1} / {photos.length}
        </p>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20 md:pb-6"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            quality={88}
            className="object-contain"
            style={{ objectPosition: photo.position ?? "center" }}
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(event) => {
                event.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:bg-white/10 md:left-6"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={(event) => {
                event.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:bg-white/10 md:right-6"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center pb-5">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-white/60 uppercase transition-colors duration-300 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
          Fechar
        </button>
      </div>
    </div>
  );
}