"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  assistantMeta,
  assistantNodes,
  isAssistantNodeId,
  startOptionsFor,
  type AssistantNodeId,
  type AssistantOption,
} from "@/data/assistant";

type Entry = { kind: "bot"; node: AssistantNodeId } | { kind: "user"; label: string };

type StoredState = { open: boolean; entries: Entry[] };

const startEntry: Entry = { kind: "bot", node: "start" };

const STORAGE_KEY = "baruck-assistant";
const TYPING_DELAY = 450;
const MAX_ENTRIES = 60;

/* Le fil est conservé pendant la session de navigation (onglet) pour survivre aux liens
   internes proposés par l'assistant. Aucune donnée personnelle : identifiants de nœuds
   et libellés d'options uniquement. Stockage bloqué → l'assistant repart de zéro. */
function readStoredState(): StoredState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { open, entries } = parsed as Partial<StoredState>;
    if (!Array.isArray(entries)) return null;
    const valid = entries.filter(
      (entry): entry is Entry =>
        !!entry &&
        typeof entry === "object" &&
        ((entry.kind === "bot" && isAssistantNodeId(entry.node)) ||
          (entry.kind === "user" && typeof entry.label === "string")),
    );
    return { open: open === true, entries: valid };
  } catch {
    return null;
  }
}

function writeStoredState(state: StoredState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible : aucune persistance */
  }
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.4 3.3A.6.6 0 0 1 4.6 18.8V16A1.5 1.5 0 0 1 4 14.5v-9Z" />
      <path d="M8 9h8M8 12h5" strokeLinecap="round" />
    </svg>
  );
}

const optionClass =
  "cursor-pointer border border-[rgba(255,255,255,.28)] bg-transparent px-[.8rem] py-[.5rem] text-left text-[.7rem] leading-[1.35] text-ivory transition-[background,border-color] duration-[200ms] hover:border-ivory hover:bg-[rgba(255,255,255,.08)] focus-visible:border-ivory focus-visible:bg-[rgba(255,255,255,.08)]";

const footerActionClass =
  "cursor-pointer border-0 bg-transparent p-0 text-[.56rem] uppercase tracking-[.16em] text-[rgba(255,255,255,.68)] transition-colors duration-[200ms] hover:text-ivory focus-visible:text-ivory";

