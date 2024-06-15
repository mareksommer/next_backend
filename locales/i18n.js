import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import en from "@/locales/en.json";
import cs from "@/locales/cs.json";

i18n
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: "en",
    debug: false,
    resources: {
      en: {
        translation: { ...en },
      },
      cs: {
        translation: { ...cs },
      },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
