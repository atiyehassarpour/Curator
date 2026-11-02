(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector(".language-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const year = document.querySelector("#year");

  const setLanguage = (language) => {
    const isEnglish = language === "en";
    root.lang = isEnglish ? "en" : "fa";
    root.dir = isEnglish ? "ltr" : "rtl";
    document.body.lang = root.lang;
    document.body.dir = root.dir;
    document.querySelectorAll("[data-fa][data-en]").forEach((element) => {
      element.innerHTML = isEnglish ? element.dataset.en : element.dataset.fa;
    });
    languageButton.setAttribute("aria-pressed", String(isEnglish));
    languageButton.setAttribute("aria-label", isEnglish ? "Switch to Persian" : "Switch to English");
    document.title = isEnglish
      ? "Contemporary Art Study Group"
      : "گروه مطالعاتی هنر معاصر | Contemporary Art Study Group";
    const description = document.querySelector('meta[name="description"]');
    description.content = isEnglish
      ? "An independent platform for research, documentation, and dialogue around contemporary art, bringing perspectives from Iran into an international context."
      : "گروه مطالعاتی هنر معاصر؛ بستری مستقل برای پژوهش، مستندسازی و گفت‌وگوی حرفه‌ای درباره هنر معاصر با تمرکز بر ایران در زمینه‌ای بین‌المللی.";
  };

  languageButton.addEventListener("click", () => {
    setLanguage(root.lang === "fa" ? "en" : "fa");
  });

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  year.textContent = new Date().getFullYear();
  setLanguage("fa");
})();