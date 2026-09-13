"use client";

import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}

export default function Reveal({
  children,
  className,
  delay,
  style,
}: RevealProps) {
  const merged: CSSProperties = { ...style };
  if (delay) merged.animationDelay = `${delay}ms`;

  return (
    <div className={className} style={merged}>
      {children}
    </div>
  );
}
