import { PageShell } from "@/components/layout/PageShell";

export default function Home() {
  return (
    <PageShell variant="home" current="home" footer="home">
      <section id="accueil" className="grid min-h-svh place-items-center bg-ink px-6 text-ivory">
        <div className="text-center">
          <h1 className="font-display text-5xl">Groupe Baruck</h1>
          <p>Accueil en cours de migration (étape 4).</p>
        </div>
      </section>
    </PageShell>
  );
}
