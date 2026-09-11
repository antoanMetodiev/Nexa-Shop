"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { createClient } from "@/lib/supabase/browser-client";

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-950 focus:border-navy-500 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium text-navy-600";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsPending(false);
    if (signUpError) {
      setError(signUpError.message || t("genericError"));
      return;
    }

    // Email confirmation is off in Supabase → we already have a session.
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setCheckEmail(true);
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (checkEmail) {
    return (
      <div className="bg-white py-16">
        <Container>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-navy-100 p-6 text-center">
            <h1 className="text-xl font-bold text-navy-950">
              {t("checkEmailTitle")}
            </h1>
            <p className="text-sm text-navy-600">
              {t("checkEmailBody", { email })}
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <Container>
        <div className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-navy-100 p-6">
          <h1 className="text-xl font-bold text-navy-950">
            {t("signUpTitle")}
          </h1>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="email">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="password">
                {t("passwordLabel")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {isPending ? t("signingUp") : t("signUpButton")}
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-navy-400">
            <span className="h-px flex-1 bg-navy-100" />
            {t("orDivider")}
            <span className="h-px flex-1 bg-navy-100" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="rounded-lg border border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-800 transition-colors hover:bg-navy-50"
          >
            {t("googleButton")}
          </button>

          <p className="text-center text-sm text-navy-500">
            {t("haveAccount")}{" "}
            <Link
              href="/sign-in"
              className="font-medium text-navy-950 hover:underline"
            >
              {t("signInLink")}
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
