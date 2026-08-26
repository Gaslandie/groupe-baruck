const activities = [
  {
    id: "hotellerie",
    title: "Hôtellerie",
    description: "Des espaces d’accueil pensés pour offrir confort, qualité et distinction.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1800&q=82",
    bg: "radial-gradient(circle at 72% 24%, #d6a363 0 5%, transparent 5.5%), linear-gradient(135deg, #16211e 0%, #6a4c34 54%, #17191a 100%)",
    art: "repeating-linear-gradient(90deg, transparent 0 13%, rgba(255,255,255,.07) 13.2% 13.6%), linear-gradient(25deg, transparent 47%, rgba(255,255,255,.12) 47.3% 48%, transparent 48.3%)"
  },
  {
    id: "restauration",
    title: "Restauration",
    description: "Une expérience culinaire portée par la qualité du service et le sens de l’accueil.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=82",
    bg: "radial-gradient(circle at 70% 44%, #dfbd83 0 13%, #7f5538 13.3% 14%, transparent 14.3%), linear-gradient(145deg, #3d1711, #8b4b2f 60%, #1e1210)",
    art: "radial-gradient(ellipse at 70% 44%, transparent 0 19%, rgba(255,255,255,.13) 19.3% 20%, transparent 20.3%)"
  },
  {
    id: "agrobusiness",
    title: "Agro-business",
    description: "Développer des solutions agricoles et commerciales créatrices de valeur.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=82",
    bg: "linear-gradient(140deg, #101b16, #496346 55%, #aa8353)",
    art: "repeating-radial-gradient(ellipse at 85% 110%, transparent 0 8%, rgba(229,208,155,.18) 8.3% 9%, transparent 9.3% 16%)"
  },
  {
    id: "studio",
    title: "Studio d’enregistrement",
    description: "Un environnement professionnel dédié à la création et à la production musicale.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=82",
    bg: "linear-gradient(145deg, #101116, #35233d 55%, #9e452c)",
    art: "repeating-linear-gradient(90deg, transparent 0 5%, rgba(255,255,255,.11) 5.3% 5.7%, transparent 6% 10%)"
  },
  {
    id: "cinema",
    title: "Cinéma",
    description: "Donner vie aux histoires à travers la création et la production audiovisuelle.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=82",
    bg: "radial-gradient(circle at 80% 20%, #ead0a1 0 2%, rgba(219,140,65,.45) 3%, transparent 23%), linear-gradient(150deg, #091015, #263746 50%, #5c3425)",
    art: "linear-gradient(113deg, transparent 46%, rgba(255,224,175,.12) 46.5% 58%, transparent 58.5%)"
  },
  {
    id: "mobilite",
    title: "Voitures de luxe",
    description: "Des véhicules haut de gamme pour les déplacements professionnels et les événements.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=82",
    bg: "linear-gradient(140deg, #111315, #35404a 58%, #7b6147)",
    art: "linear-gradient(165deg, transparent 54%, rgba(255,255,255,.13) 54.3% 55%, transparent 55.3%), radial-gradient(ellipse at 70% 65%, rgba(255,255,255,.14), transparent 38%)"
  },
  {
    id: "communication",
    title: "Communication digitale",
    description: "Accompagner les entreprises dans leur visibilité, leur image et leur croissance numérique.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=82",
    bg: "linear-gradient(145deg, #121018, #302954 55%, #b25134)",
    art: "repeating-linear-gradient(45deg, transparent 0 12%, rgba(255,255,255,.06) 12.2% 12.6%)"
  },
  {
    id: "artistes",
    title: "Production d’artistes",
    description: "Encadrer, développer et promouvoir les talents artistiques.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=82",
    bg: "radial-gradient(circle at 28% 28%, rgba(239,163,89,.8), transparent 16%), linear-gradient(145deg, #171217, #64243a 56%, #be6034)",
    art: "radial-gradient(circle at 64% 48%, transparent 0 12%, rgba(255,255,255,.1) 12.4% 13%, transparent 13.4% 24%, rgba(255,255,255,.07) 24.4% 25%, transparent 25.4%)"
  },
  {
    id: "clips",
    title: "Clips vidéo",
    description: "Concevoir des productions visuelles modernes pour les artistes, les marques et les institutions.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=82",
    bg: "linear-gradient(135deg, #0b1316, #194653 54%, #914b36)",
    art: "linear-gradient(35deg, transparent 0 34%, rgba(255,255,255,.13) 34.3% 35%, transparent 35.3%), linear-gradient(125deg, transparent 0 67%, rgba(255,255,255,.09) 67.3% 68%, transparent 68.3%)"
  }
];

