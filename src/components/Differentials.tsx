import { Crown, Diamond, PencilLine, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { differentials } from "@/data/services";

const icons = [PencilLine, Diamond, Users, Crown];

export default function Differentials() {
  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-[1400px] px-[5%] py-[80px] md:py-[96px]">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="text-[10px] font-semibold tracking-[0.24em] text-taupe">
              NOSSOS DIFERENCIAIS
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-4 font-serif text-[36px] leading-[1.05] font-medium text-ink md:text-[42px]">
              Tudo pensado para o seu momento.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {differentials.map((item, i) => {
            const Icon = icons[i] ?? PencilLine;
            return (
              <Reveal key={item.title} delay={i * 100}>
                <div
                  className="float-card"
                  style={{ animationDelay: `${i * 0.9}s` }}
                >
                  <article
                    className="group flex min-h-[170px] w-full flex-col justify-between rounded-[14px] border p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,.7)",
                      borderColor: "rgba(150,130,110,.10)",
                      boxShadow: "0 14px 30px -22px rgba(16,19,20,.25)",
                    }}
                  >
                  <Icon
                    className="h-5 w-5 text-taupe transition-colors duration-300 group-hover:text-brown"
                    aria-hidden
                  />
                  <div>
                    <h3 className="text-[12px] font-semibold tracking-[0.14em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[12px] leading-[1.6] text-ink/60">
                      {item.text}
                    </p>
                  </div>
                  </article>
                  </div>
                </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}