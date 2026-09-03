"use client";

import { useState, type FormEvent } from "react";

const successMessage =
  "Merci. Le formulaire de démonstration est prêt à être relié au service d’envoi définitif.";

export function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(successMessage);
  };

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="reveal grid content-center grid-cols-2 gap-x-6 gap-y-8 bg-ivory px-[clamp(2rem,7vw,8rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor="full-name" className="text-[.53rem] uppercase tracking-[.13em] text-[#6f6d67]">
          Nom complet
        </label>
        <input
          id="full-name"
          name="full-name"
          type="text"
          autoComplete="name"
          required
          placeholder="Votre nom"
          className="w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none placeholder:text-[#aaa69e] focus:border-accent"
        />
      </div>
      <div className="flex flex-col gap-[.7rem]">
        <label htmlFor="contact-info" className="text-[.53rem] uppercase tracking-[.13em] text-[#6f6d67]">
          Téléphone ou e-mail
        </label>
        <input
          id="contact-info"
          name="contact-info"
          type="text"
          required
          placeholder="Comment vous joindre ?"
          className="w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none placeholder:text-[#aaa69e] focus:border-accent"
        />
      </div>
      <div className="col-span-full flex flex-col gap-[.7rem] max-tablet:col-auto">
        <label htmlFor="subject" className="text-[.53rem] uppercase tracking-[.13em] text-[#6f6d67]">
          Objet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Votre demande"
          className="w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none placeholder:text-[#aaa69e] focus:border-accent"
        />
      </div>
      <div className="col-span-full flex flex-col gap-[.7rem] max-tablet:col-auto">
        <label htmlFor="message" className="text-[.53rem] uppercase tracking-[.13em] text-[#6f6d67]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Parlez-nous de votre projet"
          className="w-full resize-y rounded-none border-0 border-b border-[#c8c4bb] bg-transparent py-[.8rem] text-ink outline-none placeholder:text-[#aaa69e] focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="col-span-full flex min-h-[58px] w-full cursor-pointer items-center justify-between border-0 bg-ink px-6 text-[.64rem] uppercase tracking-[.13em] text-ivory transition-colors duration-[250ms] hover:bg-accent max-tablet:col-auto"
      >
        Envoyer le message <span>↗</span>
      </button>
      <p
        aria-live="polite"
        className="col-span-full mb-0 mt-[-.8rem] min-h-4 text-[.7rem] text-[#6c6a64] max-tablet:col-auto"
      >
        {status}
      </p>
    </form>
  );
}
