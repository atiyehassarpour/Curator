(() => {
  const api = window.CASGNetwork, root = document.querySelector("[data-profile-root]");
  if (!api || !root) return;
  const language = () => document.documentElement.lang === "en" ? "en" : "fa";
  let data = null, curator = null;
  const setText = (selector, value) => { const el = root.querySelector(selector); if (el) el.textContent = value || ""; };
  const labels = {
    exhibition:{fa:"نمایشگاه‌ها",en:"Exhibitions"}, gallery:{fa:"گالری‌ها",en:"Galleries"}, museum:{fa:"موزه‌ها",en:"Museums"},
    artist:{fa:"هنرمندان",en:"Artists"}, project:{fa:"پروژه‌ها",en:"Projects"}, publication:{fa:"مقالات و انتشارات",en:"Writing & publications"}
  };
  const renderRelations = () => {
    const container = root.querySelector("#profile-relationships"); container.replaceChildren(); const lang = language();
    const grouped = new Map();
    api.visibleRelations(data, "curator", curator.id).forEach((relation) => {
      const fromCurator = relation.fromType === "curator" && relation.fromId === curator.id;
      const type = fromCurator ? relation.toType : relation.fromType, id = fromCurator ? relation.toId : relation.fromId;
      if (!labels[type]) return; const record = api.findRecord(data, type, id); if (!record) return;
      if (!grouped.has(type)) grouped.set(type, []); grouped.get(type).push({ record, relation });
    });
    Object.keys(labels).forEach((type) => {
      const section = document.createElement("section"); section.className = "network-group";
      const heading = document.createElement("h2"); heading.textContent = labels[type][lang]; section.append(heading);
      const items = grouped.get(type) || [];
      if (!items.length) { const empty = document.createElement("p"); empty.className = "network-empty"; empty.textContent = lang === "fa" ? "مورد تأییدشده‌ای ثبت نشده است." : "No verified records are linked yet."; section.append(empty); }
      else {
        const list = document.createElement("div"); list.className = "network-card-list";
        items.forEach(({record, relation}) => {
          const card = document.createElement("article"); card.className = "network-card";
          const link = api.makeLink(api.makeEntityUrl(type, record.id), api.titleOf(record, lang));
          const note = document.createElement("p"); note.textContent = api.localized(relation.role, lang) || api.localized(record.summary, lang) || "";
          card.append(link, note); list.append(card);
        }); section.append(list);
      }
      container.append(section);
    });
  };
  const render = () => {
    const lang = language(), name = api.titleOf(curator, lang);
    setText("[data-profile-name]", name); setText("[data-profile-biography]", api.localized(curator.biography, lang));
    setText("[data-profile-approach]", api.localized(curator.approach, lang));
    setText("[data-profile-location]", [api.localized(curator.city, lang), api.localized(curator.country, lang)].filter(Boolean).join(" · "));
    document.title = lang === "fa" ? name + " | کیوریتورها" : name + " | Curators"; renderRelations();
    const list = root.querySelector("#profile-sources"); list.replaceChildren();
    (curator.sourceIds || []).forEach((id) => {
      const source = data.sources.find((item) => item.id === id && item.status === "published"); if (!source) return;
      const item = document.createElement("li"); item.textContent = api.localized(source.title, lang);
      const url = api.safeExternalLink(source.url); if (url) item.append(" — ", api.makeLink(url, lang === "fa" ? "مشاهده منبع" : "View source"));
      list.append(item);
    });
  };
  const unavailable = () => {
    setText("[data-profile-name]", language() === "fa" ? "پروفایل در دسترس نیست" : "Profile unavailable");
    setText("[data-profile-biography]", language() === "fa" ? "این پروفایل وجود ندارد یا هنوز برای انتشار تأیید نشده است." : "This profile does not exist or has not been approved for publication.");
    root.querySelector("#profile-relationships").replaceChildren();
  };
  (async () => {
    try { data = await api.load(); const id = new URLSearchParams(location.search).get("id"); curator = id ? api.findRecord(data, "curator", id) : null;
      if (!curator) return unavailable(); render(); document.addEventListener("casg:languagechange", render);
    } catch (error) { unavailable(); console.error(error); }
  })();
})();