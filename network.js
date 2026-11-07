(() => {
  const DATA_URL = "data/curator-network.json";
  const collections = ["curators", "exhibitions", "galleries", "museums", "artists", "projects", "publications"];
  const collectionNames = { curator:"curators", exhibition:"exhibitions", gallery:"galleries", museum:"museums", artist:"artists", project:"projects", publication:"publications" };
  const entityLabels = {
    curator:{fa:"کیوریتور",en:"Curator"}, exhibition:{fa:"نمایشگاه",en:"Exhibition"},
    gallery:{fa:"گالری",en:"Gallery"}, museum:{fa:"موزه",en:"Museum"},
    artist:{fa:"هنرمند",en:"Artist"}, project:{fa:"پروژه",en:"Project"},
    publication:{fa:"انتشار",en:"Publication"}
  };
  const relationLabels = {
    curated:{fa:"کیوریتور",en:"Curated by"}, hosted:{fa:"میزبان",en:"Hosted at"},
    participated:{fa:"هنرمند مشارکت‌کننده",en:"Participating artist"},
    collaborated:{fa:"همکاری",en:"Collaborated with"}, authored:{fa:"نویسنده",en:"Authored by"},
    documented:{fa:"مستندشده در",en:"Documented in"}, associated:{fa:"مرتبط با",en:"Associated with"}
  };
  const localized = (value, lang) => value && typeof value === "object" ? (value[lang] || value.en || value.fa || "") : (typeof value === "string" ? value : "");
  const collectionFor = (type) => collectionNames[type] || "";
  const findRecord = (data, type, id) => {
    const collection = collectionFor(type);
    return Array.isArray(data[collection]) ? data[collection].find((item) => item.id === id && item.status === "published") : null;
  };
  const visibleRelations = (data, type, id) => (data.relationships || []).filter((r) => {
    if (r.status !== "published" || !hasVerifiedSources(data, r.sourceIds)) return false;
    const matches = (r.fromType === type && r.fromId === id) || (r.toType === type && r.toId === id);
    return matches && Boolean(findRecord(data, r.fromType, r.fromId) && findRecord(data, r.toType, r.toId));
  });
  const titleOf = (record, lang) => localized(record.name || record.title, lang) || (lang === "fa" ? "بدون عنوان" : "Untitled");
  const load = async () => {
    const response = await fetch(DATA_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Network data could not be loaded (" + response.status + ").");
    const data = await response.json();
    if (data.schemaVersion !== 1 || !collections.every((key) => Array.isArray(data[key])) || !Array.isArray(data.relationships) || !Array.isArray(data.sources)) throw new Error("Unsupported curator network data structure.");
    return data;
  };
  const safeExternalLink = (url) => { try { const parsed = new URL(url); return parsed.protocol === "https:" ? parsed.href : null; } catch (_) { return null; } };
  const makeEntityUrl = (type, id) => "entity.html?type=" + encodeURIComponent(type) + "&id=" + encodeURIComponent(id);
  const makeLink = (href, label, className) => { const a = document.createElement("a"); a.href = href; a.textContent = label; if (className) a.className = className; return a; };
  window.CASGNetwork = { collections, entityLabels, relationLabels, localized, collectionFor, hasVerifiedSources, isVerifiedRecord, findRecord, visibleRelations, titleOf, load, safeExternalLink, makeEntityUrl, makeLink };
})();