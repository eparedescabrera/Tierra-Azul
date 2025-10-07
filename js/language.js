(function () {
  const SUPPORTED_LANGUAGES = ["es", "en"];
  const DEFAULT_LANGUAGE = "es";

  function getInitialLanguage() {
    const stored = window.localStorage.getItem("preferredLanguage");
    if (SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
    const htmlLang = document.documentElement.lang;
    if (SUPPORTED_LANGUAGES.includes(htmlLang)) {
      return htmlLang;
    }
    return DEFAULT_LANGUAGE;
  }

  function applyTranslation(element, language) {
    const dataKey = `lang${language.charAt(0).toUpperCase()}${language.slice(1)}`;
    const translation = element.dataset[dataKey];
    if (!translation) {
      return;
    }

    const targetAttribute = element.getAttribute("data-lang-attr");
    if (targetAttribute) {
      element.setAttribute(targetAttribute, translation);
      return;
    }

    if (element.getAttribute("data-lang-html") === "true") {
      element.innerHTML = translation;
      return;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", translation);
      } else {
        element.value = translation;
      }
      return;
    }

    element.textContent = translation;
  }

  function setLanguage(language) {
    const lang = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-lang-es]").forEach((element) => {
      applyTranslation(element, lang);
    });

    window.localStorage.setItem("preferredLanguage", lang);
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { language: lang } }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const initialLanguage = getInitialLanguage();
    const select = document.querySelector("[data-language-select]");

    if (select) {
      select.value = initialLanguage;
      select.addEventListener("change", (event) => {
        setLanguage(event.target.value);
      });
    }

    setLanguage(initialLanguage);
  });

  window.setLanguage = setLanguage;
})();
