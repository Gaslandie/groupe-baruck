"use client";

import { pageText } from "@/lib/page-content";


import { useRef, useState, type FormEvent } from "react";

import { contactSubjects, contactSubjectLabels } from "@/data/contact";
import { contacts } from "@/data/site";
import { Icon } from "../ui/Icon";

const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL;
const localPreview = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_CONTACT_PREVIEW === "1";

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
        credentials: "same-origin",
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
      <div role="status" id={id} className={`${containerClassName} is-visible`}>
        <p className="eyebrow col-span-full">{localPreview ? pageText("contact", "copy.ContactForm.1") : pageText("contact", "copy.ContactForm.2")}</p>
        <h2 className="col-span-full m-0 max-w-[650px] font-display text-display-xl font-normal leading-[.95] tracking-[-.04em]">{localPreview ? pageText("contact", "copy.ContactForm.3") : pageText("contact", "copy.ContactForm.4")}</h2>
        {!localPreview ? <p className="col-span-full m-0 max-w-[540px] text-small leading-[1.7] text-[#686762]">{pageText("contact", "copy.ContactForm.5")}</p> : null}
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="button button-accent col-span-full w-fit max-tablet:col-auto max-tablet:w-full"
        >{(pageText("contact", "copy.ContactForm.6") + " ")}<span><Icon name="arrow-up-right" /></span>
        </a>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={handleSubmit} className={containerClassName}>
      {contactUrl && !localPreview ? <iframe src={`${contactUrl}?prepare=1`} title={pageText("contact", "copy.ContactForm.7")} hidden /> : null}
      {showTitle ? <p className="eyebrow col-span-full">{pageText("contact", "copy.ContactForm.8")}</p> : null}
      <p className="col-span-full m-0 text-small leading-[1.7] text-[#686762]">
        {localPreview
          ? pageText("contact", "copy.ContactForm.9")
          : pageText("contact", "copy.ContactForm.10")}
      </p>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-name`} className={labelClassName}>{pageText("contact", "copy.ContactForm.11")}</label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={120} required className={fieldClassName} />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-email`} className={labelClassName}>{pageText("contact", "copy.ContactDetails.7")}</label>
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
        <label htmlFor={`${id}-phone`} className={labelClassName}>{pageText("contact", "copy.ContactForm.12")}</label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          placeholder={pageText("contact", "copy.ContactForm.13")}
          className={`${fieldClassName} placeholder:text-[#aaa69e]`}
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor={`${id}-objet`} className={labelClassName}>{pageText("contact", "copy.ContactForm.14")}</label>
        <div className="relative">
          <select
            id={`${id}-objet`}
            name="objet"
            required
            defaultValue=""
            className={`${fieldClassName} appearance-none pr-9`}
          >
            <option value="" disabled>{pageText("contact", "copy.ContactForm.15")}</option>
            {contactSubjects.map((subject,index) => (
              <option key={subject} value={subject}>
                {contactSubjectLabels[index]}
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
          {pageText("contact", "copy.ContactForm.16")}</label>
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
        {isSubmitting ? pageText("contact", "copy.ContactForm.17") : pageText("contact", "copy.ContactForm.18")} <span><Icon name="arrow-up-right" /></span>
      </button>
      <p
        aria-live="polite"
        className="col-span-full mb-0 mt-[-.8rem] min-h-4 text-caption leading-[1.6] text-[#6c6a64] max-tablet:col-auto"
      >
        {status === "unavailable" ? pageText("contact", "copy.ContactForm.19") : null}
        {status === "limited" ? pageText("contact", "copy.ContactForm.20") : null}
        {status === "invalid" ? pageText("contact", "copy.ContactForm.21") : null}
        {status === "error" ? (
          <>{pageText("contact", "copy.ContactForm.22")}{" "}
            <a href={contacts.whatsappHq.href} target="_blank" rel="noreferrer" className="underline hover:text-accent">
              {pageText("contact", "copy.ContactForm.23")}</a>.
          </>
        ) : null}
      </p>
    </form>
  );
}
