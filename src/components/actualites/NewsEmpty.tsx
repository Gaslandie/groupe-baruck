import Link from "next/link";

import { routes } from "@/data/site";

export function NewsEmpty() {
  return (
    <div className="mx-auto max-w-[520px] text-center">
      <p className="eyebrow justify-center before:hidden">Bientôt</p>
      <h2 className="font-display text-display-lg font-normal leading-[1] tracking-[-.04em]">
        Aucune actualité publiée pour le moment.
      </h2>
      <p className="mt-6 text-body leading-[1.7] text-[#696963]">
        Revenez prochainement : les nouvelles du Groupe Baruck seront publiées ici.
      </p>
      <Link href={routes.home} className="text-link mt-6">
        Retour à l’accueil <span>↗</span>
      </Link>
    </div>
  );
}
