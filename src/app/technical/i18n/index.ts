import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./fr.json";
import en from "./en.json";
import { languageDetector } from "@/app/technical/i18n/languageDetector";
import { setLocale } from "@/app/technical/storage/settings";

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: "v3",
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng: string) => {
  setLocale(lng);
});