const carousel = document.querySelector("#activity-carousel");
const stage = document.querySelector("#carousel-stage");
const title = document.querySelector("#slide-title");
const description = document.querySelector("#slide-description");
const count = document.querySelector("#slide-count");
const activityNumber = document.querySelector("#activity-number");
const progressBar = document.querySelector("#carousel-progress-bar");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeIndex = 0;
let carouselTimer;
let isPaused = false;
let touchStartX = 0;

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function restartProgress() {
  progressBar.classList.remove("running");
  void progressBar.offsetWidth;
  if (!isPaused && !reducedMotion) progressBar.classList.add("running");
}

function scheduleNext() {
  clearTimeout(carouselTimer);
  restartProgress();
  if (!isPaused && !reducedMotion) carouselTimer = setTimeout(() => showSlide(activeIndex + 1), 4000);
}

function showSlide(index, immediate = false) {
  activeIndex = (index + activities.length) % activities.length;
  const activity = activities[activeIndex];
  if (!immediate) carousel.classList.add("is-changing");

  setTimeout(() => {
    stage.style.setProperty("--slide-bg", activity.bg);
    stage.style.setProperty("--slide-image", `url("${activity.image}")`);
    stage.style.setProperty("--slide-art", activity.art);
    title.textContent = activity.title;
    description.textContent = activity.description;
    count.textContent = `${formatNumber(activeIndex + 1)} / ${formatNumber(activities.length)}`;
    activityNumber.textContent = formatNumber(activeIndex + 1);
    carousel.classList.remove("is-changing");
    scheduleNext();
  }, immediate ? 0 : 260);
}

function setCarouselPause(paused) {
  isPaused = paused;
  clearTimeout(carouselTimer);
  progressBar.classList.remove("running");
  if (!paused) scheduleNext();
}

document.querySelector("#prev-slide").addEventListener("click", () => showSlide(activeIndex - 1));
document.querySelector("#next-slide").addEventListener("click", () => showSlide(activeIndex + 1));
carousel.addEventListener("mouseenter", () => setCarouselPause(true));
carousel.addEventListener("mouseleave", () => setCarouselPause(false));
carousel.addEventListener("focusin", () => setCarouselPause(true));
carousel.addEventListener("focusout", (event) => {
  if (!carousel.contains(event.relatedTarget)) setCarouselPause(false);
});
carousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
  if (event.key === "ArrowRight") showSlide(activeIndex + 1);
});
carousel.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
carousel.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

const activityGrid = document.querySelector("#activities-grid");
activityGrid.innerHTML = activities.map((activity, index) => `
  <article class="activity-card reveal" style="--card-bg:${activity.bg}; --card-art:${activity.art}; --card-image:url('${activity.image}')">
    <div class="card-top"><span>${formatNumber(index + 1)} / ${formatNumber(activities.length)}</span><i aria-hidden="true">↗</i></div>
    <div>
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <span class="visual-note">Photo d’ambiance · Unsplash</span>
    </div>
  </article>
`).join("");

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

const header = document.querySelector("#site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#form-status").textContent = "Merci. Le formulaire de démonstration est prêt à être relié au service d’envoi définitif.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
showSlide(0, true);
