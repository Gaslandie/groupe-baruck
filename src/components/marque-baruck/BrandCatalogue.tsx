"use client";

import { useEffect, useState } from "react";

import { brandCategories, brandProducts, type BrandCategory, type BrandProduct } from "@/data/marque-baruck";
import { asset } from "@/lib/asset";
import { brandOrderHref } from "@/lib/brand-order";

function ProductCard({ product }: { product: BrandProduct }) {
  const [preferences, setPreferences] = useState("");
  const photo = product.images[0];
  const detailsId = `demande-${product.id}`;

  return (
    <article id={`produit-${product.id}`} className="flex min-w-0 scroll-mt-[110px] flex-col border border-line bg-ivory target:ring-2 target:ring-gold">
      <a href={asset(photo.src)} target="_blank" rel="noreferrer" aria-label={`Agrandir : ${product.name}`} className="block overflow-hidden bg-white">
        <img src={asset(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="aspect-square h-auto w-full object-contain" />
      </a>
      <div className="flex grow flex-col p-[clamp(1.1rem,2vw,1.8rem)]">
        <p className="text-micro uppercase tracking-[.16em] text-[#716344]">{brandCategories[product.category]}</p>
        <h3 className="mb-3 mt-3 font-display text-title font-normal leading-[1.2]">{product.name}</h3>
        <p className="mb-5 text-small leading-[1.6] text-[#64645f]">Prix et disponibilité sur demande.</p>
        <details className="mb-5 text-small">
          <summary className="cursor-pointer py-2 underline decoration-gold underline-offset-4">Préciser ma demande</summary>
          {product.images.length > 1 && (
            <div className="my-4 grid grid-cols-2 gap-3">
              {product.images.slice(1).map((other) => (
                <a key={other.src} href={asset(other.src)} target="_blank" rel="noreferrer" aria-label={`Agrandir : ${other.alt}`}>
                  <img src={asset(other.src)} alt={other.alt} width={other.width} height={other.height} loading="lazy" className="aspect-square h-auto w-full bg-white object-contain" />
                </a>
              ))}
            </div>
          )}
          <label htmlFor={detailsId} className="mb-2 mt-4 block leading-[1.6]">Taille, coloris, quantité ou article du visuel souhaité (facultatif)</label>
          <textarea id={detailsId} aria-label={`Précisions pour ${product.name}`} rows={3} maxLength={400} value={preferences} onChange={(event) => setPreferences(event.target.value)} className="w-full resize-y border border-line bg-white p-3 text-body leading-[1.5]" />
          <p className="mt-2 text-caption leading-[1.6] text-[#64645f]">Ces précisions seront ajoutées à votre message WhatsApp.</p>
        </details>
        <a href={brandOrderHref(product, preferences)} target="_blank" rel="noreferrer" aria-label={`Commander sur WhatsApp : ${product.name}`} className="button button-dark mt-auto w-full gap-3 text-center">
          Commander sur WhatsApp <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export function BrandCatalogue() {
  const [filter, setFilter] = useState<BrandCategory | "all">("all");

  // Un lien d’article reçu par WhatsApp doit rester accessible après un filtrage.
  useEffect(() => {
    const revealLinkedProduct = () => {
      if (window.location.hash.startsWith("#produit-")) setFilter("all");
    };
    const followProductLink = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="#produit-"]')) {
        setFilter("all");
      }
    };
    window.addEventListener("hashchange", revealLinkedProduct);
    document.addEventListener("click", followProductLink);
    return () => {
      window.removeEventListener("hashchange", revealLinkedProduct);
      document.removeEventListener("click", followProductLink);
    };
  }, []);

  useEffect(() => {
    if (filter === "all" && window.location.hash.startsWith("#produit-")) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, [filter]);

  const visibleCount = brandProducts.filter((product) => filter === "all" || product.category === filter).length;

  return (
    <section id="collection" aria-labelledby="collection-title" className="scroll-mt-[92px] bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">La collection Baruck</p>
          <h2 id="collection-title" className="font-display text-display-lg font-normal leading-[1] tracking-[-.04em]">À chacun son allure.</h2>
        </div>
        <p className="max-w-[440px] text-body leading-[1.75] text-[#64645f]">Choisissez un article et préparez votre demande. L’équipe vous renseigne sur les prix, les tailles et les disponibilités par WhatsApp.</p>
      </div>
      <div role="group" aria-label="Filtrer la collection" className="mb-6 flex flex-wrap gap-2">
        {([ ["all", "Tout voir"], ...Object.entries(brandCategories)] as [BrandCategory | "all", string][]).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} aria-controls="catalogue-articles" onClick={() => setFilter(value)} className={`min-h-11 cursor-pointer border px-4 py-3 text-label tracking-[.04em] transition-colors duration-[220ms] ${filter === value ? "border-ink bg-ink text-ivory" : "border-line bg-ivory text-ink hover:border-ink"}`}>{label}</button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="mb-6 text-small text-[#64645f]">{visibleCount} {visibleCount > 1 ? "articles et sélections" : "article"}</p>
      <div id="catalogue-articles" className="grid grid-cols-3 items-stretch gap-6 max-desktop:grid-cols-2 max-[580px]:grid-cols-1">
        {brandProducts.map((product) => (
          <div key={product.id} hidden={filter !== "all" && product.category !== filter} className="h-full [&>article]:h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
