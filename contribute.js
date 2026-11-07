(() => {
 const form=document.querySelector("#curator-intake"), status=document.querySelector("#intake-status");
 if(!form||!status)return;
 const val=(name)=>String(form.elements[name]?.value||"").trim();
 const setStatus=(fa,en)=>{status.textContent=document.documentElement.lang==="en"?en:fa;};
 const validHttps=(raw)=>{try{const u=new URL(raw);return u.protocol==="https:"?u.href:null;}catch(_){return null;}};
 form.addEventListener("submit",(event)=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const sourceUrl=validHttps(val("sourceUrl"));
  if(!sourceUrl){form.elements.sourceUrl.setCustomValidity("لطفاً نشانی معتبر با https وارد کنید.");form.elements.sourceUrl.reportValidity();form.elements.sourceUrl.setCustomValidity("");return;}
  const website=val("website")?validHttps(val("website")):null;
  if(val("website")&&!website){form.elements.website.setCustomValidity("لطفاً نشانی معتبر HTTPS وارد کنید.");form.elements.website.reportValidity();form.elements.website.setCustomValidity("");return;}
  const slug=(val("nameEn")||val("nameFa")).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"curator";
  const id=slug+"-"+Date.now().toString(36);
  const sourceId="source-"+id;
  const record={id,status:"draft",reviewStatus:"pending",reviewedAt:null,name:{fa:val("nameFa"),en:val("nameEn")},biography:{fa:val("bioFa"),en:val("bioEn")},approach:{fa:val("approachFa"),en:""},city:{fa:val("city"),en:val("city")},country:{fa:val("country"),en:val("country")},practiceTypes:[val("practice")],locationGroup:val("locationGroup"),website:website||"",publicEmail:val("email"),sourceIds:[sourceId],submittedAt:new Date().toISOString(),intakeDeclaration:true};
  const source={id:sourceId,status:"draft",title:{fa:val("sourceTitle"),en:val("sourceTitle")},url:sourceUrl,publisher:val("publisher"),note:val("sourceNote"),accessedAt:new Date().toISOString().slice(0,10)};
  const payload={format:"casg-curator-intake",schemaVersion:1,notice:"DRAFT ONLY. This file has not been submitted to or published by the website. Editorial verification and approval are required.",curators:[record],sources:[source],relationships:[]};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="casg-curator-draft-"+id+".json";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
  setStatus("پرونده پیش‌نویس دریافت شد. فایل را برای بررسی تحریریه نگه دارید؛ هنوز چیزی در سایت ثبت یا منتشر نشده است.","Draft downloaded. Keep the file for editorial review; nothing has been submitted or published.");
 });
})();