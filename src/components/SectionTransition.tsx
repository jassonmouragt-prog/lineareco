interface SectionTransitionProps {
  tone: "light" | "dark";
}

export default function SectionTransition({ tone }: SectionTransitionProps) {
  return (
    <div
      aria-hidden
      className={tone === "light" ? "bg-offwhite" : "bg-[#101314]"}
    >
      <div className="mx-auto flex max-w-[1400px] justify-center px-[5%] py-12">
        <span className="flex items-center gap-3">
          <span className="h-px w-10 bg-taupe/45 md:w-16" />
          <span className="h-[5px] w-[5px] rotate-45 bg-taupe/70" />
          <span className="h-px w-10 bg-taupe/45 md:w-16" />
        </span>
      </div>
    </div>
  );
}