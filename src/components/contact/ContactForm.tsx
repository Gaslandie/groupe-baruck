"use client";

import { useState, type FormEvent } from "react";

import { contactSubjects } from "@/data/contact";
import { contacts } from "@/data/site";

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const formClassName =
  "reveal grid content-center grid-cols-2 gap-x-6 gap-y-8 bg-ivory px-[clamp(2rem,7vw,8rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:px-[1.3rem] max-tablet:py-16";

const fieldClassName =
  "w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none focus:border-accent";

const labelClassName = "text-[.53rem] uppercase tracking-[.13em] text-[#6f6d67]";

type ContactFormProps = {
  id?: string;
  className?: string;
  showTitle?: boolean;
};

type FormStatus = "idle" | "fallback" | "error";

export function ContactForm({ id = "contact-form", className, showTitle = false }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerClassName = className ? `${formClassName} ${className}` : formClassName;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const objet = String(formData.get("objet") ?? "");
    const message = String(formData.get("message") ?? "");
    const botcheck = Boolean(formData.get("botcheck"));

    setStatus("idle");

    if (!accessKey) {
      const subject = encodeURIComponent(`Site Groupe Baruck — ${objet}`);
      const body = encodeURIComponent(
        [`Nom : ${name}`, `E-mail : ${email}`, `Téléphone ou WhatsApp : ${phone || "Non renseigné"}`, "", message].join(
          "\n",
        ),
      );

      setStatus("fallback");
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `${contacts.email.href}?subject=${subject}&body=${body}`;
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Site Groupe Baruck — ${objet}`,
          from_name: "Site Groupe Baruck",
          name,
          email,
          phone,
          objet,
          message,
          botcheck,
        }),
      });
      const result = (await response.json()) as { success?: boolean };

      if (response.ok && result.success) {
        setIsSuccess(true);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div role="status" id={id} className={containerClassName}>
        <p className="eyebrow col-span-full">Message envoyé</p>
        <h2 className="col-span-full m-0 max-w-[650px] font-display text-[clamp(2.6rem,4.5vw,5rem)] font-normal leading-[.95] tracking-[-.04em]">
          Merci, votre message a bien été transmis.
        </h2>
        <p className="col-span-full m-0 max-w-[540px] text-[.88rem] leading-[1.7] text-[#686762]">
          Nous vous répondons par le canal que vous avez indiqué.
        </p>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="button button-accent col-span-full w-fit max-tablet:col-auto max-tablet:w-full"
        >
          WhatsApp Baruck Siège Guinée <span>↗</span>
        </a>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={containerClassName}>
      {showTitle ? <p className="eyebrow col-span-full">Formulaire</p> : null}
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-name`} className={labelClassName}>
          Nom complet
        </label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name" required className={fieldClassName} />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-email`} className={labelClassName}>
          E-mail
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          className={fieldClassName}
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-phone`} className={labelClassName}>
          Téléphone ou WhatsApp
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+224 …"
          className={`${fieldClassName} placeholder:text-[#aaa69e]`}
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-objet`} className={labelClassName}>
          Objet
        </label>
        <div className="relative">
          <select
            id={`${id}-objet`}
            name="objet"
            required
            defaultValue=""
            className={`${fieldClassName} appearance-none pr-9`}
          >
            <option value="" disabled>
              Choisir un objet
            </option>
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-accent">
            ⌄
          </span>
        </div>
      </div>
      <div className="col-span-full flex flex-col gap-[.7rem] max-tablet:col-auto">
        <label htmlFor={`${id}-message`} className={labelClassName}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          minLength={20}
          className={fieldClassName}
        />
      </div>
      <input name="botcheck" type="checkbox" tabIndex={-1} aria-hidden="true" className="hidden" />
      <button
        type="submit"
        disabled={isSubmitting}
        className="form-button col-span-full flex min-h-[58px] w-full cursor-pointer items-center justify-between border-0 bg-ink px-6 text-[.64rem] uppercase tracking-[.13em] text-ivory transition-colors duration-[250ms] disabled:cursor-wait disabled:opacity-70 max-tablet:col-auto"
      >
        {isSubmitting ? "Envoi…" : "Envoyer le message"} <span>↗</span>
      </button>
      <p
        aria-live="polite"
        className="col-span-full mb-0 mt-[-.8rem] min-h-4 text-[.7rem] leading-[1.6] text-[#6c6a64] max-tablet:col-auto"
      >
        {status === "fallback" ? "Votre messagerie s’ouvre avec le message prérempli." : null}
        {status === "error" ? (
          <>
            L’envoi a échoué. Écrivez-nous directement par{" "}
            <a href={contacts.whatsappHq.href} target="_blank" rel="noreferrer" className="underline hover:text-accent">
              WhatsApp
            </a>{" "}
            ou par{" "}
            <a href={contacts.email.href} className="underline hover:text-accent">
              e-mail
            </a>.
          </>
        ) : null}
      </p>
    </form>
  );
}
