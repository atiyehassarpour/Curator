(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector(".language-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const year = document.querySelector("#year");
  const storageKey = "casg-language";

  const readPreferredLanguage = () => {
    const queryLanguage = new URLSearchParams(window.location.search).get("lang");
    if (queryLanguage === "fa" || queryLanguage === "en") return queryLanguage;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "fa" || stored === "en") return stored;
    } catch (_) {}
    return "fa";
  };

  const setLanguage = (language, persist = true) => {
    const isEnglish = language === "en";
    root.lang = isEnglish ? "en" : "fa";
    root.dir = isEnglish ? "ltr" : "rtl";
    document.body.lang = root.lang;
    document.body.dir = root.dir;
    document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
      element.innerHTML = isEnglish ? element.dataset.en : element.dataset.fa;
    });
    languageButton.setAttribute("aria-pressed", String(isEnglish));
    languageButton.setAttribute("aria-label", isEnglish ? "Switch to Persian" : "تغییر زبان به انگلیسی");
    nav.setAttribute("aria-label", isEnglish ? "Main navigation" : "ناوبری اصلی");
    menuButton.setAttribute("aria-label", isEnglish ? "Open navigation menu" : "باز کردن فهرست ناوبری");
    document.title = isEnglish
      ? (document.body.dataset.titleEn || "Contemporary Art Study Group")
      : (document.body.dataset.titleFa || "گروه مطالعاتی هنر معاصر | Contemporary Art Study Group");
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      const localizedDescription = isEnglish ? description.dataset.en : description.dataset.fa;
      if (localizedDescription) description.content = localizedDescription;
    }
    if (persist) {
      try { window.localStorage.setItem(storageKey, language); } catch (_) {}
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState({}, "", url);
    }
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", root.lang === "en" ? "Open navigation menu" : "باز کردن فهرست ناوبری");
  };

  languageButton.addEventListener("click", () => {
    setLanguage(root.lang === "fa" ? "en" : "fa");
  });

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !expanded);
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded
      ? (root.lang === "en" ? "Open navigation menu" : "باز کردن فهرست ناوبری")
      : (root.lang === "en" ? "Close navigation menu" : "بستن فهرست ناوبری"));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  if (year) year.textContent = new Date().getFullYear();
  setLanguage(readPreferredLanguage(), false);
})();
