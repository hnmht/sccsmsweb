import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";

import translationEnUS from "./translations/en-us.json";
import translationZhHans from "./translations/zh-hans.json"

const resources = {
    "en-us": {
        translation: translationEnUS,
    },
    "zh-hans": {
        translation: translationZhHans
    },
};

i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        resources,
        supportedLngs:["en-us","zh-hans"],
        // lang:"en-us",        
        fallbackLng: "en-us",
        interpolation: {
            escapeValue: false,
        },
    });

    export default i18n;