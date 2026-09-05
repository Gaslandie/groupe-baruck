const revealSelector = ".reveal, .reveal-media";

/**
 * Ajoute `is-visible` aux éléments `.reveal` / `.reveal-media` d’une racine
 * lorsqu’ils entrent dans le viewport (immédiatement si le mouvement est réduit).
 * Renvoie la fonction de nettoyage. À appeler uniquement depuis un useEffect.
 */
export function revealWithin(root: ParentNode): () => void {
  const elements = root.querySelectorAll<HTMLElement>(revealSelector);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  elements.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
