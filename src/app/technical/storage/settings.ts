import { AppStorage } from "@/app/technical/storage";

enum E_STORAGE_KEYS {
  CURRENT_LOCALE = "CURRENT_LOCALE",
  LOGS = "LOGS",
}

export const setLocale = (lng: string) =>
  AppStorage.setItem(E_STORAGE_KEYS.CURRENT_LOCALE, lng);

export const getLocale = () =>
  AppStorage.getItem(E_STORAGE_KEYS.CURRENT_LOCALE);
