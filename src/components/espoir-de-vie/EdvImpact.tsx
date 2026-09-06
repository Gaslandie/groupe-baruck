import { edvImpact } from "@/data/espoir-de-vie";

export function EdvImpact() {
  return (
    <section
      aria-label="Quelques repères sur nos actions"
      className="grid grid-cols-[42%_58%] bg-edv-ember-deep text-white max-[1100px]:grid-cols-[46%_54%] max-tablet:block"
    >
      <div className="reveal relative overflow-hidden bg-edv-ink px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-20">
        <span
          aria-hidden="true"
          className="absolute bottom-[-160px] right-[-160px] aspect-square w-[330px] rounded-full border border-[rgba(240,165,29,.18)] shadow-[0_0_0_65px_rgba(240,165,29,.035)]"
        />
        <p className="edv-kicker edv-kicker-light">Nos actions en chiffres</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          Des gestes concrets,
          <br />
          <em className="font-[inherit] text-edv-gold">des vies accompagnées.</em>
        </h2>
      </div>
      <dl className="reveal-stagger m-0 grid grid-cols-2 max-[430px]:grid-cols-1">
        {edvImpact.map((item) => (
          <div
            key={item.value + item.label}
            className="reveal flex min-h-[230px] flex-col justify-center border-b border-r border-[rgba(255,255,255,.15)] p-[clamp(1.8rem,4vw,4.5rem)] last:col-span-2 last:min-h-[190px] last:border-b-0 max-tablet:min-h-[190px] max-tablet:px-[1.3rem] max-tablet:py-8 max-tablet:last:min-h-[160px] max-[430px]:min-h-[150px] max-[430px]:border-r-0 max-[430px]:last:col-auto max-[430px]:last:min-h-[150px]"
          >
            <dt className="font-display text-display-xl font-normal italic leading-[.9] tracking-[-.05em] text-edv-gold">
              {item.value}
            </dt>
            <dd className="mb-0 ml-0 mr-0 mt-4 max-w-[240px] text-label uppercase leading-[1.55] tracking-[.07em] text-[rgba(255,255,255,.72)]">
              {item.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
