(() => {
  const api = window.CASGNetwork, search = document.querySelector("#curator-search"), fields = document.querySelector("#curator-field"), locations = document.querySelector("#curator-location"), count = document.querySelector("#result-count"), grid = document.querySelector("#curator-grid");
  if (!api || !grid || !count) return;
  let profiles = [];
  const language = () => document.documentElement.lang === "en" ? "en" : "fa";
  const update = () => {
    const lang = language(), query = (search?.value || "").trim().toLocaleLowerCase(); let visible = 0;
    grid.querySelectorAll("[data-curator-profile]").forEach((card) => {
      const record = profiles.find((item) => item.id === card.dataset.curatorProfile);
      const matchText = !query || (card.dataset.search || "").toLocaleLowerCase().includes(query);
      const matchField = !fields || fields.value === "all" || (record.practiceTypes || []).includes(fields.value);
      const matchLocation = !locations || locations.value === "all" || record.locationGroup === locations.value;
      card.hidden = !(matchText && matchField && matchLocation); if (!card.hidden) visible++;
    });
    count.textContent = lang === "fa" ? visible + " پروفایل" : visible + " curator profiles";
  };
  const renderCard = (record) => {
    const lang = language(), card = document.createElement("article"); card.className = "curator-card"; card.dataset.curatorProfile = record.id;
    card.dataset.search = [api.titleOf(record, lang), api.localized(record.city, lang), api.localized(record.country, lang), api.localized(record.biography, lang), ...(record.fields || []).map((v) => api.localized(v, lang))].join(" ");
    card.dataset.field = (record.practiceTypes || [])[0] || ""; card.dataset.location = record.locationGroup || "";
    const index = document.createElement("span"); index.className = "empty-index"; index.textContent = "CURATOR / " + String(profiles.indexOf(record) + 1).padStart(3, "0");
    const title = document.createElement("h2"); title.textContent = api.titleOf(record, lang);
    const meta = document.createElement("p"); meta.className = "curator-card-meta"; meta.textContent = [api.localized(record.city, lang), api.localized(record.country, lang)].filter(Boolean).join(" · ");
    const summary = document.createElement("p"); summary.textContent = api.localized(record.biography, lang);
    const link = api.makeLink("curator-profile-template.html?id=" + encodeURIComponent(record.id), lang === "fa" ? "مشاهده پروفایل ←" : "View profile →", "curator-card-link");
    card.append(index, title, meta, summary, link); return card;
  };
  const render = async () => {
    try {
      const data = await api.load(); profiles = data.curators.filter((r) => r.id && api.isVerifiedRecord(data, r));
      grid.replaceChildren();
      if (!profiles.length) {
        const empty = document.createElement("article"); empty.className = "curator-empty";
        const heading = document.createElement("h2"), copy = document.createElement("p"), status = document.createElement("span");
        heading.textContent = language() === "fa" ? "پروفایل تأییدشده‌ای منتشر نشده است" : "No verified curator profiles yet";
        copy.textContent = language() === "fa" ? "پس از تکمیل بررسی تحریریه و تأیید منابع، پروفایل‌ها در این بخش نمایش داده می‌شوند." : "Profiles will appear here after editorial review and source verification.";
        status.className = "content-status"; status.textContent = language() === "fa" ? "در انتظار محتوای تأییدشده" : "AWAITING VERIFIED CONTENT";
        empty.append(heading, copy, status); grid.append(empty);
        count.textContent = language() === "fa" ? "هنوز پروفایل تأییدشده‌ای منتشر نشده است." : "No verified curator profiles have been published."; return;
      }
      profiles.forEach((r) => grid.append(renderCard(r))); update();
    } catch (error) { count.textContent = language() === "fa" ? "بارگذاری اطلاعات با مشکل روبه‌رو شد." : "There was a problem loading directory data."; console.error(error); }
  };
  [search, fields, locations].filter(Boolean).forEach((el) => el.addEventListener("input", update));
  document.addEventListener("casg:languagechange", () => {
    if (profiles.length) { grid.replaceChildren(...profiles.map(renderCard)); update(); }
    else count.textContent = language() === "fa" ? "هنوز پروفایل تأییدشده‌ای منتشر نشده است." : "No verified curator profiles have been published.";
  });
  render();
})();