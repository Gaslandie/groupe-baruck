import Link from "next/link";

import { routes } from "@/data/site";

import { Brand } from "../layout/Brand";

type ConstructionPageProps = {
  index: string;
  eyebrow: string;
  text: string;
  footerItems: string[];
};

export function ConstructionPage({ index, eyebrow, text, footerItems }: ConstructionPageProps) {
  return (
    <div className="min-h-svh bg-[#0b0c0e] text-[#fffdf8]">
      <header className="absolute inset-x-0 top-0 z-50 flex h-[92px] items-center justify-between px-[clamp(1.2rem,3.4vw,4rem)] max-tablet:h-[72px] max-tablet:px-[1.15rem]">
        <Brand />
        <Link
          href={routes.home}
          className="inline-flex items-center gap-4 border-b border-[rgba(255,255,255,.3)] pb-[.35rem] text-[.6rem] uppercase tracking-[.15em] max-tablet:border-0 max-tablet:p-[.8rem] max-tablet:text-[.55rem]"
        >
          <span className="max-tablet:hidden">Retour à l’accueil</span>
          <span className="hidden max-tablet:inline">Accueil</span>
          <span aria-hidden="true" className="text-[.8rem] text-accent">
            ↗
          </span>
        </Link>
      </header>

      <main
        id="main-content"
        className="relative isolate grid min-h-svh place-items-center overflow-hidden px-6 pb-16 pt-32 max-tablet:px-[1.2rem]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12%] top-[-22%] z-[-2] aspect-square w-[min(55vw,720px)] rounded-full border border-[rgba(255,255,255,.09)] shadow-[0_0_0_90px_rgba(255,255,255,.018),0_0_0_180px_rgba(255,255,255,.012)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-28%] left-[-14%] z-[-2] aspect-square w-[min(42vw,560px)] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,91,43,.3),rgba(220,91,43,.04)_44%,transparent_70%)] blur-[3px]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-3] bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:90px_90px] opacity-50 [mask-image:linear-gradient(90deg,transparent,#000_35%,#000_65%,transparent)]"
        />

        <div className="w-[min(900px,100%)] text-center">
          <span className="mb-8 block font-display text-[.8rem] italic text-accent">{index}</span>
          <p className="eyebrow justify-center text-[#d8c8aa] before:hidden">{eyebrow}</p>
          <h1 className="m-0 font-display text-[clamp(3.4rem,8vw,8.5rem)] font-normal leading-[.88] tracking-[-.055em] [text-wrap:balance] max-tablet:text-[clamp(3.2rem,17vw,5.2rem)]">
            Page en cours
            <em className="block font-normal text-accent">de construction.</em>
          </h1>
          <p className="mx-auto mb-[2.4rem] mt-8 max-w-[530px] text-[.88rem] leading-[1.75] text-[rgba(255,255,255,.58)] max-tablet:text-[.8rem]">
            {text}
          </p>
          <Link
            href={routes.home}
            className="inline-flex min-h-[54px] items-center justify-center gap-8 bg-[#fffdf8] px-[1.4rem] text-[.62rem] uppercase tracking-[.13em] text-[#0b0c0e] transition-[background,color,transform] duration-[250ms] hover:translate-y-[-2px] hover:bg-accent hover:text-white"
          >
            Retourner à l’accueil <span aria-hidden="true">↖</span>
          </Link>
        </div>

        <div className="absolute bottom-6 left-[clamp(1.2rem,3.4vw,4rem)] right-[clamp(1.2rem,3.4vw,4rem)] flex justify-between text-[.48rem] uppercase tracking-[.14em] text-[rgba(255,255,255,.35)] max-tablet:flex-col max-tablet:items-center max-tablet:gap-2 max-tablet:text-center">
          {footerItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </main>
    </div>
  );
}
