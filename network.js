(() => {
  const DATA_URL = "data/curator-network.json";
  const collections = ["curators", "exhibitions", "galleries", "museums", "artists", "projects", "publications"];
  const collectionNames = {
    curator: "curators",
    exhibition: "exhibitions",
    gallery: "galleries",
    museum: "museums",
    artist: "artists",
    project: "projects",
    publication: "publications"
  };
  const entityLabels = {
    curator: { fa: "کیوریتور", en: "Curator" },
    exhibition: { fa: "نمایشگاه", en: "Exhibition" },
    gallery: { fa: "گالری", en: "Gallery" },
    museum: { fa: "موزه", en: "Museum" },
    artist: { fa: "هنرمند", en: "Artist" },
    project: { fa: "پروژه", en: "Project" },
    publication: { fa: "انتشار", en: "Publication" }
  };
  const relationLabels = {
    curated: { fa: "کیوریتور", en: "Curated by" },
    hosted: { fa: "میزبان", en: "Hosted at" },
    participated: { fa: "هنرمند مشارکت‌کننده", en: "Participating artist" },
    collaborated: { fa: "همکاری", en: "Collaborated with" },
    authored: { fa: "نویسنده", en: "Authored by" },
    documented: { fa: "مستندشده در", en: "Documented in" },
    associated: { fa: "مرتبط با", en: "Associated with" }
  };

  const localized = (value, language) => {
    if (value && typeof value === "object") return value[language] || value.en || value.fa || "";
    return typeof value === "string" ? value : "";
  };
  const collectionFor = (type) => collectionNames[type] || "";
  const safeExternalLink = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" ? parsed.href : null;
    } catch (_) {
      return null;
    }
  };
  const hasVerifiedSources = (data, sourceIds) => {
    if (!Array.isArray(sourceIds) || sourceIds.length === 0) return false;
    return sourceIds.every((id) => {
      const source = (data.sources || []).find((item) => item.id === id && item.status === "published");
      return Boolean(source && source.title && safeExternalLink(source.url));
    });
  };
  const isVerifiedRecord = (data, record) => Boolean(
    record &&
    record.status === "published" &&
    record.reviewStatus === "approved" &&
    record.reviewedAt &&
    hasVerifiedSources(data, record.sourceIds)
  );
  const findRecord = (data, type, id) => {
    const collection = collectionFor(type);
    return Array.isArray(data[collection])
      ? data[collection].find((item) => item.id === id && isVerifiedRecord(data, item)) || null
      : null;
  };
  const visibleRelations = (data, type, id) => (data.relationships || []).filter((relation) => {
    if (relation.status !== "published" || !hasVerifiedSources(data, relation.sourceIds)) return false;
    const matches = (relation.fromType === type && relation.fromId === id) ||
      (relation.toType === type && relation.toId === id);
    return matches &&
      Boolean(findRecord(data, relation.fromType, relation.fromId)) &&
      Boolean(findRecord(data, relation.toType, relation.toId));
  });
  const titleOf = (record, language) =>
    localized(record.name || record.title, language) || (language === "fa" ? "بدون عنوان" : "Untitled");
  const load = async () => {
    const response = await fetch(DATA_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Network data could not be loaded (" + response.status + ").");
    const data = await response.json();
    if (
      data.schemaVersion !== 1 ||
      !collections.every((key) => Array.isArray(data[key])) ||
      !Array.isArray(data.relationships) ||
      !Array.isArray(data.sources)
    ) throw new Error("Unsupported curator network data structure.");
    return data;
  };
  const makeEntityUrl = (type, id) =>
    "entity.html?type=" + encodeURIComponent(type) + "&id=" + encodeURIComponent(id);
  const makeLink = (href, label, className) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (className) link.className = className;
    return link;
  };

  window.CASGNetwork = {
    collections, entityLabels, relationLabels, localized, collectionFor,
    hasVerifiedSources, isVerifiedRecord, findRecord, visibleRelations,
    titleOf, load, safeExternalLink, makeEntityUrl, makeLink
  };
})();