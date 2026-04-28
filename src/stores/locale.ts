import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "pt" | "en";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const LocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "pt",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set({ locale: get().locale === "pt" ? "en" : "pt" }),
    }),
    {
      name: "locale-storage",
    }
  )
);
