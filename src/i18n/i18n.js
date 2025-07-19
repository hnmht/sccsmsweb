import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";

import translationEnUS from "./translations/en-US.json";
import translationZhHans from "./translations/zh-Hans.json"

const resources = {
    "en-US": {
        translation: translationEnUS,
    },
    "zh-Hans": {
        translation: translationZhHans
    },
};

i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        resources,
        supportedLngs:["en-US","zh-Hans"],
        // lng:"en-US",        
        fallbackLng: "en-US",
        interpolation: {
            escapeValue: false,
        },
    });