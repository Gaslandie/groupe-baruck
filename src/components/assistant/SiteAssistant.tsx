"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";

import {
  assistantMeta,
  assistantNodes,
  contactHref,
  greetingFor,
  isAssistantNodeId,
  startOptionsFor,
  type AssistantBlock,
  type AssistantContext,
  type AssistantNodeId,
  type AssistantOption,
} from "@/data/assistant";
import { searchAssistant } from "@/lib/assistant-search";

export type AssistantVariant = "home" | "about" | "service" | "jeca" | "edv";

type SiteAssistantProps = {
  variant: AssistantVariant;
};

type NextOption = Extract<AssistantOption, { next: AssistantNodeId }>;

type Entry =
  | { kind: "bot"; node: AssistantNodeId; note?: string; options?: NextOption[] }
  | { kind: "user"; label: string };

type StoredState = { open: boolean; entries: Entry[] };

const startEntry: Entry = { kind: "bot", node: "start" };

const STORAGE_KEY = "baruck-assistant";
const TYPING_DELAY = 450;
const MAX_ENTRIES = 60;
const MAX_QUESTION_LENGTH = 200;

/* Palette du panneau selon la page : tokens de globals.css, appliqués en variables CSS. */
const themes: Record<AssistantVariant, CSSProperties> = {
  home: { "--asst-bg": "#0b0c0e", "--asst-accent": "#dc5b2b", "--asst-user": "#dc5b2b" } as CSSProperties,
  about: { "--asst-bg": "#0b0c0e", "--asst-accent": "#dc5b2b", "--asst-user": "#dc5b2b" } as CSSProperties,
  service: { "--asst-bg": "#0b0c0e", "--asst-accent": "#dc5b2b", "--asst-user": "#dc5b2b" } as CSSProperties,
  jeca: { "--asst-bg": "#061b53", "--asst-accent": "#f2bd00", "--asst-user": "#0b3da4" } as CSSProperties,
  edv: { "--asst-bg": "#1a100b", "--asst-accent": "#f0a51d", "--asst-user": "#c7461c" } as CSSProperties,
};

/* Le fil est conservé pendant la session de navigation (onglet) pour survivre aux liens
   internes proposés par l'assistant. Il ne quitte jamais le navigateur : identifiants de
   nœuds, libellés d'options et questions saisies. Stockage bloqué → l'assistant repart de zéro. */
function isNextOption(value: unknown): value is NextOption {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as NextOption).label === "string" &&
    isAssistantNodeId((value as NextOption).next)
  );
}

function readStoredState(): StoredState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { open, entries } = parsed as Partial<StoredState>;
    if (!Array.isArray(entries)) return null;
    const valid: Entry[] = [];
    for (const entry of entries as unknown[]) {
      if (!entry || typeof entry !== "object") continue;
      const candidate = entry as Partial<Entry> & { note?: unknown; options?: unknown };
      if (candidate.kind === "user" && typeof candidate.label === "string") {
        valid.push({ kind: "user", label: candidate.label });
      } else if (candidate.kind === "bot" && isAssistantNodeId(candidate.node)) {
        valid.push({
          kind: "bot",
          node: candidate.node,
          note: typeof candidate.note === "string" ? candidate.note : undefined,
          options: Array.isArray(candidate.options) ? candidate.options.filter(isNextOption) : undefined,
        });
      }
    }
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

/* Contexte (sujet, dernière question) transmis aux sorties humaines. */
function contextFrom(entries: Entry[]): AssistantContext {
  let topic: AssistantContext["topic"];
  let question: string | undefined;
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    if (entry.kind !== "bot") continue;
    const node = assistantNodes[entry.node];
    if (!node.topic) continue;
    topic = node.topic;
    question = node.question;
    break;
  }
  return { topic, question };
}

const subscribeNoop = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center rounded-full bg-[var(--asst-accent)] font-display leading-none text-ivory",
        className,
      ].join(" ")}
    >
      {assistantMeta.monogram}
    </span>
  );
}

const bubbleClass = "bg-[rgba(255,255,255,.07)] px-[.9rem] py-[.65rem] text-[.8rem] leading-[1.6]";
const blockClass = "w-full " + bubbleClass;

