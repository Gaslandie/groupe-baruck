const menuButton = document.querySelector("#menu-button");
const closeMenuButton = document.querySelector("#close-menu");
const sideNav = document.querySelector("#side-nav");
const navOverlay = document.querySelector("#nav-overlay");
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
  setTimeout(() => closeMenuButton.focus(), 100);
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

if (menuButton && closeMenuButton && sideNav && navOverlay) {
  menuButton.addEventListener("click", () => sideNav.classList.contains("is-open") ? closeMenu() : openMenu());
  closeMenuButton.addEventListener("click", closeMenu);
  navOverlay.addEventListener("click", closeMenu);
  sideNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sideNav.classList.contains("is-open")) closeMenu();
    if (event.key === "Tab" && sideNav.classList.contains("is-open")) {
      const focusable = [...sideNav.querySelectorAll("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

const header = document.querySelector("#site-header");
if (header) window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });
