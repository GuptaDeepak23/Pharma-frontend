import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// We load translations via static JSON files served from public/
// Keep resources minimal here; actual strings live in public/locales/*
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "hi", "ta", "ml", "mr", "gu"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: { useSuspense: true },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },
    resources: undefined,
    // We use the default public path: /locales/{lng}/{ns}.json
    // See: public/locales/en/translation.json
    ns: ["translation"],
    defaultNS: "translation",
    load: "currentOnly",
  });

export default i18n;