function MessageBlock({ block, greeting }: { block: AssistantBlock; greeting: string }) {
  switch (block.kind) {
    case "greeting":
      return <p className={["m-0 max-w-[92%] whitespace-pre-line", bubbleClass].join(" ")}>{`${greeting}, ${block.text}`}</p>;
    case "text":
      return <p className={["m-0 max-w-[92%] whitespace-pre-line", bubbleClass].join(" ")}>{block.text}</p>;
    case "table":
      return (
        <div className={blockClass}>
          {block.title ? (
            <p className="m-0 mb-[.45rem] text-[.5rem] uppercase tracking-[.16em] text-[var(--asst-accent)]">{block.title}</p>
          ) : null}
          <dl className="m-0">
            {block.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t border-[rgba(255,255,255,.12)] py-[.45rem]"
              >
                <dt className="text-[.74rem] leading-[1.4]">
                  {row.label}
                  {row.note ? <small className="block text-[.6rem] text-[rgba(255,255,255,.55)]">{row.note}</small> : null}
                </dt>
                <dd className="m-0 whitespace-nowrap font-display text-[.92rem] leading-[1.3]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "cards":
      return (
        <ul className={["m-0 list-none p-0", blockClass].join(" ")}>
          {block.items.map((item) => (
            <li key={item.title} className="border-t border-[rgba(255,255,255,.12)] py-[.55rem] first:border-t-0 first:pt-0 last:pb-0">
              {item.meta ? (
                <span className="mb-[.15rem] block text-[.5rem] uppercase tracking-[.16em] text-[var(--asst-accent)]">{item.meta}</span>
              ) : null}
              <strong className="block font-display text-[.98rem] font-normal leading-[1.25]">{item.title}</strong>
              {item.text ? <span className="mt-[.2rem] block text-[.74rem] leading-[1.5] text-[rgba(255,255,255,.72)]">{item.text}</span> : null}
            </li>
          ))}
        </ul>
      );
    case "chips":
      return (
        <ul className={["m-0 flex list-none flex-wrap gap-[.35rem] p-0", blockClass].join(" ")}>
          {block.items.map((item) => (
            <li
              key={item}
              className="border border-[rgba(255,255,255,.22)] px-[.6rem] py-[.3rem] text-[.6rem] uppercase tracking-[.12em]"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "facts":
      return (
        <dl className={["m-0 grid gap-[.55rem]", blockClass].join(" ")}>
          {block.items.map((item) => (
            <div key={item.label}>
              <dt className="text-[.5rem] uppercase tracking-[.16em] text-[var(--asst-accent)]">{item.label}</dt>
              <dd className="m-0 mt-[.15rem] text-[.82rem] leading-[1.5]">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="underline decoration-[rgba(255,255,255,.35)] underline-offset-4 transition-colors duration-[200ms] hover:decoration-[var(--asst-accent)]"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      );
  }
}

const optionClass =
  "cursor-pointer border border-[rgba(255,255,255,.28)] bg-transparent px-[.8rem] py-[.5rem] text-left text-[.7rem] leading-[1.35] text-ivory transition-[background,border-color,transform] duration-[200ms] hover:border-ivory hover:bg-[rgba(255,255,255,.08)] hover:translate-y-[-1px] focus-visible:border-ivory focus-visible:bg-[rgba(255,255,255,.08)]";

const footerActionClass =
  "cursor-pointer border-0 bg-transparent p-0 text-[.56rem] uppercase tracking-[.16em] text-[rgba(255,255,255,.68)] transition-colors duration-[200ms] hover:text-ivory focus-visible:text-ivory";

export function SiteAssistant({ variant }: SiteAssistantProps) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typing, setTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | null>(null);
  const restoredRef = useRef(false);
  const focusOnCloseRef = useRef(false);
  const theme = themes[variant];

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

  const pushBot = useCallback((entry: Extract<Entry, { kind: "bot" }>, base: Entry[]) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const commit = () => {
      typingTimer.current = null;
      setTyping(false);
      setEntries([...base, entry].slice(-MAX_ENTRIES));
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
      pushBot({ kind: "bot", node: option.next }, withUser);
      return;
    }
    /* Lien ou canal : le fil est écrit tout de suite pour survivre à la navigation. */
    const encoreEntry: Entry = { kind: "bot", node: "encore" };
    const next: Entry[] = [...withUser, encoreEntry].slice(-MAX_ENTRIES);
    writeStoredState({ open: true, entries: next });
    setEntries(next);
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = question.trim().slice(0, MAX_QUESTION_LENGTH);
    if (!text || typing) return;
    setQuestion("");
    const withUser: Entry[] = [...entries, { kind: "user", label: text }];
    setEntries(withUser);
    const found = searchAssistant(text);
    if (found.length === 0) {
      pushBot({ kind: "bot", node: "inconnu" }, withUser);
    } else if (found.length === 1) {
      pushBot({ kind: "bot", node: found[0], note: assistantMeta.searchNote }, withUser);
    } else {
      const options: NextOption[] = found.map((id) => ({ label: assistantNodes[id].question ?? id, next: id }));
      pushBot({ kind: "bot", node: "plusieurs", options }, withUser);
    }
  };

  const restart = () => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = null;
    setTyping(false);
    setQuestion("");
    setEntries([startEntry]);
  };

  const talkToHuman = () => {
    if (typing) return;
    const withUser: Entry[] = [...entries, { kind: "user", label: assistantMeta.humanLabel }];
    setEntries(withUser);
    pushBot({ kind: "bot", node: "humain" }, withUser);
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

  const optionsFor = (entry: Extract<Entry, { kind: "bot" }>): AssistantOption[] => {
    if (entry.node === "start" || entry.node === "encore") return startOptionsFor(pathname);
    if (entry.node === "plusieurs") return [...(entry.options ?? []), ...assistantNodes.plusieurs.options];
    return assistantNodes[entry.node].options;
  };

  const lastIndex = entries.length - 1;
  const context = contextFrom(entries);
  const greeting = greetingFor(new Date().getHours());

  const renderOption = (option: AssistantOption) => {
    if ("next" in option) {
      return (
        <button key={option.label} type="button" onClick={() => choose(option)} className={optionClass}>
          {option.label}
        </button>
      );
    }
    const target = "channel" in option ? contactHref(option.channel, context) : { href: option.href, external: option.external === true };
    if (target.href.startsWith("/")) {
      return (
        <Link key={option.label} href={target.href} onClick={() => choose(option)} className={optionClass}>
          {option.label} <span className="text-[var(--asst-accent)]">→</span>
        </Link>
      );
    }
    return (
      <a
        key={option.label}
        href={target.href}
        target={target.external ? "_blank" : undefined}
        rel={target.external ? "noreferrer" : undefined}
        onClick={() => choose(option)}
        className={optionClass}
      >
        {option.label} <span className="text-[var(--asst-accent)]">↗</span>
      </a>
    );
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        style={theme}
        disabled={!hydrated}
        aria-label={open ? assistantMeta.closeLabel : assistantMeta.openLabel}
        aria-expanded={open}
        aria-controls="site-assistant"
        onClick={toggle}
        className={[
          "fixed bottom-[calc(clamp(1rem,3vw,1.75rem)+env(safe-area-inset-bottom,0px))] right-[clamp(1rem,3vw,1.75rem)] z-[70] flex h-[56px] cursor-pointer items-center gap-[.7rem] rounded-full border border-[rgba(255,255,255,.18)] bg-[var(--asst-bg)] pl-[.6rem] pr-[1.25rem] text-[.6rem] uppercase tracking-[.16em] text-ivory shadow-[0_18px_40px_rgba(0,0,0,.28)] transition-[transform,opacity] duration-[250ms] hover:translate-y-[-2px] disabled:cursor-wait disabled:opacity-70 max-tablet:h-[52px] max-tablet:w-[52px] max-tablet:justify-center max-tablet:p-0",
          open ? "max-tablet:hidden" : "",
        ].join(" ")}
      >
        <Monogram className="h-[38px] w-[38px] text-[1.15rem] max-tablet:h-[34px] max-tablet:w-[34px] max-tablet:text-[1.05rem]" />
        <span className="max-tablet:hidden">{open ? "Fermer" : assistantMeta.launcher}</span>
      </button>

      {open ? (
        <section
          id="site-assistant"
          role="dialog"
          aria-labelledby="site-assistant-title"
          style={theme}
          className="animate-assistant-in fixed bottom-[calc(clamp(1rem,3vw,1.75rem)+68px+env(safe-area-inset-bottom,0px))] right-[clamp(1rem,3vw,1.75rem)] z-[70] flex max-h-[min(680px,calc(100svh-120px))] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border border-[rgba(255,255,255,.14)] bg-[var(--asst-bg)] text-ivory shadow-[0_30px_70px_rgba(0,0,0,.35)] max-tablet:inset-x-0 max-tablet:bottom-0 max-tablet:max-h-[84svh] max-tablet:w-auto max-tablet:max-w-none max-tablet:border-x-0 max-tablet:border-b-0 max-tablet:pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,.14)] px-[1.1rem] py-[.85rem]">
            <div className="flex items-center gap-[.75rem]">
              <Monogram className="h-[36px] w-[36px] text-[1.1rem]" />
              <div>
                <h2
                  id="site-assistant-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="m-0 font-display text-[1.15rem] font-normal leading-[1.1] tracking-[-.02em] outline-none"
                >
                  {assistantMeta.name}
                </h2>
                <p className="mb-0 mt-[.25rem] text-[.52rem] uppercase tracking-[.14em] text-[rgba(255,255,255,.6)]">
                  {assistantMeta.tagline}
                </p>
              </div>
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
                    <p className="m-0 max-w-[85%] bg-[var(--asst-user)] px-[.9rem] py-[.6rem] text-[.8rem] leading-[1.5]">{entry.label}</p>
                  </div>
                );
              }

              const node = assistantNodes[entry.node];
              const options = isLast && !typing ? optionsFor(entry) : [];
              return (
                <div key={index} className="animate-assistant-in flex flex-col items-start gap-[.3rem]">
                  <span className="flex items-center gap-[.4rem] text-[.5rem] uppercase tracking-[.16em] text-[var(--asst-accent)]">
                    <Monogram className="h-[16px] w-[16px] text-[.6rem]" />
                    {assistantMeta.botSpeaker}
                  </span>
                  {entry.note ? (
                    <p className="m-0 text-[.66rem] italic leading-[1.4] text-[rgba(255,255,255,.55)]">{entry.note}</p>
                  ) : null}
                  {node.messages.map((message, messageIndex) => (
                    <MessageBlock
                      key={messageIndex}
                      block={typeof message === "string" ? { kind: "text", text: message } : message}
                      greeting={greeting}
                    />
                  ))}
                  {options.length ? (
                    <div className="assistant-options mt-[.45rem] flex flex-wrap gap-[.4rem]">{options.map(renderOption)}</div>
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

          <form
            onSubmit={submitQuestion}
            className="flex items-center gap-[.5rem] border-t border-[rgba(255,255,255,.14)] px-[1.1rem] py-[.6rem]"
          >
            <label htmlFor="site-assistant-question" className="sr-only">
              {assistantMeta.inputLabel}
            </label>
            <input
              id="site-assistant-question"
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={assistantMeta.inputPlaceholder}
              autoComplete="off"
              enterKeyHint="send"
              maxLength={MAX_QUESTION_LENGTH}
              className="min-w-0 flex-1 border-0 border-b border-[rgba(255,255,255,.22)] bg-transparent py-[.45rem] text-[.82rem] text-ivory outline-none placeholder:text-[rgba(255,255,255,.4)] focus:border-[var(--asst-accent)]"
            />
            <button
              type="submit"
              disabled={!question.trim() || typing}
              aria-label={assistantMeta.sendLabel}
              className="flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,.28)] bg-transparent text-[1rem] text-ivory transition-[background,border-color,opacity] duration-[200ms] hover:border-ivory hover:bg-[rgba(255,255,255,.08)] disabled:cursor-default disabled:opacity-40"
            >
              <span aria-hidden="true">↑</span>
            </button>
          </form>

          <div className="flex items-center justify-between gap-4 border-t border-[rgba(255,255,255,.14)] px-[1.1rem] py-[.7rem]">
            <button type="button" onClick={restart} className={footerActionClass}>
              {assistantMeta.restartLabel}
            </button>
            <button
              type="button"
              onClick={talkToHuman}
              className={[footerActionClass, "text-[var(--asst-accent)] hover:text-ivory"].join(" ")}
            >
              {assistantMeta.humanLabel} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
