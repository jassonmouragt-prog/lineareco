import { Calendar, FileText, MessageCircle, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { processSteps } from "@/data/services";

const icons = [MessageCircle, FileText, Calendar, Sparkles];

export default function Process() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1400px] px-[5%] pb-[90px] md:pb-[110px]">
        <Reveal className="flex flex-col items-center text-center">
          <span className="text-[10px] font-semibold tracking-[0.24em] text-taupe">
            COMO TRABALHAMOS
          </span>
          <h2 className="mt-4 max-w-[560px] font-serif text-[34px] leading-[1.08] font-medium text-ink md:text-[42px]">
            Do primeiro contato ao momento inesquecível.
          </h2>
        </Reveal>

        <div className="relative mt-16 hidden lg:block">
          <div
            aria-hidden
            className="absolute top-6 left-[10%] right-[10%] border-t border-dashed border-taupe/60"
          />
          <div className="relative grid grid-cols-4 gap-6">
            {processSteps.map((step, i) => {
              const Icon = icons[i] ?? Sparkles;
              return (
                <Reveal key={step.step} delay={i * 110} className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-taupe">
                      <Icon className="h-5 w-5 text-white" aria-hidden />
                    </div>
                    <span className="mt-5 text-[11px] font-semibold tracking-[0.2em] text-taupe">
                      {step.step}
                    </span>
                    <h3 className="mt-2 font-serif text-[22px] leading-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-[210px] text-[12.5px] leading-[1.65] text-ink/60">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-0 lg:hidden">
          {processSteps.map((step, i) => {
            const Icon = icons[i] ?? Sparkles;
            return (
              <Reveal key={step.step} delay={i * 90}>
                <div className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-taupe">
                      <Icon className="h-5 w-5 text-white" aria-hidden />
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="my-2 w-px flex-1 border-l border-dashed border-taupe/60" />
                    )}
                  </div>
                  <div className="pt-2.5">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-taupe">
                      {step.step}
                    </span>
                    <h3 className="mt-1 font-serif text-[22px] leading-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[440px] text-[12.5px] leading-[1.65] text-ink/60 md:ml-0">
                      {step.text}
                    </p>
                    {i < processSteps.length - 1 && (
                      <div className="my-6 h-px w-full border-t border-dashed border-taupe/40" />
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}