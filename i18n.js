import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    detection: {
      order: ["path", "header", "localStorage", "cookie", "subdomain"],
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
    react: {
      useSuspense: false,
    },
    resources: {
      en: {
        translation: {
          key: "value",
        },
      },
    },
    lng: "en",
    interpolation: {
      escapeValue: false,
      format: function (value, format, lng) {
        if (format === "uppercase") return value.toUpperCase();
        return value;
      },
    },
    backend: {
      loadPath: "public/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
