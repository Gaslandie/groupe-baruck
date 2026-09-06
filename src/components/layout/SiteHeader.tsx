"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { mainNav, routes, sideNavContacts, type RouteKey } from "@/data/site";

import { Brand } from "./Brand";

export type HeaderVariant = "home" | "about" | "service" | "jeca" | "edv";

type SiteHeaderProps = {
  variant: HeaderVariant;
  current?: RouteKey;
};

type VariantStyle = {
  header: string;
  scrolled: string;
  underline: string;
  currentDesktop: string;
  contactArrow: string;
  sideNav: string;
  sideCurrent: string;
  sideCurrentNumber: string;
};

export const variantStyles: Record<HeaderVariant, VariantStyle> = {
  home: {
    header: "",
    scrolled: "bg-[rgba(11,12,14,.88)] backdrop-blur-[16px]",
    underline: "after:bg-accent",
    currentDesktop: "",
    contactArrow: "text-accent",
    sideNav: "bg-paper text-ink",
    sideCurrent: "",
    sideCurrentNumber: "text-accent",
  },
  about: {
    header: "bg-[linear-gradient(180deg,rgba(7,8,10,.72),transparent)]",
    scrolled: "bg-[rgba(11,12,14,.9)] backdrop-blur-[16px]",
    underline: "after:bg-accent",
    currentDesktop: "",
    contactArrow: "text-accent",
    sideNav: "bg-paper text-ink",
    sideCurrent: "",
    sideCurrentNumber: "text-accent",
  },
  service: {
    header: "bg-[linear-gradient(180deg,rgba(7,8,10,.72),transparent)]",
    scrolled: "bg-[rgba(11,12,14,.9)] backdrop-blur-[16px]",
    underline: "after:bg-accent",
    currentDesktop: "",
    contactArrow: "text-accent",
    sideNav: "bg-paper text-ink",
    sideCurrent: "",
    sideCurrentNumber: "text-accent",
  },
  jeca: {
    header: "bg-[rgba(4,16,49,.88)] backdrop-blur-[14px] max-tablet:h-[72px]",
    scrolled: "bg-[rgba(4,16,49,.96)]",
    underline: "after:bg-jeca-red",
    currentDesktop: "",
    contactArrow: "text-jeca-yellow",
    sideNav: "bg-jeca-paper text-jeca-ink",
    sideCurrent: "text-jeca-blue-bright hover:text-jeca-blue-bright focus-visible:text-jeca-blue-bright",
    sideCurrentNumber: "text-jeca-red",
  },
  edv: {
    header: "bg-[rgba(26,16,11,.76)] backdrop-blur-[14px] max-tablet:h-[72px] max-tablet:bg-[rgba(26,16,11,.9)]",
    scrolled: "bg-[rgba(26,16,11,.96)] max-tablet:bg-[rgba(26,16,11,.9)]",
    underline: "after:bg-accent",
    currentDesktop: "after:right-0! after:bg-edv-gold!",
    contactArrow: "text-accent",
    sideNav: "bg-paper text-ink",
    sideCurrent: "text-edv-ember hover:text-edv-ember focus-visible:text-edv-ember",
    sideCurrentNumber: "text-accent",
  },
};

const desktopLinkStyles =
  "relative whitespace-nowrap py-4 after:absolute after:bottom-[.65rem] after:left-0 after:right-full after:h-px after:content-[''] after:transition-[right] after:duration-[250ms] hover:after:right-0 focus-visible:after:right-0";

