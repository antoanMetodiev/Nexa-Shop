"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    // TODO: свържи с реален email доставчик, когато Supabase е готов.
    setSubmittedEmail(email);
    setEmail("");
  }

  return (
    <section className="bg-navy-950 py-16">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-navy-800 text-white">
            <Mail className="size-5" />
          </span>
          <h2 className="text-2xl font-bold text-white">{t("heading")}</h2>
          <p className="text-sm text-navy-300">{t("subheading")}</p>

          {submittedEmail ? (
            <p className="rounded-full bg-navy-800 px-5 py-3 text-sm font-medium text-white">
              {t("thanks", { email: submittedEmail })}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 pt-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("placeholder")}
                className="w-full flex-1 rounded-full border border-navy-700 bg-navy-900 px-5 py-3 text-sm text-white placeholder:text-navy-400 focus:border-navy-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-navy-100"
              >
                {t("subscribe")}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
