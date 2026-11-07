(() => {
 const search=document.querySelector("#curator-search");
 const fields=document.querySelector("#curator-field");
 const locations=document.querySelector("#curator-location");
 const count=document.querySelector("#result-count");
 const grid=document.querySelector("#curator-grid");
 const update=()=>{
  const lang=document.documentElement.lang;
  const hasPublishedProfiles=grid.querySelector("[data-curator-profile]");
  if(!hasPublishedProfiles){count.textContent=lang==="fa"?"هنوز پروفایل تأییدشده‌ای برای نمایش منتشر نشده است.":"No verified curator profiles have been published yet.";return;}
  const q=search.value.trim().toLocaleLowerCase();
  let visible=0;
  grid.querySelectorAll("[data-curator-profile]").forEach(card=>{
   const text=(card.dataset.search||"").toLocaleLowerCase();
   const matchText=!q||text.includes(q);
   const matchField=fields.value==="all"||card.dataset.field===fields.value;
   const matchLocation=locations.value==="all"||card.dataset.location===locations.value;
   card.hidden=!(matchText&&matchField&&matchLocation);if(!card.hidden)visible++;
  });
  count.textContent=lang==="fa"?visible+" پروفایل":" "+visible+" profiles";
 };
 [search,fields,locations].forEach(el=>el.addEventListener("input",update));
 document.addEventListener("casg:languagechange",update);
 update();
})();