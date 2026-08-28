const menuButton = document.querySelector("#menu-button");
const closeMenuButton = document.querySelector("#close-menu");
const sideNav = document.querySelector("#side-nav");
const navOverlay = document.querySelector("#nav-overlay");
const header = document.querySelector("#site-header");
let lastFocusedElement;

function openMenu() {
  lastFocusedElement = document.activeElement;
  document.body.classList.add("menu-open");
  sideNav.classList.add("is-open");
  navOverlay.classList.add("is-open");
  sideNav.setAttribute("aria-hidden", "false");
  navOverlay.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Fermer le menu");
  window.setTimeout(() => closeMenuButton.focus(), 100);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  sideNav.classList.remove("is-open");
  navOverlay.classList.remove("is-open");
  sideNav.setAttribute("aria-hidden", "true");
  navOverlay.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
  if (lastFocusedElement) lastFocusedElement.focus();
}

menuButton.addEventListener("click", () => sideNav.classList.contains("is-open") ? closeMenu() : openMenu());
closeMenuButton.addEventListener("click", closeMenu);
navOverlay.addEventListener("click", closeMenu);
sideNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sideNav.classList.contains("is-open")) closeMenu();
  if (event.key !== "Tab" || !sideNav.classList.contains("is-open")) return;
  const focusable = [...sideNav.querySelectorAll("a, button")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
