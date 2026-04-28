"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, toggleLocale } = useTranslations();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="font-semibold"
      aria-label="Toggle language"
      title={locale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      {locale === "pt" ? "PT" : "EN"}
    </Button>
  );
}
