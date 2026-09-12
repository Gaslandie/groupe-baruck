import type { Metadata, Viewport } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { BrandCatalogue } from "@/components/marque-baruck/BrandCatalogue";
import { brandHero, brandStory } from "@/data/marque-baruck";
import { contacts, hqAddress, routes, site } from "@/data/site";
import { asset } from "@/lib/asset";
import { brandOrderHref } from "@/lib/brand-order";
import { loadProducts } from "@/lib/boutique";
import { pageAlternates, socialMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "La marque Baruck — L’élégance, notre affaire",
  description: "Découvrez la marque Baruck : vêtements, sacs, chaussures, parfums et accessoires. Parcourez la collection et préparez votre commande par WhatsApp.",
  alternates: pageAlternates(site.url + routes.brand.slice(1)),
  openGraph: socialMetadata(brandHero),
};

export const viewport: Viewport = { themeColor: "#0b0c0e" };

export default function BrandPage() {
  const products = loadProducts();
  // Le parfum mis en avant suit le catalogue : la section suit son retrait.
  const perfume = products.find((product) => product.category === "parfums");
  return (
    <PageShell variant="service" current="brand" footer="service">
      <section className="grid min-h-[90svh] grid-cols-2 bg-ink pb-0 pt-[110px] text-ivory max-tablet:grid-cols-1">
        <div className="flex flex-col justify-center px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3rem,6vw,6rem)]">
          <p className="eyebrow light">La marque Baruck</p>
          <h1 className="font-display text-display-xl font-normal leading-[.96] tracking-[-.05em]">L’élégance,<br /><em className="font-normal text-gold">notre affaire.</em></h1>
          <p className="mb-9 mt-7 max-w-[490px] text-lead leading-[1.75] text-[rgba(255,255,255,.72)]">Vêtements, accessoires, chaussures et parfums. Entrez dans l’univers Baruck et trouvez les pièces qui expriment votre style.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#collection" className="button button-primary">Découvrir la collection <span aria-hidden="true">↓</span></a>
            <a href={brandOrderHref()} target="_blank" rel="noreferrer" className="button button-ghost">Nous écrire <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <figure className="m-0 min-w-0 self-stretch">
          <img src={asset(brandHero.src)} alt={brandHero.alt} width={brandHero.width} height={brandHero.height} fetchPriority="high" className="h-full max-h-[900px] min-h-[420px] w-full object-cover max-tablet:aspect-square max-tablet:min-h-0" />
        </figure>
      </section>

      <section className="reveal grid grid-cols-[.8fr_1.2fr] gap-[clamp(2rem,6vw,6rem)] bg-ivory px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)] max-tablet:grid-cols-1">
        <div>
          <p className="eyebrow">L’univers Baruck</p>
          <h2 className="font-display text-display-lg font-normal leading-[1.05] tracking-[-.04em]">Le sens<br /><em className="font-normal text-[#796037]">du détail.</em></h2>
        </div>
        <div className="max-w-[720px] space-y-6 text-lead leading-[1.85] text-[#64645f]">
          <p>{brandStory.introduction}</p>
          <p>{brandStory.clothing}</p>
        </div>
      </section>

      <BrandCatalogue products={products} />

      {perfume && (
        <section className="grid grid-cols-2 bg-ink text-ivory max-tablet:grid-cols-1">
          <figure className="m-0 bg-[#f1ece6]">
            <img src={asset(perfume.images[0].src)} alt={perfume.images[0].alt} width={perfume.images[0].width} height={perfume.images[0].height} loading="lazy" className="aspect-square h-full w-full object-contain" />
          </figure>
          <div className="reveal flex flex-col justify-center px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,7vw,7rem)]">
            <p className="eyebrow light">Parfums Baruck</p>
            <h2 className="font-display text-display-lg font-normal leading-[1.05] tracking-[-.04em]">Une empreinte<br /><em className="font-normal text-gold">inoubliable.</em></h2>
            <p className="mb-8 mt-6 max-w-[520px] text-lead leading-[1.8] text-[rgba(255,255,255,.72)]">{brandStory.perfume}</p>
            <a href={`#produit-${perfume.id}`} className="text-link w-fit">Découvrir le parfum <span aria-hidden="true">↑</span></a>
          </div>
        </section>
      )}

      <section id="commander" className="scroll-mt-[100px] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]">
        <p className="eyebrow">Votre commande</p>
        <h2 className="font-display text-display-lg font-normal leading-[1.05] tracking-[-.04em]">Un échange, votre sélection.</h2>
        <ol className="my-10 grid list-none grid-cols-3 gap-8 p-0 max-tablet:grid-cols-1">
          {[
            ["Choisissez votre article", "Parcourez la collection. Vous pouvez préciser votre taille, le coloris et la quantité souhaités sur la fiche de l’article."],
            ["Écrivez sur WhatsApp", "Le bouton ouvre un message avec le nom et le visuel de l’article. Complétez votre demande, puis envoyez-la à l’équipe."],
            ["Confirmez avec l’équipe", "Demandez le prix, les disponibilités, les modalités de paiement et de remise avant de confirmer votre commande."],
          ].map(([title, text], index) => (
            <li key={title} className="border-t border-line pt-6">
              <span aria-hidden="true" className="font-display text-title text-[#796037]">0{index + 1}</span>
              <h3 className="mb-3 mt-4 font-display text-title font-normal">{title}</h3>
              <p className="text-body leading-[1.75] text-[#64645f]">{text}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-8 border-t border-line pt-9">
          <div>
            <p className="font-display text-title">Retrouvez-nous à Kobayah</p>
            <p className="mt-3 max-w-[540px] text-body leading-[1.75] text-[#64645f]">{hqAddress}</p>
            <p className="mt-2 text-small">WhatsApp : {contacts.whatsappHq.value}</p>
          </div>
          <a href={brandOrderHref()} target="_blank" rel="noreferrer" className="button button-dark">Commander sur WhatsApp <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section aria-label="L’esprit Baruck" className="bg-ink px-[clamp(1.3rem,10vw,12rem)] py-[clamp(4rem,7vw,7rem)] text-center text-ivory">
        <p className="mx-auto max-w-[1000px] text-balance font-display text-display-md leading-[1.45]">{brandStory.attitude}</p>
        <p className="mt-6 text-label uppercase tracking-[.23em] text-gold">Baruck · {brandStory.signature}</p>
      </section>
    </PageShell>
  );
}