export function SiteHeader({ variant, current }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const styles = variantStyles[variant];
  const currentHref = current ? routes[current] : undefined;

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 40);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("details[data-nav-group][open]").forEach((group) => { group.open = false; });
    if (!isOpen) {
      document.body.classList.remove("menu-open");
      lastFocusedElement.current?.focus();
      return;
    }

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) lastFocusedElement.current = activeElement;
    document.body.classList.add("menu-open");

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 100);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const sideNav = closeButtonRef.current?.closest("aside");
      const focusable = Array.from(sideNav?.querySelectorAll<HTMLElement>("a, button, summary") ?? []).filter((element) => element.getClientRects().length > 0);
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  useEffect(() => {
    const closeGroups = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      document.querySelectorAll<HTMLDetailsElement>("details[data-nav-group][open]").forEach((group) => {
        if (!group.contains(event.target as Node) || event.target instanceof Element && event.target.closest("a[href]")) group.open = false;
      });
    };
    const escapeGroup = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const group = document.querySelector<HTMLDetailsElement>("details[data-nav-group][open]");
      if (!group) return;
      event.preventDefault(); event.stopPropagation();
      group.open = false;
      group.querySelector("summary")?.focus();
    };
    document.addEventListener("click", closeGroups);
    document.addEventListener("keydown", escapeGroup, true);
    return () => {
      document.removeEventListener("click", closeGroups);
      document.removeEventListener("keydown", escapeGroup, true);
    };
  }, []);

  const currentAttributes = (href: string) => {
    const isCurrent = href === currentHref;
    return {
      "aria-current": isCurrent ? ("page" as const) : undefined,
      "data-current": isCurrent ? "true" : undefined,
      isCurrent,
    };
  };

  return (
    <>
      <header
        id="site-header"
        className={[
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(1.2rem,3.4vw,4rem)] text-ivory transition-[background,height,box-shadow] duration-[350ms] max-tablet:h-[72px] max-tablet:px-[1.15rem]",
          isScrolled
            ? "scrolled h-[74px] shadow-[0_10px_40px_rgba(0,0,0,.1)] " + styles.scrolled
            : "h-[92px] " + styles.header,
        ].join(" ")}
      >
        <Brand />

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-[clamp(.8rem,1.25vw,1.4rem)] text-label uppercase tracking-[.085em] wide:flex"
        >
          {mainNav.map((item) => {
            const itemCurrent = currentAttributes(item.href);

            if (item.children) {
              const featuredChildren = item.children.filter((child) => child.featured);
              const otherChildren = item.children.filter((child) => !child.featured);
              const hasFeaturedChildren = featuredChildren.length > 0;
              const primaryChildren = hasFeaturedChildren ? featuredChildren : item.children;
              const hasOtherChildren = hasFeaturedChildren && otherChildren.length > 0;

              return (
                <details key={item.href} name="desktop-nav-groups" data-nav-group className="relative">
                  <summary
                    aria-current={itemCurrent["aria-current"]}
                    data-current={itemCurrent["data-current"]}
                    className={[
                      desktopLinkStyles,
                      "nav-disclosure-summary",
                      styles.underline,
                      itemCurrent.isCurrent ? styles.currentDesktop : "",
                      "flex items-center gap-[.4rem]",
                    ].join(" ")}
                  >
                    {item.shortLabel ?? item.label}
                    <span aria-hidden="true" className="nav-disclosure-arrow text-small text-accent">
                      ⌄
                    </span>
                  </summary>
                  <div
                    className={[
                      "nav-disclosure-content absolute left-1/2 top-[calc(100%-.2rem)] translate-x-[-50%] border border-[rgba(255,255,255,.14)] bg-[rgba(11,12,14,.96)] p-[.7rem] shadow-[0_20px_50px_rgba(0,0,0,.24)]",
                      hasOtherChildren ? "w-[320px]" : "w-[220px]",
                    ].join(" ")}
                  >
                    {primaryChildren.map((child) => {
                      const childCurrent = currentAttributes(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={childCurrent["aria-current"]}
                          data-current={childCurrent["data-current"]}
                          className={[
                            "block px-[.8rem] py-[.75rem] text-caption normal-case tracking-[.06em] hover:bg-[rgba(255,255,255,.06)] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.06)] focus-visible:text-ivory",
                            hasFeaturedChildren ? "font-medium text-ivory" : "text-[rgba(255,255,255,.72)]",
                          ].join(" ")}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                    {hasOtherChildren ? (
                      <>
                        <span className="mt-[.4rem] block border-t border-[rgba(255,255,255,.14)] px-[.8rem] pb-[.2rem] pt-[.7rem] text-micro uppercase tracking-[.16em] text-[rgba(255,255,255,.4)]">
                          Autres domaines
                        </span>
                        <div className="grid grid-cols-2">
                          {otherChildren.map((child) => {
                            const childCurrent = currentAttributes(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                aria-current={childCurrent["aria-current"]}
                                data-current={childCurrent["data-current"]}
                                className="block px-[.8rem] py-[.75rem] text-label normal-case tracking-[.06em] text-[rgba(255,255,255,.72)] hover:bg-[rgba(255,255,255,.06)] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.06)] focus-visible:text-ivory"
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                        <Link href={item.href} className="mt-2 block border-t border-ivory/15 px-[.8rem] py-[.75rem] text-caption normal-case tracking-[.06em] hover:text-accent focus-visible:text-accent">Tous nos services</Link>
                      </>
                    ) : null}
                  </div>
                </details>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={itemCurrent["aria-current"]}
                data-current={itemCurrent["data-current"]}
                className={[
                  desktopLinkStyles,
                  styles.underline,
                  itemCurrent.isCurrent ? styles.currentDesktop : "",
                ].join(" ")}
              >
                {item.shortLabel ?? item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-8">
          <Link
            href={routes.contact}
            className="border-b border-[rgba(255,255,255,.3)] pb-[.3rem] text-caption uppercase tracking-[.08em] wide:hidden max-tablet:hidden"
          >
            Parler avec nous <span className={["ml-[.4rem]", styles.contactArrow].join(" ")}>↗</span>
          </Link>
          <button
            id="menu-button"
            type="button"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-controls="side-nav"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="group flex cursor-pointer items-center gap-[.85rem] border-0 bg-transparent py-[.75rem] pl-[.75rem] text-label uppercase tracking-[.18em] text-inherit"
          >
            <span className="max-tablet:hidden">Menu</span>
            <span aria-hidden="true" className="flex h-[18px] w-[30px] flex-col justify-center gap-[7px]">
              <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-[-5px]" />
              <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-[5px]" />
            </span>
          </button>
        </div>
      </header>

      <div
        id="nav-overlay"
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        className={[
          "fixed inset-0 z-[80] bg-[rgba(0,0,0,.74)] transition-[opacity,visibility] duration-[450ms]",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        ].join(" ")}
      />

      <aside
        id="side-nav"
        aria-label="Navigation principale"
        aria-hidden={!isOpen}
        className={[
          "fixed inset-y-0 left-0 z-[90] flex w-[min(42vw,680px)] min-w-[520px] flex-col overflow-y-auto p-[clamp(1.5rem,4vw,4.5rem)] transition-[transform,visibility] duration-[550ms] ease-[cubic-bezier(.77,0,.18,1)] max-tablet:w-[94vw] max-tablet:min-w-0 max-tablet:p-6",
          styles.sideNav,
          isOpen ? "visible translate-x-0" : "invisible translate-x-[-102%]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-line pb-6">
          <span className="text-label uppercase tracking-[.18em]">Groupe Baruck</span>
          <button
            ref={closeButtonRef}
            id="close-menu"
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-inherit"
          >
            <span className="text-label uppercase tracking-[.18em]">Fermer</span>
            <span aria-hidden="true" className="font-sans text-[2rem] font-normal leading-none">
              ×
            </span>
          </button>
        </div>

        <nav aria-label="Menu principal" className="my-auto flex flex-col">
          {mainNav.map((item) => {
            const itemCurrent = currentAttributes(item.href);
            const featuredChildren = item.children?.filter((child) => child.featured) ?? [];
            const visibleChildren = featuredChildren.length ? featuredChildren : item.children;
            const hasOtherChildren = featuredChildren.length > 0 && item.children?.some((child) => !child.featured);
            const heading = (
              <>
                <span className={["inline-block w-[2.3rem] align-middle font-sans text-micro tracking-[.1em]", itemCurrent.isCurrent ? styles.sideCurrentNumber : "text-accent"].join(" ")}>{item.number}</span>
                {item.label}
                {item.children ? <span aria-hidden="true" className="nav-disclosure-arrow ml-3 inline-block align-middle font-sans text-lead text-accent">⌄</span> : null}
              </>
            );
            const headingClass = ["block py-[.34rem] font-display text-display-md leading-[1.06] transition-[color,transform] duration-[250ms] hover:translate-x-[.4rem] hover:text-accent focus-visible:translate-x-[.4rem] focus-visible:text-accent max-tablet:py-[.38rem]", itemCurrent.isCurrent ? styles.sideCurrent : ""].join(" ");
            if (!visibleChildren) return (
              <Link key={item.href} href={item.href} aria-current={itemCurrent["aria-current"]} data-current={itemCurrent["data-current"]} onClick={() => setIsOpen(false)} className={headingClass}>{heading}</Link>
            );
            return (
              <details key={item.href} name="side-nav-groups" data-nav-group>
                <summary className={`nav-disclosure-summary ${headingClass}`}>{heading}</summary>
                <div className="nav-disclosure-content ml-[2.3rem] mb-[.55rem] mt-[.15rem] grid gap-[.15rem] border-l border-line pl-4">
                  {visibleChildren.map((child) => {
                    const childCurrent = currentAttributes(child.href);
                    return (
                      <Link key={child.href} href={child.href} aria-current={childCurrent["aria-current"]} data-current={childCurrent["data-current"]} onClick={() => setIsOpen(false)} className={["py-[.18rem] font-sans text-caption font-medium leading-[1.35] tracking-[.05em] transition-[color,transform] duration-[250ms] hover:translate-x-[.4rem] hover:text-accent focus-visible:translate-x-[.4rem] focus-visible:text-accent", childCurrent.isCurrent ? styles.sideCurrent : "text-[#6f6f6b]"].join(" ")}>{child.label}</Link>
                    );
                  })}
                  {hasOtherChildren ? <Link href={item.href} onClick={() => setIsOpen(false)} className="py-[.18rem] font-sans text-caption font-medium leading-[1.35] tracking-[.05em] text-[#6f6f6b] transition-[color,transform] duration-[250ms] hover:translate-x-[.4rem] hover:text-accent focus-visible:translate-x-[.4rem] focus-visible:text-accent">Tous nos domaines</Link> : null}
                </div>
              </details>
            );
          })}
        </nav>

        <div className="grid grid-cols-[105px_1fr] gap-4 border-t border-line pt-[1.3rem] text-caption max-tablet:grid-cols-1">
          <p className="m-0 text-[#6f6f6b] max-tablet:mb-2">Restons en contact</p>
          <div className="grid grid-cols-2 gap-x-[1.2rem] gap-y-[.85rem] max-tablet:grid-cols-1 max-tablet:gap-[.7rem]">
            {sideNavContacts.map((contact) => (
              <a
                key={contact.href}
                href={contact.href}
                target={contact.external ? "_blank" : undefined}
                rel={contact.external ? "noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className="leading-[1.3]"
              >
                <small className="mb-[.2rem] block text-micro uppercase tracking-[.1em] text-accent">
                  {contact.label}
                </small>
                {contact.value}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
