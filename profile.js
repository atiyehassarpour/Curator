(() => {
  const api = window.CASGNetwork, root = document.querySelector("[data-profile-root]");
  if (!api || !root) return;
  const language = () => document.documentElement.lang === "en" ? "en" : "fa";
  let data = null, curator = null;
  const labels = {
    exhibition:{fa:"نمایشگاه‌های کیوریتوری‌شده",en:"Curated exhibitions"},
    gallery:{fa:"گالری‌های مرتبط",en:"Related galleries"},
    museum:{fa:"موزه‌های مرتبط",en:"Related museums"},
    artist:{fa:"هنرمندان مرتبط",en:"Related artists"},
    project:{fa:"پروژه‌ها و همکاری‌ها",en:"Projects & collaborations"},
    publication:{fa:"مقالات و انتشارات",en:"Writing & publications"}
  };
  const localized = value => api.localized(value, language());
  const node = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined && value !== null) el.textContent = value;
    return el;
  };
  const setText = (selector, value) => {
    const el = root.querySelector(selector);
    if (el) el.textContent = value || "";
  };
  const verifiedRecord = (type,id) => api.findRecord(data,type,id);
  const addCard = (container, type, record, note, meta) => {
    const card = node("article","network-card");
    const href = type === "curator"
      ? "curator-profile-template.html?id=" + encodeURIComponent(record.id)
      : api.makeEntityUrl(type,record.id);
    card.append(api.makeLink(href,api.titleOf(record,language())));
    if (meta) card.append(node("span","network-card-meta",meta));
    if (note) card.append(node("p","",note));
    container.append(card);
  };
  const collectCuratorEdges = () => api.visibleRelations(data,"curator",curator.id).map(relation => {
    const outgoing = relation.fromType === "curator" && relation.fromId === curator.id;
    const type = outgoing ? relation.toType : relation.fromType;
    const id = outgoing ? relation.toId : relation.fromId;
    const record = verifiedRecord(type,id);
    return record && labels[type] ? {type,record,relation} : null;
  }).filter(Boolean);
  const collectIndirectExhibitionEdges = direct => {
    const exhibitionIds = new Set(direct.filter(item=>item.type==="exhibition").map(item=>item.record.id));
    const result=[];
    for (const exhibitionId of exhibitionIds) {
      for (const relation of api.visibleRelations(data,"exhibition",exhibitionId)) {
        const outgoing = relation.fromType==="exhibition" && relation.fromId===exhibitionId;
        const type=outgoing?relation.toType:relation.fromType, id=outgoing?relation.toId:relation.fromId;
        if (!["gallery","museum","artist"].includes(type)) continue;
        const record=verifiedRecord(type,id);
        if (record) result.push({type,record,relation,via:verifiedRecord("exhibition",exhibitionId)});
      }
    }
    return result;
  };
  const renderRelations = () => {
    const container=root.querySelector("#profile-relationships");container.replaceChildren();
    const direct=collectCuratorEdges(), indirect=collectIndirectExhibitionEdges(direct);
    const all=[...direct,...indirect];
    const groups=[
      ["exhibition",all.filter(x=>x.type==="exhibition")],
      ["gallery",all.filter(x=>x.type==="gallery")],
      ["museum",all.filter(x=>x.type==="museum")],
      ["artist",all.filter(x=>x.type==="artist")],
      ["project",all.filter(x=>x.type==="project")],
      ["publication",all.filter(x=>x.type==="publication")]
    ];
    for (const [type,items] of groups) {
      const section=node("section","network-group"), heading=node("h2","",labels[type][language()]);
      const list=node("div","network-card-list");section.append(heading,list);
      const unique=new Map();
      items.forEach(item=>{
        const key=item.type+":"+item.record.id;
        if(!unique.has(key)) unique.set(key,item);
        else if(item.via && !unique.get(key).via) unique.set(key,item);
      });
      if(!unique.size) section.append(node("p","network-empty",language()==="fa"?"مورد تأییدشده‌ای ثبت نشده است.":"No verified records are linked yet."));
      else unique.forEach(item=>{
        const note=localized(item.relation.role)||api.relationLabels[item.relation.relationType]?.[language()]||localized(item.record.summary);
        const via=item.via? (language()==="fa"?"از طریق نمایشگاه: ":"Via exhibition: ")+api.titleOf(item.via,language()):"";
        addCard(list,item.type,item.record,note,[via].filter(Boolean).join(""));
      });
      container.append(section);
    }
  };
  const renderList = (selector, values, emptyText) => {
    const container=root.querySelector(selector);if(!container)return;
    container.replaceChildren();
    const valid=Array.isArray(values)?values.filter(v=>localized(v.title||v.name||v.institution||v.degree||v.label)): [];
    if(!valid.length){container.append(node("p","network-empty",emptyText));return;}
    valid.forEach(item=>{
      const article=node("article","credential-item");
      article.append(node("h3","",localized(item.title||item.degree||item.name||item.label)));
      const detail=localized(item.institution||item.organization||item.description||item.role||item.field);
      if(detail)article.append(node("p","",detail));
      const period=[localized(item.startDate),localized(item.endDate)].filter(Boolean).join(" — ");
      if(period)article.append(node("span","credential-period",period));
      container.append(article);
    });
  };
  const render = () => {
    const lang=language(), name=api.titleOf(curator,lang);
    setText("[data-profile-name]",name);
    setText("[data-profile-biography]",localized(curator.biography));
    setText("[data-profile-approach]",localized(curator.approach));
    setText("[data-profile-location]",[localized(curator.city),localized(curator.country)].filter(Boolean).join(" · "));
    document.title=lang==="fa"?name+" | کیوریتورها":name+" | Curators";
    const imageWrap=root.querySelector("#profile-portrait");
    if(imageWrap){
      imageWrap.replaceChildren();
      const url=api.safeExternalLink(curator.portrait?.url);
      if(url){
        const img=node("img","");img.src=url;img.alt=localized(curator.portrait.alt)||name;img.loading="lazy";
        imageWrap.append(img);
        if(localized(curator.portrait.credit))imageWrap.append(node("small","portrait-credit",localized(curator.portrait.credit)));
      } else imageWrap.append(node("span","portrait-fallback","C—"));
    }
    renderList("#profile-roles",curator.roles,lang==="fa"?"سوابق حرفه‌ای تأییدشده‌ای ثبت نشده است.":"No verified professional roles recorded.");
    renderList("#profile-education",curator.education,lang==="fa"?"سوابق تحصیلی تأییدشده‌ای ثبت نشده است.":"No verified education records.");
    renderList("#profile-interests",(curator.researchInterests||curator.fields||[]).map(v=>typeof v==="string"?{label:{fa:v,en:v}}:(v.label? v : {label:v})),lang==="fa"?"حوزه پژوهشی ثبت نشده است.":"No research interests recorded.");
    const links=root.querySelector("#profile-links");links.replaceChildren();
    const external=[["website",lang==="fa"?"وب‌سایت":"Website",curator.website],["instagram","Instagram",curator.instagram],["orcid","ORCID",curator.orcid]];
    external.forEach(([key,label,value])=>{const url=api.safeExternalLink(value);if(url){const a=api.makeLink(url,label);a.target="_blank";a.rel="noopener noreferrer";links.append(a);}});
    renderRelations();
    const list=root.querySelector("#profile-sources");list.replaceChildren();
    const ids=new Set(curator.sourceIds||[]);
    api.visibleRelations(data,"curator",curator.id).forEach(r=>(r.sourceIds||[]).forEach(id=>ids.add(id)));
    [...ids].forEach(id=>{
      const source=data.sources.find(item=>item.id===id&&item.status==="published"&&api.safeExternalLink(item.url));if(!source)return;
      const item=node("li","");item.append(node("span","",localized(source.title)));
      item.append(" — ",api.makeLink(api.safeExternalLink(source.url),lang==="fa"?"مشاهده منبع":"View source"));list.append(item);
    });
  };
  const unavailable=()=>{
    setText("[data-profile-name]",language()==="fa"?"پروفایل در دسترس نیست":"Profile unavailable");
    setText("[data-profile-biography]",language()==="fa"?"این پروفایل وجود ندارد یا هنوز برای انتشار تأیید نشده است.":"This profile does not exist or has not been approved for publication.");
    root.querySelector("#profile-relationships")?.replaceChildren();
  };
  (async()=>{
    try{
      data=await api.load();const id=new URLSearchParams(location.search).get("id");
      curator=id?api.findRecord(data,"curator",id):null;
      if(!curator)return unavailable();
      render();document.addEventListener("casg:languagechange",render);
    }catch(error){unavailable();console.error(error);}
  })();
})();