export function SiteAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typing, setTyping] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);
  const restoredRef = useRef(false);
  const focusOnCloseRef = useRef(false);

  /* Restauration de la session (système externe : sessionStorage), une seule fois après le montage. */
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const restore = () => {
      const stored = readStoredState();
      if (!stored) return;
      setEntries(stored.entries.length ? stored.entries : [startEntry]);
      setOpen(stored.open);
    };
    restore();
  }, []);

  /* Rien n'est écrit tant que le visiteur n'a pas ouvert l'assistant. */
  useEffect(() => {
    if (!restoredRef.current || !entries.length) return;
    writeStoredState({ open, entries });
  }, [open, entries]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  /* Ouverture : focus sur le titre, Échap ferme. Fermeture demandée par le visiteur : focus au lanceur. */
  useEffect(() => {
    if (!open) {
      if (focusOnCloseRef.current) {
        focusOnCloseRef.current = false;
        launcherRef.current?.focus();
      }
      return;
    }

    const focusTimer = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 60);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      focusOnCloseRef.current = true;
      setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries, typing, open]);

  const pushBot = useCallback((node: AssistantNodeId, base: Entry[]) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const botEntry: Entry = { kind: "bot", node };
    const commit = () => {
      typingTimer.current = null;
      setTyping(false);
      setEntries([...base, botEntry].slice(-MAX_ENTRIES));
    };
    if (reduceMotion) {
      commit();
      return;
    }
    setTyping(true);
    typingTimer.current = window.setTimeout(commit, TYPING_DELAY);
  }, []);

  const choose = (option: AssistantOption) => {
    if (typing) return;
    const withUser: Entry[] = [...entries, { kind: "user", label: option.label }];
    if ("next" in option) {
      setEntries(withUser);
      pushBot(option.next, withUser);
      return;
    }
    /* Lien : le fil est écrit tout de suite pour survivre à la navigation. */
    const encoreEntry: Entry = { kind: "bot", node: "encore" };
    const next: Entry[] = [...withUser, encoreEntry].slice(-MAX_ENTRIES);
    writeStoredState({ open: true, entries: next });
    setEntries(next);
  };

  const restart = () => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = null;
    setTyping(false);
    setEntries([startEntry]);
  };

  const talkToHuman = () => {
    if (typing) return;
    const withUser: Entry[] = [...entries, { kind: "user", label: assistantMeta.humanLabel }];
    setEntries(withUser);
    pushBot("humain", withUser);
  };

  const close = () => {
    focusOnCloseRef.current = true;
    setOpen(false);
  };

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    if (!entries.length) setEntries([startEntry]);
    setOpen(true);
  };

  const optionsFor = (node: AssistantNodeId): AssistantOption[] =>
    node === "start" || node === "encore" ? startOptionsFor(pathname) : assistantNodes[node].options;

  const lastIndex = entries.length - 1;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        aria-label={open ? assistantMeta.closeLabel : assistantMeta.openLabel}
        aria-expanded={open}
        aria-controls="site-assistant"
        onClick={toggle}
        className={[
          "fixed bottom-[clamp(1rem,3vw,1.75rem)] right-[clamp(1rem,3vw,1.75rem)] z-[70] flex h-[56px] cursor-pointer items-center gap-[.7rem] rounded-full border border-[rgba(255,255,255,.18)] bg-ink pl-[1.05rem] pr-[1.25rem] text-[.6rem] uppercase tracking-[.16em] text-ivory shadow-[0_18px_40px_rgba(0,0,0,.28)] transition-[transform,background-color] duration-[250ms] hover:translate-y-[-2px] hover:bg-[#1b1c20] max-tablet:h-[52px] max-tablet:w-[52px] max-tablet:justify-center max-tablet:p-0",
          open ? "max-tablet:hidden" : "",
        ].join(" ")}
      >
        <ChatIcon />
        <span className="max-tablet:hidden">{open ? "Fermer" : assistantMeta.launcher}</span>
      </button>

      {open ? (
        <section
          id="site-assistant"
          role="dialog"
          aria-labelledby="site-assistant-title"
          className="animate-assistant-in fixed bottom-[calc(clamp(1rem,3vw,1.75rem)+68px)] right-[clamp(1rem,3vw,1.75rem)] z-[70] flex max-h-[min(640px,calc(100svh-120px))] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border border-[rgba(255,255,255,.14)] bg-ink text-ivory shadow-[0_30px_70px_rgba(0,0,0,.35)] max-tablet:inset-x-0 max-tablet:bottom-0 max-tablet:max-h-[82svh] max-tablet:w-auto max-tablet:max-w-none max-tablet:border-x-0 max-tablet:border-b-0"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,.14)] px-[1.1rem] py-[.9rem]">
            <div>
              <h2
                id="site-assistant-title"
                ref={headingRef}
                tabIndex={-1}
                className="m-0 font-display text-[1.2rem] font-normal leading-[1.1] tracking-[-.02em] outline-none"
              >
                {assistantMeta.name}
              </h2>
              <p className="mb-0 mt-[.3rem] text-[.56rem] uppercase tracking-[.14em] text-[rgba(255,255,255,.6)]">
                {assistantMeta.tagline}
              </p>
            </div>
            <button
              type="button"
              aria-label={assistantMeta.closeLabel}
              onClick={close}
              className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[.56rem] uppercase tracking-[.16em] text-inherit"
            >
              <span className="max-tablet:hidden">Fermer</span>
              <span aria-hidden="true" className="font-sans text-[1.6rem] font-normal leading-none">
                ×
              </span>
            </button>
          </div>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation avec l’assistant"
            tabIndex={0}
            className="flex flex-1 flex-col gap-[.9rem] overflow-y-auto px-[1.1rem] py-[1rem]"
          >
            {entries.map((entry, index) => {
              const isLast = index === lastIndex;
              if (entry.kind === "user") {
                return (
                  <div key={index} className="animate-assistant-in flex flex-col items-end gap-[.3rem]">
                    <span className="text-[.5rem] uppercase tracking-[.16em] text-[rgba(255,255,255,.45)]">
                      {assistantMeta.userSpeaker}
                    </span>
                    <p className="m-0 max-w-[85%] bg-accent px-[.9rem] py-[.6rem] text-[.8rem] leading-[1.5]">{entry.label}</p>
                  </div>
                );
              }

              const node = assistantNodes[entry.node];
              const options = isLast && !typing ? optionsFor(entry.node) : [];
              return (
                <div key={index} className="animate-assistant-in flex flex-col items-start gap-[.3rem]">
                  <span className="text-[.5rem] uppercase tracking-[.16em] text-accent">{assistantMeta.botSpeaker}</span>
                  {node.messages.map((message, messageIndex) => (
                    <p
                      key={messageIndex}
                      className="m-0 max-w-[92%] whitespace-pre-line bg-[rgba(255,255,255,.07)] px-[.9rem] py-[.65rem] text-[.8rem] leading-[1.6]"
                    >
                      {message}
                    </p>
                  ))}
                  {options.length ? (
                    <div className="mt-[.45rem] flex flex-wrap gap-[.4rem]">
                      {options.map((option) =>
                        "next" in option ? (
                          <button key={option.label} type="button" onClick={() => choose(option)} className={optionClass}>
                            {option.label}
                          </button>
                        ) : option.href.startsWith("/") ? (
                          <Link key={option.label} href={option.href} onClick={() => choose(option)} className={optionClass}>
                            {option.label} <span className="text-accent">→</span>
                          </Link>
                        ) : (
                          <a
                            key={option.label}
                            href={option.href}
                            target={option.external ? "_blank" : undefined}
                            rel={option.external ? "noreferrer" : undefined}
                            onClick={() => choose(option)}
                            className={optionClass}
                          >
                            {option.label} <span className="text-accent">↗</span>
                          </a>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {typing ? (
              <div role="status" aria-label={assistantMeta.typingLabel} className="assistant-typing flex gap-[.3rem] px-[.9rem] py-[.5rem]">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[rgba(255,255,255,.14)] px-[1.1rem] py-[.75rem]">
            <button type="button" onClick={restart} className={footerActionClass}>
              {assistantMeta.restartLabel}
            </button>
            <button type="button" onClick={talkToHuman} className={[footerActionClass, "text-accent hover:text-ivory"].join(" ")}>
              {assistantMeta.humanLabel} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
