import { LanguageDetectorAsyncModule } from "i18next";
import { getLocales } from "expo-localization";
import { getLocale } from "@/app/technical/storage/settings";

export const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  init: () => {},
  cacheUserLanguage: () => {},
  async: true,
  detect: (callback) => {
    const userPreferredLanguage = getLocales();

    getLocale()
      .then((storedLanguage: string) => {
        callback(storedLanguage || userPreferredLanguage[0].languageCode);
      })
      .catch((e) => {
        callback(userPreferredLanguage[0].languageCode);
      });
  },
};
