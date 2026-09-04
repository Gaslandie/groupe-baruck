"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { HeroAction, HeroSlide } from "@/data/home";
import { imageUrl } from "@/lib/asset";

const SLIDE_DURATION = 5000;
const CHANGE_DURATION = 260;

function SlideAction({ action, secondary = false }: { action: HeroAction; secondary?: boolean }) {
  const className = [
    "inline-flex items-center gap-4 border-b border-current pb-[.45rem] text-[.65rem] uppercase tracking-[.13em] max-tablet:text-[.55rem]",
    secondary ? "text-[rgba(255,255,255,.62)]" : "",
  ].join(" ");
  const content = (
    <>
      {action.label} <span className="text-accent">↗</span>
    </>
  );

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionKey, setMotionKey] = useState(0);
  const activeIndexRef = useRef(0);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef(SLIDE_DURATION);
  const slideStartedAtRef = useRef(0);
  const touchStartXRef = useRef(0);
  const showSlideRef = useRef<(index: number) => void>(() => undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const scheduleNext = useCallback(
    (delay: number) => {
      clearTimer();
      remainingTimeRef.current = delay;
      slideStartedAtRef.current = performance.now();
      if (!pausedRef.current && !reducedMotionRef.current) {
        timerRef.current = setTimeout(
          () => showSlideRef.current(activeIndexRef.current + 1),
          delay,
        );
      }
    },
    [clearTimer],
  );

  const showSlide = useCallback(
    (index: number) => {
      clearTimer();
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      setIsChanging(true);

      transitionTimerRef.current = setTimeout(() => {
        const nextIndex = (index + slides.length) % slides.length;
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIsChanging(false);
        setMotionKey((key) => key + 1);
        scheduleNext(SLIDE_DURATION);
      }, CHANGE_DURATION);
    },
    [clearTimer, scheduleNext, slides.length],
  );

  useEffect(() => {
    showSlideRef.current = showSlide;
  }, [showSlide]);

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = shouldReduceMotion;
    const stateFrame = window.requestAnimationFrame(() => {
      setReducedMotion(shouldReduceMotion);
      if (!shouldReduceMotion) setMotionKey((key) => key + 1);
    });

    if (!shouldReduceMotion) {
      scheduleNext(SLIDE_DURATION);
    }

    return () => {
      window.cancelAnimationFrame(stateFrame);
      clearTimer();
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [clearTimer, scheduleNext]);

  const setPaused = (paused: boolean) => {
    if (paused === pausedRef.current) return;

    if (paused) {
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - (performance.now() - slideStartedAtRef.current),
      );
      clearTimer();
      pausedRef.current = true;
      setIsPaused(true);
      return;
    }

    pausedRef.current = false;
    setIsPaused(false);
    scheduleNext(remainingTimeRef.current);
  };

  const slide = slides[activeIndex];
  const animationState = isPaused ? "[animation-play-state:paused]" : "";

  return (
    <div
      id="activity-carousel"
      tabIndex={0}
      aria-roledescription="carrousel"
      aria-label="Groupe Baruck en Guinée"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showSlide(activeIndexRef.current - 1);
        if (event.key === "ArrowRight") showSlide(activeIndexRef.current + 1);
      }}
      onTouchStart={(event) => {
        touchStartXRef.current = event.changedTouches[0].screenX;
      }}
      onTouchEnd={(event) => {
        const distance = event.changedTouches[0].screenX - touchStartXRef.current;
        if (Math.abs(distance) > 45) showSlide(activeIndexRef.current + (distance < 0 ? 1 : -1));
      }}
      className={[
        "relative min-h-[max(100svh,760px)] overflow-hidden border-l border-[rgba(255,255,255,.16)] bg-[#101317] max-tablet:min-h-[72svh] max-tablet:border-l-0 max-tablet:border-t",
        isChanging ? "is-changing" : "",
        isPaused ? "is-paused" : "",
      ].join(" ")}
    >
      <div
        id="carousel-stage"
        aria-live="polite"
        className={[
          "absolute inset-0 overflow-hidden transition-opacity duration-500 ease-[ease]",
          isChanging ? "opacity-[.15]" : "opacity-100",
        ].join(" ")}
        style={{ background: slide.bg }}
      >
        <div
          key={`image-${activeIndex}-${motionKey}`}
          className={[
            "absolute inset-0 scale-[1.02] bg-cover will-change-transform",
            reducedMotion ? "" : "animate-hero-zoom",
            animationState,
          ].join(" ")}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(8,9,10,.12), rgba(8,9,10,.04)), url("${imageUrl(slide.image)}"), ${slide.art}`,
            backgroundPosition: `center, ${slide.position}, center`,
            backgroundSize: "cover, cover, cover",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,.15),rgba(7,8,9,.25)_42%,rgba(7,8,9,.92)_100%)]" />
      </div>

      <div
        className={[
          "absolute bottom-[clamp(5rem,11vh,9rem)] left-[clamp(1.5rem,4vw,4rem)] right-[clamp(1.5rem,4vw,6rem)] z-[2] transition-[opacity,transform] duration-[250ms] max-tablet:static max-tablet:px-[1.3rem] max-tablet:pt-[3.5rem] max-tablet:pb-[4.8rem]",
          isChanging ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        ].join(" ")}
      >
        <h2 className="mb-[1.2rem] mt-[.8rem] max-w-[830px] text-balance font-display text-[clamp(3.3rem,6vw,7rem)] font-normal leading-[.88] tracking-[-.05em] max-desktop:text-[clamp(3rem,6vw,5.2rem)] max-tablet:text-[clamp(3.2rem,15vw,5.4rem)]">
          {slide.title}
        </h2>
        <p className="mb-[1.7rem] max-w-[490px] text-[clamp(.85rem,1.1vw,1.05rem)] leading-[1.6] text-[rgba(255,255,255,.7)] max-tablet:max-w-[calc(100%-105px)] max-tablet:text-[.8rem]">
          {slide.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-[1.25rem] max-tablet:max-w-[calc(100%-90px)] max-tablet:gap-x-4 max-tablet:gap-y-[.7rem]">
          <SlideAction action={slide.primary} />
          <SlideAction action={slide.secondary} secondary />
        </div>
      </div>

      <div className="absolute bottom-[clamp(5.2rem,11vh,9.2rem)] right-[clamp(1.5rem,4vw,4rem)] z-[3] flex max-tablet:bottom-20 max-tablet:right-[1.3rem]">
        <button
          type="button"
          aria-label="Activité précédente"
          onClick={() => showSlide(activeIndexRef.current - 1)}
          className="h-12 w-12 cursor-pointer border border-[rgba(255,255,255,.3)] bg-[rgba(0,0,0,.12)] text-ivory transition-[background,color] duration-[250ms] hover:bg-ivory hover:text-ink max-tablet:h-[42px] max-tablet:w-[42px]"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Activité suivante"
          onClick={() => showSlide(activeIndexRef.current + 1)}
          className="h-12 w-12 cursor-pointer border border-l-0 border-[rgba(255,255,255,.3)] bg-[rgba(0,0,0,.12)] text-ivory transition-[background,color] duration-[250ms] hover:bg-ivory hover:text-ink max-tablet:h-[42px] max-tablet:w-[42px]"
        >
          →
        </button>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[3] h-[3px] bg-[rgba(255,255,255,.15)]">
        <i
          key={`progress-${activeIndex}-${motionKey}`}
          className={[
            "block h-full w-0 bg-accent",
            reducedMotion ? "" : "animate-progress",
            animationState,
          ].join(" ")}
        />
      </div>
    </div>
  );
}
