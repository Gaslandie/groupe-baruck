"use client";

import { translate as t } from "../../lib/language.ts";

import { useRef, useState, type FormEvent } from "react";

import { contactSubjects } from "@/data/contact";
import { contacts } from "@/data/site";
import { Icon } from "../ui/Icon";

const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;

const formClassName =
  "reveal grid content-center grid-cols-2 gap-x-6 gap-y-8 bg-ivory px-[clamp(2rem,7vw,8rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:px-[1.3rem] max-tablet:py-16";

const fieldClassName =
  "w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none focus:border-accent";

const labelClassName = "text-micro uppercase tracking-[.13em] text-[#6f6d67]";

type ContactFormProps = {
  id?: string;
  className?: string;
  showTitle?: boolean;
};

type FormStatus = "idle" | "unavailable" | "error" | "limited" | "invalid";

export function ContactForm({ id = "contact-form", className, showTitle = false }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sending = useRef(false);
  const containerClassName = className ? `${formClassName} ${className}` : formClassName;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sending.current) return;

    if (!contactUrl) {
      setStatus("unavailable");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const objet = String(formData.get("objet") ?? "");
    const message = String(formData.get("message") ?? "");
    const botcheck = Boolean(formData.get("botcheck"));

    setStatus("idle");

    sending.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(contactUrl, {
        method: "POST",
        credentials: "omit",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
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
        setStatus(response.status === 429 ? "limited" : response.status === 422 ? "invalid" : response.status === 503 ? "unavailable" : "error");
      }
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div role="status" id={id} className={containerClassName}>
        <p className="eyebrow col-span-full">{t("Message envoyé")}</p>
        <h2 className="col-span-full m-0 max-w-[650px] font-display text-display-xl font-normal leading-[.95] tracking-[-.04em]">{t("Merci, votre message a bien été transmis.")}</h2>
        <p className="col-span-full m-0 max-w-[540px] text-small leading-[1.7] text-[#686762]">{t("Nous vous répondons par le canal que vous avez indiqué.")}</p>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="button button-accent col-span-full w-fit max-tablet:col-auto max-tablet:w-full"
        >{t("WhatsApp Baruck Siège Guinée ")}<span><Icon name="arrow-up-right" /></span>
        </a>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={containerClassName}>
      {showTitle ? <p className="eyebrow col-span-full">{t("Formulaire")}</p> : null}
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-name`} className={labelClassName}>{t("Nom complet")}</label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={120} required className={fieldClassName} />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-email`} className={labelClassName}>{t("E-mail")}</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={190}
          required
          className={fieldClassName}
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-phone`} className={labelClassName}>{t("Téléphone ou WhatsApp")}</label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          placeholder="+224 …"
          className={`${fieldClassName} placeholder:text-[#aaa69e]`}
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-objet`} className={labelClassName}>{t("Objet")}</label>
        <div className="relative">
          <select
            id={`${id}-objet`}
            name="objet"
            required
            defaultValue=""
            className={`${fieldClassName} appearance-none pr-9`}
          >
            <option value="" disabled>{t("Choisir un objet")}</option>
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
          maxLength={5000}
          className={fieldClassName}
        />
      </div>
      <input name="botcheck" type="checkbox" tabIndex={-1} aria-hidden="true" className="hidden" />
      <button
        type="submit"
        disabled={isSubmitting}
        className="form-button col-span-full flex min-h-[58px] w-full cursor-pointer items-center justify-between border-0 bg-ink px-6 text-label uppercase tracking-[.13em] text-ivory transition-colors duration-[250ms] disabled:cursor-wait disabled:opacity-70 max-tablet:col-auto"
      >
        {isSubmitting ? t("Envoi…") : t("Envoyer le message")} <span><Icon name="arrow-up-right" /></span>
      </button>
      <p
        aria-live="polite"
        className="col-span-full mb-0 mt-[-.8rem] min-h-4 text-caption leading-[1.6] text-[#6c6a64] max-tablet:col-auto"
      >
        {status === "unavailable" ? t("L’envoi est momentanément indisponible. Votre message n’a pas été envoyé. Vous pouvez nous joindre sur WhatsApp.") : null}
        {status === "limited" ? t("Trop de tentatives. Réessayez dans une heure ou contactez-nous sur WhatsApp.") : null}
        {status === "invalid" ? t("Vérifiez les champs du formulaire et écrivez un message d’au moins 20 caractères.") : null}
        {status === "error" ? (
          <>{t("L’envoi a échoué. Écrivez-nous directement par")}{" "}
            <a href={contacts.whatsappHq.href} target="_blank" rel="noreferrer" className="underline hover:text-accent">
              WhatsApp
            </a>{" "}{t("ou par")}{" "}
            <a href={contacts.email.href} className="underline hover:text-accent">
              e-mail
            </a>.
          </>
        ) : null}
      </p>
    </form>
  );
}
