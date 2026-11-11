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
    try { const stored = window.localStorage.getItem(storageKey); if (stored === "fa" || stored === "en") return stored; } catch (_) {}
    return "fa";
  };
  const setLanguage = (language, persist = true) => {
    const isEnglish = language === "en";
    root.lang = isEnglish ? "en" : "fa";
    root.dir = isEnglish ? "ltr" : "rtl";
    document.body.lang = root.lang;
    document.body.dir = root.dir;
    document.querySelectorAll("[data-fa][data-en]").forEach((el) => { el.innerHTML = isEnglish ? el.dataset.en : el.dataset.fa; });
    document.querySelectorAll("[data-placeholder-fa][data-placeholder-en]").forEach((el) => el.setAttribute("placeholder", isEnglish ? el.dataset.placeholderEn : el.dataset.placeholderFa));
    document.querySelectorAll("[data-aria-fa][data-aria-en]").forEach((el) => el.setAttribute("aria-label", isEnglish ? el.dataset.ariaEn : el.dataset.ariaFa));
    if (languageButton) { languageButton.setAttribute("aria-pressed", String(isEnglish)); languageButton.setAttribute("aria-label", isEnglish ? "Switch to Persian" : "تغییر زبان به انگلیسی"); }
    if (nav) nav.setAttribute("aria-label", isEnglish ? "Main navigation" : "ناوبری اصلی");
    if (menuButton) menuButton.setAttribute("aria-label", isEnglish ? "Open navigation menu" : "باز کردن فهرست ناوبری");
    document.title = isEnglish ? (document.body.dataset.titleEn || "Contemporary Art Study Group") : (document.body.dataset.titleFa || "گروه مطالعاتی هنر معاصر | Contemporary Art Study Group");
    const description = document.querySelector('meta[name="description"]');
    if (description) { const value = isEnglish ? description.dataset.en : description.dataset.fa; if (value) description.content = value; }
    document.dispatchEvent(new CustomEvent("casg:languagechange", { detail: { language } }));
    if (persist) {
      try { window.localStorage.setItem(storageKey, language); } catch (_) {}
      const url = new URL(window.location.href); url.searchParams.set("lang", language); window.history.replaceState({}, "", url);
    }
  };
  const closeMenu = () => {
    if (!nav || !menuButton) return;
    nav.classList.remove("is-open"); menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", root.lang === "en" ? "Open navigation menu" : "باز کردن فهرست ناوبری");
  };
  if (languageButton) languageButton.addEventListener("click", () => setLanguage(root.lang === "fa" ? "en" : "fa"));
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      nav.classList.toggle("is-open", !expanded); menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? (root.lang === "en" ? "Open navigation menu" : "باز کردن فهرست ناوبری") : (root.lang === "en" ? "Close navigation menu" : "بستن فهرست ناوبری"));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
    document.addEventListener("click", (event) => { if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  }

  const dialogueForm = document.querySelector("#online-dialogue-form");
  if (dialogueForm) {
    const status = document.querySelector("#dialogue-status");
    const apiMeta = document.querySelector('meta[name="casg-dialogue-api"]');
    const apiUrl = apiMeta ? apiMeta.content.trim() : "";
    const submitButton = dialogueForm.querySelector('button[type="submit"]');
    const fieldLabels = {
      fullName: ["نام و نام خانوادگی", "Full name"],
      email: ["ایمیل", "Email"],
      topic: ["موضوع گفت‌وگو", "Conversation topic"],
      timeOne: ["زمان پیشنهادی اول", "First suggested time"],
      timeTwo: ["زمان پیشنهادی دوم", "Second suggested time"],
      details: ["توضیحات تکمیلی", "Additional context"]
    };

    const getRequestLines = (english) => [
      english ? "CONTEMPORARY ART STUDY GROUP — ONLINE DIALOGUE REQUEST" : "گروه مطالعاتی هنر معاصر — درخواست جلسه گفت‌وگوی آنلاین",
      "",
      ...Object.entries(fieldLabels).filter(([name]) => name !== "timeTwo" || dialogueForm.elements[name].value)
        .map(([name, labels]) => (english ? labels[1] : labels[0]) + ": " + dialogueForm.elements[name].value.trim()),
      "",
      english ? "Please contact me to coordinate and confirm the meeting time." : "لطفاً برای هماهنگی و تأیید زمان جلسه با من تماس بگیرید."
    ];

    const downloadLocalRequest = (english) => {
      const blob = new Blob(["\uFEFF" + getRequestLines(english).join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "casg-online-dialogue-request.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    };

    dialogueForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!dialogueForm.reportValidity()) return;
      const english = root.lang === "en";

      if (!apiUrl) {
        downloadLocalRequest(english);
        if (status) status.textContent = english
          ? "Your request file has been prepared on this device. It has not been sent to the group yet."
          : "فایل درخواست روی دستگاه شما آماده شد؛ این درخواست هنوز برای گروه ارسال نشده است.";
        return;
      }

      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = english ? "Sending your request securely…" : "در حال ارسال امن درخواست شما…";

      const payload = {
        fullName: dialogueForm.elements.fullName.value.trim(),
        email: dialogueForm.elements.email.value.trim(),
        topic: dialogueForm.elements.topic.value.trim(),
        timeOne: dialogueForm.elements.timeOne.value,
        timeTwo: dialogueForm.elements.timeTwo.value,
        details: dialogueForm.elements.details.value.trim(),
        language: english ? "en" : "fa",
        website: dialogueForm.elements.website.value
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) {
          const messages = {
            429: english ? "Too many attempts. Please wait a minute and try again." : "تعداد درخواست‌ها زیاد است؛ یک دقیقه صبر کنید و دوباره تلاش کنید.",
            503: english ? "The notification service is not configured yet. Please try again later." : "سرویس دریافت اعلان هنوز پیکربندی نشده است؛ لطفاً بعداً تلاش کنید."
          };
          throw new Error(messages[response.status] || (english
            ? "Your request could not be sent. Please try again later."
            : "ارسال درخواست انجام نشد؛ لطفاً کمی بعد دوباره تلاش کنید."));
        }
        if (status) status.textContent = english
          ? "Your request has been sent to the group. The team will contact you to confirm a suitable time."
          : "درخواست شما برای گروه ارسال شد. همکاران برای هماهنگی و تأیید زمان با شما تماس خواهند گرفت.";
        dialogueForm.reset();
      } catch (error) {
        if (status) status.textContent = error.message || (english
          ? "A connection error occurred. Please try again."
          : "در ارتباط خطایی رخ داد؛ لطفاً دوباره تلاش کنید.");
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
  if (year) year.textContent = new Date().getFullYear();
  setLanguage(readPreferredLanguage(), false);
})();
