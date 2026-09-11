"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser-client";

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-950 focus:border-navy-500 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium text-navy-600";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export function AccountSettingsForm({ user }: { user: User }) {
  const t = useTranslations("account");
  const isEmailProvider = user.app_metadata?.provider === "email";

  const [name, setName] = useState(
    (user.user_metadata?.full_name as string | undefined) ?? "",
  );
  const [phone, setPhone] = useState(
    (user.user_metadata?.phone as string | undefined) ?? "",
  );
  const [avatarUrl, setAvatarUrl] = useState(
    (user.user_metadata?.avatar_url as string | undefined) ?? "",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError(t("avatarInvalidType"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setProfileError(t("avatarTooLarge"));
      return;
    }
    setProfileError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setIsSavingProfile(true);

    const supabase = createClient();
    let nextAvatarUrl = avatarUrl;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        console.error("Avatar upload failed:", uploadError.message);
        setProfileError(t("genericError"));
        setIsSavingProfile(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      nextAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        phone,
        avatar_url: nextAvatarUrl,
      },
    });

    setIsSavingProfile(false);
    if (error) {
      setProfileError(t("genericError"));
      return;
    }

    setAvatarUrl(nextAvatarUrl);
    setAvatarFile(null);
    setAvatarPreview(null);
    setProfileSuccess(true);
  }

  async function handleSavePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t("passwordMismatch"));
      return;
    }

    setIsSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setIsSavingPassword(false);

    if (error) {
      setPasswordError(t("genericError"));
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
  }

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <form
        onSubmit={handleSaveProfile}
        className="flex flex-col gap-4 rounded-2xl border border-navy-100 p-6"
      >
        <h2 className="text-base font-semibold text-navy-950">
          {t("profileHeading")}
        </h2>

        {profileError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {profileError}
          </p>
        )}
        {profileSuccess && !profileError && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {t("profileSuccess")}
          </p>
        )}

        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-navy-200 bg-navy-50 text-lg font-semibold text-navy-500">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt=""
                width={64}
                height={64}
                className="size-full object-cover"
              />
            ) : (
              (name || user.email || "?").charAt(0).toUpperCase()
            )}
          </div>
          <label className="cursor-pointer rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-navy-50">
            {t("changePhoto")}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className={labelClass} htmlFor="name">
            {t("nameLabel")}
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            {t("phoneLabel")}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+359 88 123 4567"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            {t("emailLabel")}
          </label>
          <input
            id="email"
            value={user.email ?? ""}
            disabled
            className={`${inputClass} cursor-not-allowed bg-navy-50 text-navy-400`}
          />
        </div>

        <button
          type="submit"
          disabled={isSavingProfile}
          className="self-start rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
        >
          {isSavingProfile ? t("saving") : t("saveButton")}
        </button>
      </form>

      {isEmailProvider && (
        <form
          onSubmit={handleSavePassword}
          className="flex flex-col gap-4 rounded-2xl border border-navy-100 p-6"
        >
          <h2 className="text-base font-semibold text-navy-950">
            {t("passwordHeading")}
          </h2>

          {passwordError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {passwordError}
            </p>
          )}
          {passwordSuccess && !passwordError && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {t("passwordSuccess")}
            </p>
          )}

          <div>
            <label className={labelClass} htmlFor="new-password">
              {t("newPasswordLabel")}
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="confirm-password">
              {t("confirmPasswordLabel")}
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSavingPassword}
            className="self-start rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
          >
            {isSavingPassword ? t("saving") : t("saveButton")}
          </button>
        </form>
      )}
    </div>
  );
}
