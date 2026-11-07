(() => {
  const api = window.CASGNetwork, root = document.querySelector("[data-entity-root]");
  if (!api || !root) return;
  const language = () => document.documentElement.lang === "en" ? "en" : "fa";
  let data = null, record = null, type = null;
  const setText = (selector, value) => { const el = root.querySelector(selector); if (el) el.textContent = value || ""; };
  const render = () => {
    const lang = language(); setText("[data-entity-type]", api.entityLabels[type]?.[lang] || "");
    setText("[data-entity-name]", api.titleOf(record, lang)); setText("[data-entity-summary]", api.localized(record.summary || record.description, lang));
    const connections = root.querySelector("#entity-connections"); connections.replaceChildren();
    api.visibleRelations(data, type, record.id).forEach((relation) => {
      const fromCurrent = relation.fromType === type && relation.fromId === record.id;
      const otherType = fromCurrent ? relation.toType : relation.fromType, otherId = fromCurrent ? relation.toId : relation.fromId;
      const other = api.findRecord(data, otherType, otherId); if (!other) return;
      const card = document.createElement("article"); card.className = "network-card";
      const link = api.makeLink(api.makeEntityUrl(otherType, otherId), api.titleOf(other, lang));
      const note = document.createElement("p"); note.textContent = api.localized(relation.role, lang) || api.relationLabels[relation.relationType]?.[lang] || "";
      card.append(link, note); connections.append(card);
    });
    const curators = root.querySelector("#entity-curator-links"); curators.replaceChildren();
    api.visibleRelations(data, type, record.id).forEach((relation) => {
      const id = relation.fromType === "curator" ? relation.fromId : relation.toType === "curator" ? relation.toId : null;
      if (!id) return; const curator = api.findRecord(data, "curator", id); if (curator) curators.append(api.makeLink("curator-profile-template.html?id=" + encodeURIComponent(id), api.titleOf(curator, lang)));
    });
  };
  (async () => {
    try {
      data = await api.load(); const params = new URLSearchParams(location.search); type = params.get("type"); const id = params.get("id");
      record = ["exhibition","gallery","museum","artist","project","publication"].includes(type) && id ? api.findRecord(data, type, id) : null;
      if (!record) {
        setText("[data-entity-type]", language() === "fa" ? "موجودیت" : "Entity");
        setText("[data-entity-name]", language() === "fa" ? "موردی برای نمایش وجود ندارد" : "No record available");
        setText("[data-entity-summary]", language() === "fa" ? "این صفحه پس از ثبت و تأیید اطلاعات معتبر فعال می‌شود." : "This page becomes active when verified information is available.");
        return;
      }
      render(); document.addEventListener("casg:languagechange", render);
    } catch (error) { setText("[data-entity-name]", language() === "fa" ? "خطا در بارگذاری اطلاعات" : "Unable to load this record"); console.error(error); }
  })();
})();