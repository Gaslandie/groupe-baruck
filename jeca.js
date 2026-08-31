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

const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

const lightbox = document.querySelector("#photo-lightbox");
const lightboxImage = lightbox?.querySelector("figure img");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption-text");
const lightboxCount = lightbox?.querySelector(".lightbox-count");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrevious = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const galleryButtons = [...document.querySelectorAll(".gallery-photo")];
let currentPhotoIndex = 0;

if (lightbox && lightboxImage && lightboxCaption && lightboxCount && lightboxClose && lightboxPrevious && lightboxNext) {
  const showPhoto = (index) => {
    currentPhotoIndex = (index + galleryButtons.length) % galleryButtons.length;
    const button = galleryButtons[currentPhotoIndex];
    const sourceImage = button.querySelector("img");
    if (!sourceImage) return;
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt;
    lightboxCaption.textContent = button.dataset.caption || "";
    lightboxCount.textContent = `${currentPhotoIndex + 1} / ${galleryButtons.length}`;
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showPhoto(index);
      lightbox.showModal();
    });
  });

  const closeLightbox = () => lightbox.close();
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrevious.addEventListener("click", () => showPhoto(currentPhotoIndex - 1));
  lightboxNext.addEventListener("click", () => showPhoto(currentPhotoIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(currentPhotoIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentPhotoIndex + 1);
  });
}
