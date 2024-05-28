import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationPL from "./locales/pl/translation.json";
import translationFR from "./locales/fr/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  pl: {
    translation: translationPL,
  },
  fr: {
    translation: translationFR,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
