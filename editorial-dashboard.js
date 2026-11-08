(() => {
"use strict";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = { cases: [], activeId: null, lang: "fa", reviews: new Map() };
const text = (fa,en) => state.lang === "en" ? en : fa;
const safe = (value) => String(value ?? "");
const escapeHtml = (value) => safe(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function validate(payload) {
 const errors=[];
 const obj=v=>v && typeof v==="object" && !Array.isArray(v);
 const has=v=>typeof v==="string" && v.trim().length>0;
 const https=v=>{try{return new URL(v).protocol==="https:";}catch(_){return false;}};
 if(!obj(payload)) return ["ریشه JSON باید یک شیء باشد."];
 if(payload.format!=="casg-curator-intake") errors.push("قالب پرونده پشتیبانی نمی‌شود.");
 if(payload.schemaVersion!==1) errors.push("نسخه schema باید 1 باشد.");
 if(!Array.isArray(payload.curators)||payload.curators.length!==1) errors.push("باید دقیقاً یک پرونده کیوریتور وجود داشته باشد.");
 if(!Array.isArray(payload.sources)||payload.sources.length<1) errors.push("حداقل یک منبع لازم است.");
 if(!Array.isArray(payload.relationships)||payload.relationships.length!==0) errors.push("روابط تأییدنشده نباید در بسته ورودی باشند.");
 const c=Array.isArray(payload.curators)?payload.curators[0]:null, sources=Array.isArray(payload.sources)?payload.sources:[];
 if(!obj(c)) errors.push("اطلاعات کیوریتور معتبر نیست.");
 else {
  if(!has(c.id)) errors.push("شناسه کیوریتور خالی است.");
  if(c.status!=="draft"||c.reviewStatus!=="pending"||c.reviewedAt!==null) errors.push("وضعیت اولیه پرونده باید draft / pending / null باشد.");
  if(!obj(c.name)||!has(c.name.fa)||!has(c.name.en)) errors.push("نام فارسی و انگلیسی هر دو لازم‌اند.");
  if(!Array.isArray(c.sourceIds)||!c.sourceIds.length) errors.push("ارجاع به منبع وجود ندارد.");
  if(c.intakeDeclaration!==true) errors.push("اظهارنامه مشارکت‌کننده ثبت نشده است.");
  if(c.website&&!https(c.website)) errors.push("وب‌سایت باید HTTPS باشد.");
  if(c.publicEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.publicEmail)) errors.push("ایمیل عمومی معتبر نیست.");
 }
 const ids=new Set();
 for(const s of sources) {
  if(!obj(s)){errors.push("یکی از منابع ساختار معتبری ندارد.");continue;}
  if(!has(s.id)) errors.push("شناسه منبع خالی است.");
  if(ids.has(s.id)) errors.push("شناسه منبع تکراری است: "+s.id);
  ids.add(s.id);
  if(s.status!=="draft") errors.push("وضعیت منبع باید draft باشد.");
  if(!obj(s.title)||(!has(s.title.fa)&&!has(s.title.en))) errors.push("عنوان منبع خالی است.");
  if(!https(s.url)) errors.push("نشانی منبع باید HTTPS باشد.");
 }
 if(obj(c)&&Array.isArray(c.sourceIds)) {
  for(const id of c.sourceIds) if(!ids.has(id)) errors.push("منبع ارجاع‌شده پیدا نشد: "+id);
  for(const id of ids) if(!c.sourceIds.includes(id)) errors.push("منبع بدون ارجاع وجود دارد: "+id);
 }
 return errors;
}
function current(){return state.cases.find(x=>x.key===state.activeId);}
function reviewFor(key){if(!state.reviews.has(key)) state.reviews.set(key,{checks:{},notes:"",outcome:"in_review"});return state.reviews.get(key);}
function renderList(){
 $("#case-count").textContent=state.cases.length;
 $("#case-items").innerHTML=state.cases.map(c=>'<button class="case-item '+(c.key===state.activeId?'active':'')+'" data-key="'+escapeHtml(c.key)+'"><strong>'+escapeHtml(c.name)+'</strong><small>'+escapeHtml(c.fileName)+'</small><span class="mini-badge '+(c.errors.length?'invalid':'valid')+'">'+(c.errors.length?text("نیازمند اصلاح ساختاری","STRUCTURE ISSUES"):text("ساختار قابل قبول","STRUCTURE OK"))+'</span></button>').join("");
 $$("#case-items [data-key]").forEach(b=>b.addEventListener("click",()=>{state.activeId=b.dataset.key;renderList();renderDetail();}));
}
function field(label,value){return '<div class="field"><dt>'+escapeHtml(label)+'</dt><dd>'+escapeHtml(value||"—")+'</dd></div>';}
function renderDetail(){
 const c=current(); $("#empty-state").hidden=!!c; $("#detail-content").hidden=!c; if(!c)return;
 const p=c.payload.curators?.[0]||{},r=reviewFor(c.key);
 $("#person-name").textContent=(p.name?.fa||"")+(p.name?.en?" / "+p.name.en:"");
 $("#case-meta").textContent=c.fileName+" · "+(p.city?.fa||"")+" "+(p.country?.fa||"");
 const badge=$("#validation-badge");badge.className="badge "+(c.errors.length?"invalid":"valid");badge.textContent=c.errors.length?text("خطاهای ساختاری: "+c.errors.length,"STRUCTURE ISSUES: "+c.errors.length):text("ساختار قابل قبول","STRUCTURE VALID");
 $("#profile-fields").innerHTML=field("شهر / کشور",(p.city?.fa||"")+" / "+(p.country?.fa||""))+field("حوزه فعالیت",(p.practiceTypes||[]).join("، "))+field("وب‌سایت",p.website)+field("ایمیل عمومی",p.publicEmail)+field("زندگی‌نامه فارسی",p.biography?.fa)+field("Biography (English)",p.biography?.en);
 $("#source-list").innerHTML=(c.payload.sources||[]).map(s=>'<article class="source"><strong>'+escapeHtml(s.title?.fa||s.title?.en||"بدون عنوان")+'</strong><a href="'+escapeHtml(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(s.url)+'</a><small>'+escapeHtml(s.publisher||"")+'</small></article>').join("")||'<p>—</p>';
 if(c.errors.length) $("#source-list").insertAdjacentHTML("beforeend",'<ul class="errors">'+c.errors.map(e=>"<li>"+escapeHtml(e)+"</li>").join("")+"</ul>");
 $$("[data-check]").forEach(el=>el.checked=!!r.checks[el.dataset.check]);
 $("#editor-notes").value=r.notes;$("#review-outcome").value=r.outcome;$("#export-status").textContent="";
}
function saveReview(){
 const c=current();if(!c)return null;const r=reviewFor(c.key);
 $$("[data-check]").forEach(el=>r.checks[el.dataset.check]=el.checked);
 r.notes=$("#editor-notes").value;r.outcome=$("#review-outcome").value;
 return {format:"casg-editorial-review",schemaVersion:1,createdAt:new Date().toISOString(),sourceFile:c.fileName,structuralValidation:{valid:c.errors.length===0,errors:c.errors},intakePackage:c.payload,editorialReview:{checklist:r.checks,notes:r.notes,outcome:r.outcome,notice:"This is an internal review aid, not approval or publication authorization."}};
}
$("#file-input").addEventListener("change",async e=>{
 const files=[...e.target.files];let added=0;
 for(const file of files){try{const payload=JSON.parse(await file.text());const errors=validate(payload);const p=payload.curators?.[0]||{};const key=file.name+"-"+state.cases.length+"-"+Date.now();state.cases.push({key,fileName:file.name,payload,errors,name:p.name?.fa||p.name?.en||file.name});added++;}catch(err){state.cases.push({key:file.name+"-"+Date.now(),fileName:file.name,payload:{},errors:["خواندن فایل ناموفق بود: "+err.message],name:file.name});}}
 $("#workspace").hidden=!state.cases.length;$("#load-status").textContent=text(added+" پرونده خوانده شد. فایل‌ها فقط در حافظه همین صفحه هستند.","Read "+added+" file(s). Files remain only in this page's memory.");if(!state.activeId&&state.cases.length)state.activeId=state.cases[0].key;renderList();renderDetail();e.target.value="";
});
$("#export-review").addEventListener("click",()=>{
 const report=saveReview();if(!report)return;
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="casg-editorial-review-"+Date.now()+".json";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
 $("#export-status").textContent=text("گزارش بررسی دریافت شد؛ فایل اصلی تغییر نکرده است.","Review report downloaded; the original intake file was not changed.");
});
$("#language-toggle").addEventListener("click",()=>{
 state.lang=state.lang==="fa"?"en":"fa";document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==="fa"?"rtl":"ltr";
 $$("[data-fa][data-en]").forEach(el=>el.innerHTML=el.dataset[state.lang]);renderList();renderDetail();
});
["#editor-notes","#review-outcome"].forEach(sel=>$(sel).addEventListener("input",saveReview));
$$("[data-check]").forEach(el=>el.addEventListener("change",saveReview));
})();