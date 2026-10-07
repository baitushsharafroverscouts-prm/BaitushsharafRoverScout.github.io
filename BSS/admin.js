/* ==========================================================================
   admin.js — Admin panel for Baitush Sharaf Rover Scout Group site
   Loads the current content (site-data.js), renders editable
   forms/tables for every section, and saves changes back to the same
   localStorage key the live site (index.html) reads from.
   "সাইটে প্রকাশ" button site-content.json banay — oita hosting e upload
   korle sob visitor notun content dekhe.
   ========================================================================== */

let content; // working copy in memory

const IMG_PLACEHOLDER = "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='42' height='42'><rect width='42' height='42' fill='#e2e7f0'/><text x='21' y='26' font-size='14' text-anchor='middle' fill='#6b7488' font-family='sans-serif'>IMG</text></svg>");

function renderAllForms() {
  renderHeaderForm();
  renderNavForm();
  renderEventPopupForm();
  renderMarqueeForm();
  renderNoticesTable();
  renderGalleryTable();
  renderGridBoxesForm();
  renderProfilesForm();
  renderCalendarForm();
  renderImportantLinksForm();
  renderMapForm();
  renderFooterForm();
  renderUnitForm();
  renderAchievementsForm();
  renderMembersForm();
  renderExecutiveCommitteeForm();
}

document.addEventListener("DOMContentLoaded", () => {
  content = loadSiteContent();
  renderAllForms();

  document.getElementById("saveAllBtn").addEventListener("click", saveAll);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("এই ব্রাউজারের সেভ করা সব পরিবর্তন মুছে ডিফল্ট/প্রকাশিত কনটেন্টে ফিরে যেতে চান?")) {
      resetSiteContent();
      content = loadSiteContent();
      renderAllForms();
      if (typeof refreshStats === "function") refreshStats();
      toast("ডিফল্ট কনটেন্টে ফিরিয়ে দেওয়া হয়েছে।");
    }
  });
});

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

function labeledInput(label, value, onInput, placeholder) {
  const group = document.createElement("div");
  group.className = "form-group";
  const lbl = document.createElement("label");
  lbl.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  if (placeholder) input.placeholder = placeholder;
  input.addEventListener("input", () => onInput(input.value));
  group.appendChild(lbl); group.appendChild(input);
  return group;
}

/* ---------- Reusable image-upload control (file picker + live preview) ----------
   opts:
     onChange(filename)          -> called on both manual typing and file pick
     dataAttr / dataAttrValue    -> sets this attribute on the text input, so
                                     existing collect*() functions (which read
                                     via querySelector('[data-...]')) keep working
     placeholder                 -> placeholder text for the filename box
*/
function imageUploadControl(filenameValue, previewId, opts = {}) {
  const fig = document.createElement("div");
  fig.className = "file-input-group";

  const img = document.createElement("img");
  img.className = "img-thumb";
  img.id = previewId;
  img.alt = "preview";
  img.onerror = function () { this.onerror = null; this.src = IMG_PLACEHOLDER; };
  img.src = filenameValue || IMG_PLACEHOLDER;

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = filenameValue || "";
  textInput.placeholder = opts.placeholder || "";
  if (opts.dataAttr) textInput.setAttribute(opts.dataAttr, opts.dataAttrValue);
  if (opts.onChange) textInput.addEventListener("input", () => opts.onChange(textInput.value));

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    textInput.value = file.name;
    if (opts.onChange) opts.onChange(file.name);
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    reader.readAsDataURL(file);
  });

  fig.appendChild(img); fig.appendChild(textInput); fig.appendChild(fileInput);
  return fig;
}
function imageUploadCell(filenameValue, previewId, opts) {
  const td = document.createElement("td");
  td.appendChild(imageUploadControl(filenameValue, previewId, opts));
  return td;
}
function imageUploadField(label, filenameValue, previewId, opts) {
  const group = document.createElement("div");
  group.className = "form-group";
  const lbl = document.createElement("label");
  lbl.textContent = label;
  group.appendChild(lbl);
  group.appendChild(imageUploadControl(filenameValue, previewId, opts));
  return group;
}

/* PDF upload control: file picker only fills in the filename (no preview). */
function pdfUploadCell(filenameValue, dataAttrValue) {
  const td = document.createElement("td");
  const fig = document.createElement("div");
  fig.className = "file-input-group";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "notice.pdf";
  textInput.value = filenameValue || "";
  textInput.setAttribute("data-notice-file", dataAttrValue);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf";
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) textInput.value = file.name;
  });

  fig.appendChild(textInput); fig.appendChild(fileInput);
  td.appendChild(fig);
  return td;
}

/* ---------- 0. Header: site title, logo, slider images ---------- */
function renderHeaderForm() {
  const wrap = document.getElementById("headerFormWrap");
  wrap.innerHTML = "";

  const row = document.createElement("div");
  row.className = "form-row";
  row.appendChild(labeledInput("সাইটের শিরোনাম (বাংলা)", content.header.titleBn, v => content.header.titleBn = v));
  row.appendChild(labeledInput("Site Title (English)", content.header.titleEn, v => content.header.titleEn = v));
  row.appendChild(imageUploadField("লোগো (ছবি আপলোড করুন)", content.header.logo, "header-logo-preview", {
    onChange: v => content.header.logo = v,
    placeholder: "logo.jpg"
  }));
  wrap.appendChild(row);

  const note = document.createElement("p");
  note.className = "card-note";
  note.textContent = "হেডার স্লাইডার ছবি (bp.1.jpg, bp.2.jpg ...):";
  wrap.appendChild(note);

  const table = document.createElement("table");
  table.innerHTML = `<thead><tr><th>ছবি নির্বাচন / আপলোড করুন</th><th>অ্যাকশন</th></tr></thead><tbody id="sliderImagesBody"></tbody>`;
  wrap.appendChild(table);
  const body = table.querySelector("#sliderImagesBody");
  content.header.sliderImages.forEach((img, i) => body.appendChild(sliderImageRow(img, i)));

  const addBtn = document.createElement("button");
  addBtn.type = "button"; addBtn.className = "btn btn-primary btn-sm";
  addBtn.style.marginTop = "8px";
  addBtn.innerHTML = '<i class="fas fa-plus"></i> স্লাইডার ছবি যোগ করুন';
  addBtn.addEventListener("click", () => { content.header.sliderImages.push(""); renderHeaderForm(); });
  wrap.appendChild(addBtn);
}
function sliderImageRow(img, i) {
  const tr = document.createElement("tr");
  tr.appendChild(imageUploadCell(img, `slider-preview-${i}`, {
    onChange: v => content.header.sliderImages[i] = v,
    placeholder: "bp.1.jpg"
  }));
  const tdBtn = document.createElement("td");
  tdBtn.className = "action-btns";
  const delBtn = document.createElement("button");
  delBtn.type = "button"; delBtn.className = "btn btn-danger";
  delBtn.innerHTML = '<i class="fas fa-trash"></i>';
  delBtn.addEventListener("click", () => { content.header.sliderImages.splice(i, 1); renderHeaderForm(); });
  tdBtn.appendChild(delBtn);
  tr.appendChild(tdBtn);
  return tr;
}
function collectHeader() { /* no-op: header is live-bound directly to `content.header` */ }

/* ---------- 1. Top navbar (full tree: dropdowns, has-submenu, mega menu) ---------- */
function renderNavForm() {
  const wrap = document.getElementById("navFormRows");
  wrap.innerHTML = "";
  content.nav.forEach(item => wrap.appendChild(buildNavTopItem(item)));
}
function collectNav() { /* no-op: nav is live-bound directly to `content.nav` */ }

function buildNavTopItem(item) {
  const box = document.createElement("div");
  box.className = "sub-block";

  const heading = document.createElement("h4");
  const typeLabel = { simple: "সরাসরি লিঙ্ক", dropdown: "ড্রপডাউন মেনু", mega: "মেগা মেনু" }[item.type] || item.type;
  heading.innerHTML = `${escHtml(item.bn)} <span style="font-weight:400;color:#888;">(${escHtml(typeLabel)})</span>`;
  box.appendChild(heading);

  const row = document.createElement("div");
  row.className = "form-row";
  row.appendChild(labeledInput("বাংলা নাম", item.bn, v => { item.bn = v; heading.firstChild.textContent = v + " "; }));
  row.appendChild(labeledInput("English Name", item.en, v => item.en = v));
  if (item.type === "simple") {
    row.appendChild(labeledInput("লিঙ্ক", item.link, v => item.link = v));
  }
  box.appendChild(row);

  if (item.type === "dropdown") {
    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = "সাব-মেনু আইটেম:";
    box.appendChild(note);
    if (!item.children) item.children = [];
    box.appendChild(buildNavChildList(item.children));
    const addBtn = document.createElement("button");
    addBtn.type = "button"; addBtn.className = "btn btn-primary btn-sm";
    addBtn.innerHTML = '<i class="fas fa-plus"></i> সাব-মেনু আইটেম যোগ করুন';
    addBtn.addEventListener("click", () => { item.children.push({ bn: "", en: "", link: "#" }); renderNavForm(); });
    box.appendChild(addBtn);
  }

  if (item.type === "mega") {
    if (!item.columns) item.columns = [];
    item.columns.forEach((col, ci) => box.appendChild(buildMegaColumnEditor(item, col, ci)));
    const addColBtn = document.createElement("button");
    addColBtn.type = "button"; addColBtn.className = "btn btn-primary btn-sm";
    addColBtn.innerHTML = '<i class="fas fa-plus"></i> নতুন কলাম যোগ করুন';
    addColBtn.style.marginTop = "8px";
    addColBtn.addEventListener("click", () => { item.columns.push({ titleBn: "", titleEn: "", items: [] }); renderNavForm(); });
    box.appendChild(addColBtn);
  }

  return box;
}

/* Recursive: a child item (dropdown entry) that may itself have its own
   nested children (the "has-submenu" case, e.g. মিডিয়া / ওয়েবসাইট). */
function buildNavChildList(list) {
  const container = document.createElement("div");
  container.style.marginLeft = "14px";
  container.style.borderLeft = "2px solid #e0e0e0";
  container.style.paddingLeft = "12px";
  container.style.marginBottom = "10px";

  list.forEach((child, idx) => {
    const row = document.createElement("div");
    row.style.marginBottom = "10px";
    row.style.paddingBottom = "10px";
    row.style.borderBottom = "1px dashed #e0e0e0";

    const fieldRow = document.createElement("div");
    fieldRow.className = "form-row";
    fieldRow.style.alignItems = "flex-end";
    fieldRow.appendChild(labeledInput("বাংলা", child.bn, v => child.bn = v));
    fieldRow.appendChild(labeledInput("English", child.en, v => child.en = v));
    // sub-menu wala item-er nijer link thake na
    if (!Array.isArray(child.children)) {
      fieldRow.appendChild(labeledInput("লিঙ্ক", child.link, v => child.link = v));
    }

    const btnGroup = document.createElement("div");
    btnGroup.style.display = "flex"; btnGroup.style.gap = "6px"; btnGroup.style.paddingBottom = "2px";

    if (!Array.isArray(child.children)) {
      const addSub = document.createElement("button");
      addSub.type = "button"; addSub.className = "btn btn-outline btn-sm";
      addSub.title = "এর নিচে আরেক লেভেল সাব-মেনু যোগ করুন";
      addSub.innerHTML = '<i class="fas fa-level-down-alt"></i>';
      addSub.addEventListener("click", () => { child.children = []; delete child.link; renderNavForm(); });
      btnGroup.appendChild(addSub);
    }
    const removeBtn = document.createElement("button");
    removeBtn.type = "button"; removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.addEventListener("click", () => { list.splice(idx, 1); renderNavForm(); });
    btnGroup.appendChild(removeBtn);

    const btnWrap = document.createElement("div");
    btnWrap.className = "form-group";
    btnWrap.style.flex = "0 0 auto";
    btnWrap.appendChild(document.createElement("label")).textContent = "\u00A0";
    btnWrap.appendChild(btnGroup);
    fieldRow.appendChild(btnWrap);

    row.appendChild(fieldRow);
    if (Array.isArray(child.children)) {
      row.appendChild(buildNavChildList(child.children));
      const addGrandBtn = document.createElement("button");
      addGrandBtn.type = "button"; addGrandBtn.className = "btn btn-primary btn-sm";
      addGrandBtn.innerHTML = '<i class="fas fa-plus"></i> এই সাব-মেনুতে আইটেম যোগ করুন';
      addGrandBtn.addEventListener("click", () => { child.children.push({ bn: "", en: "", link: "#" }); renderNavForm(); });
      row.appendChild(addGrandBtn);
    }
    container.appendChild(row);
  });

  return container;
}

function buildMegaColumnEditor(megaItem, col, ci) {
  const colBox = document.createElement("div");
  colBox.className = "sub-block";
  colBox.style.background = "#fff";

  const row = document.createElement("div");
  row.className = "form-row";
  row.appendChild(labeledInput("কলাম শিরোনাম (বাংলা)", col.titleBn, v => col.titleBn = v));
  row.appendChild(labeledInput("Column Title (English)", col.titleEn, v => col.titleEn = v));
  row.appendChild(labeledInput("সাব-হেডার (ঐচ্ছিক, বাংলা)", col.subHeaderBn, v => col.subHeaderBn = v, "যেমন: কোর্সসমূহ"));
  row.appendChild(labeledInput("Sub-header (optional, English)", col.subHeaderEn, v => col.subHeaderEn = v));
  colBox.appendChild(row);

  if (!col.items) col.items = [];
  colBox.appendChild(buildNavChildList(col.items));

  const btnRow = document.createElement("div");
  btnRow.style.display = "flex"; btnRow.style.gap = "8px";
  const addItemBtn = document.createElement("button");
  addItemBtn.type = "button"; addItemBtn.className = "btn btn-primary btn-sm";
  addItemBtn.innerHTML = '<i class="fas fa-plus"></i> আইটেম যোগ করুন';
  addItemBtn.addEventListener("click", () => { col.items.push({ bn: "", en: "", link: "#" }); renderNavForm(); });
  const removeColBtn = document.createElement("button");
  removeColBtn.type = "button"; removeColBtn.className = "btn btn-danger btn-sm";
  removeColBtn.innerHTML = '<i class="fas fa-trash"></i> কলাম মুছুন';
  removeColBtn.addEventListener("click", () => { megaItem.columns.splice(ci, 1); renderNavForm(); });
  btnRow.appendChild(addItemBtn); btnRow.appendChild(removeColBtn);
  colBox.appendChild(btnRow);

  return colBox;
}

/* ---------- 1.5 Event Popup & Event.html (on/off + content) ---------- */
function defaultEventPopup() {
  return defaultSiteContent().eventPopup;
}
function renderEventPopupForm() {
  if (!content.eventPopup) content.eventPopup = defaultEventPopup();
  const ep = content.eventPopup;
  if (!Array.isArray(ep.schedule) || ep.schedule.length !== 3) {
    ep.schedule = defaultEventPopup().schedule;
  }

  const toggle = document.getElementById("eventEnabledToggle");
  const badge = document.getElementById("eventStatusBadge");
  const sidebarBadge = document.getElementById("badge-event-status");

  function updateStatusUi() {
    const on = !!ep.enabled;
    badge.textContent = on ? "চালু" : "বন্ধ";
    badge.className = "et-status-badge " + (on ? "on" : "off");
    if (sidebarBadge) sidebarBadge.textContent = on ? "ON" : "OFF";
  }

  toggle.checked = !!ep.enabled;
  updateStatusUi();
  toggle.onchange = () => {
    ep.enabled = toggle.checked;
    updateStatusUi();
  };

  document.getElementById("evTitleBn").value = ep.titleBn || "";
  document.getElementById("evTitleEn").value = ep.titleEn || "";
  document.getElementById("evDateBn").value = ep.dateRangeBn || "";
  document.getElementById("evDateEn").value = ep.dateRangeEn || "";
  document.getElementById("evLocationBn").value = ep.locationBn || "";
  document.getElementById("evLocationEn").value = ep.locationEn || "";
  document.getElementById("evDeadlineBn").value = ep.regDeadlineBn || "";
  document.getElementById("evDeadlineEn").value = ep.regDeadlineEn || "";
  document.getElementById("evPopupExcerptBn").value = ep.popupExcerptBn || "";
  document.getElementById("evPopupExcerptEn").value = ep.popupExcerptEn || "";
  document.getElementById("evIntro1Bn").value = ep.introBn1 || "";
  document.getElementById("evIntro1En").value = ep.introEn1 || "";
  document.getElementById("evIntro2Bn").value = ep.introBn2 || "";
  document.getElementById("evIntro2En").value = ep.introEn2 || "";
  document.getElementById("evRegisterLink").value = ep.registerLinkUrl || "";
  document.getElementById("evContactLeaderName").value = ep.contactLeaderName || "";
  document.getElementById("evContactPhone").value = ep.contactPhone || "";
  document.getElementById("evContactEmail").value = ep.contactEmail || "";

  const schedBody = document.getElementById("evScheduleBody");
  schedBody.innerHTML = "";
  ep.schedule.forEach((day, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <input type="text" data-ev-day-bn="${i}" value="${escAttr(day.dayBn)}" placeholder="দিন ১" style="margin-bottom:6px;">
        <input type="text" data-ev-day-en="${i}" value="${escAttr(day.dayEn)}" placeholder="Day 1">
      </td>
      <td>
        <input type="text" data-ev-day-title-bn="${i}" value="${escAttr(day.titleBn)}" placeholder="শিরোনাম (বাংলা)" style="margin-bottom:6px;">
        <input type="text" data-ev-day-title-en="${i}" value="${escAttr(day.titleEn)}" placeholder="Title (English)">
      </td>
      <td>
        <textarea data-ev-day-desc-bn="${i}" placeholder="বিবরণ (বাংলা)" style="margin-bottom:6px;">${escHtml(day.descBn)}</textarea>
        <textarea data-ev-day-desc-en="${i}" placeholder="Description (English)">${escHtml(day.descEn)}</textarea>
      </td>
    `;
    schedBody.appendChild(tr);
  });
}
function collectEventPopup() {
  if (!content.eventPopup) content.eventPopup = defaultEventPopup();
  const ep = content.eventPopup;

  ep.enabled = !!document.getElementById("eventEnabledToggle").checked;
  ep.titleBn = document.getElementById("evTitleBn").value;
  ep.titleEn = document.getElementById("evTitleEn").value;
  ep.dateRangeBn = document.getElementById("evDateBn").value;
  ep.dateRangeEn = document.getElementById("evDateEn").value;
  ep.locationBn = document.getElementById("evLocationBn").value;
  ep.locationEn = document.getElementById("evLocationEn").value;
  ep.regDeadlineBn = document.getElementById("evDeadlineBn").value;
  ep.regDeadlineEn = document.getElementById("evDeadlineEn").value;
  ep.popupExcerptBn = document.getElementById("evPopupExcerptBn").value;
  ep.popupExcerptEn = document.getElementById("evPopupExcerptEn").value;
  ep.introBn1 = document.getElementById("evIntro1Bn").value;
  ep.introEn1 = document.getElementById("evIntro1En").value;
  ep.introBn2 = document.getElementById("evIntro2Bn").value;
  ep.introEn2 = document.getElementById("evIntro2En").value;
  ep.registerLinkUrl = document.getElementById("evRegisterLink").value;
  ep.contactLeaderName = document.getElementById("evContactLeaderName").value;
  ep.contactPhone = document.getElementById("evContactPhone").value;
  ep.contactEmail = document.getElementById("evContactEmail").value;

  const rows = document.querySelectorAll("#evScheduleBody tr");
  ep.schedule = Array.from(rows).map((tr, i) => ({
    dayBn: tr.querySelector(`[data-ev-day-bn="${i}"]`).value,
    dayEn: tr.querySelector(`[data-ev-day-en="${i}"]`).value,
    titleBn: tr.querySelector(`[data-ev-day-title-bn="${i}"]`).value,
    titleEn: tr.querySelector(`[data-ev-day-title-en="${i}"]`).value,
    descBn: tr.querySelector(`[data-ev-day-desc-bn="${i}"]`).value,
    descEn: tr.querySelector(`[data-ev-day-desc-en="${i}"]`).value
  }));
}

/* ---------- 2. Marquee ---------- */
function renderMarqueeForm() {
  document.getElementById("marqueeText").value = content.marquee;
}
function collectMarquee() {
  content.marquee = document.getElementById("marqueeText").value;
}

/* ---------- 3. PDF notices ---------- */
function renderNoticesTable() {
  const body = document.getElementById("noticesBody");
  body.innerHTML = "";
  content.pdfNotices.forEach((n, i) => body.appendChild(noticeRow(n, i)));
}
function noticeRow(n, i) {
  const tr = document.createElement("tr");
  const tdBn = document.createElement("td");
  tdBn.innerHTML = `<input type="text" data-notice-bn="${i}" value="${escAttr(n.titleBn)}" placeholder="নোটিশের শিরোনাম">`;
  const tdEn = document.createElement("td");
  tdEn.innerHTML = `<input type="text" data-notice-en="${i}" value="${escAttr(n.titleEn)}" placeholder="Notice Title">`;
  tr.appendChild(tdBn);
  tr.appendChild(tdEn);
  tr.appendChild(pdfUploadCell(n.file, i));
  const tdBtn = document.createElement("td");
  tdBtn.className = "action-btns";
  tdBtn.innerHTML = `<button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button>`;
  tr.appendChild(tdBtn);
  return tr;
}
function addNoticeRow() {
  document.getElementById("noticesBody").appendChild(noticeRow({ titleBn: "", titleEn: "", file: "" }, content.pdfNotices.length + Math.random()));
}
function collectNotices() {
  const rows = document.querySelectorAll("#noticesBody tr");
  content.pdfNotices = Array.from(rows).map(tr => ({
    titleBn: tr.querySelector('[data-notice-bn]').value,
    titleEn: tr.querySelector('[data-notice-en]').value,
    file: tr.querySelector('[data-notice-file]').value
  }));
}

/* ---------- 4. Gallery ---------- */
function renderGalleryTable() {
  const body = document.getElementById("galleryBody");
  body.innerHTML = "";
  content.gallery.forEach((g, i) => body.appendChild(galleryRow(g, i)));
}
function galleryRow(g, i) {
  const tr = document.createElement("tr");
  tr.appendChild(imageUploadCell(g.img, `gallery-preview-${i}`, {
    dataAttr: "data-g-img", dataAttrValue: i, placeholder: "gallery1.jpg"
  }));
  const tdBn = document.createElement("td");
  tdBn.innerHTML = `<input type="text" data-g-bn="${i}" value="${escAttr(g.captionBn)}" placeholder="ক্যাপশন (বাংলা)">`;
  const tdEn = document.createElement("td");
  tdEn.innerHTML = `<input type="text" data-g-en="${i}" value="${escAttr(g.captionEn)}" placeholder="Caption (English)">`;
  const tdBtn = document.createElement("td");
  tdBtn.className = "action-btns";
  tdBtn.innerHTML = `<button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button>`;
  tr.appendChild(tdBn);
  tr.appendChild(tdEn);
  tr.appendChild(tdBtn);
  return tr;
}
function addGalleryRow() {
  document.getElementById("galleryBody").appendChild(galleryRow({ img: "", captionBn: "", captionEn: "" }, content.gallery.length + Math.random()));
}
function collectGallery() {
  const rows = document.querySelectorAll("#galleryBody tr");
  content.gallery = Array.from(rows).map(tr => ({
    img: tr.querySelector('[data-g-img]').value,
    captionBn: tr.querySelector('[data-g-bn]').value,
    captionEn: tr.querySelector('[data-g-en]').value
  }));
}

/* ---------- 5. Grid boxes (2x2) ---------- */
function renderGridBoxesForm() {
  const wrap = document.getElementById("gridBoxesWrap");
  wrap.innerHTML = "";
  Object.entries(content.gridBoxes).forEach(([key, box]) => {
    const section = document.createElement("div");
    section.className = "sub-block";
    section.innerHTML = `
      <h4>${escHtml(box.titleBn)} <span style="font-weight:400;color:#888;">(${escHtml(box.titleEn)})</span></h4>
      <div class="form-row">
        <div class="form-group"><label>বক্স শিরোনাম (বাংলা)</label><input type="text" data-box="${key}-titleBn" value="${escAttr(box.titleBn)}"></div>
        <div class="form-group"><label>Box Title (English)</label><input type="text" data-box="${key}-titleEn" value="${escAttr(box.titleEn)}"></div>
        <div class="form-group"><label>আইকন (Font Awesome, যেমন fa-flag)</label><input type="text" data-box="${key}-icon" value="${escAttr(box.icon || "")}" placeholder="fa-star"></div>
      </div>
      <table>
        <thead><tr><th>বাংলা আইটেম</th><th>English Item</th><th>লিঙ্ক</th><th>অ্যাকশন</th></tr></thead>
        <tbody id="gridItems-${key}"></tbody>
      </table>
      <button type="button" class="btn btn-primary btn-sm" onclick="addGridItem('${key}')"><i class="fas fa-plus"></i> আইটেম যোগ করুন</button>
    `;
    wrap.appendChild(section);
    const tbody = section.querySelector(`#gridItems-${key}`);
    box.items.forEach((item, i) => tbody.appendChild(gridItemRow(key, item, i)));
  });
}
function gridItemRow(key, item, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-gi-bn="${key}-${i}" value="${escAttr(item.bn)}"></td>
    <td><input type="text" data-gi-en="${key}-${i}" value="${escAttr(item.en)}"></td>
    <td><input type="text" data-gi-link="${key}-${i}" value="${escAttr(item.link)}"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}
function addGridItem(key) {
  const tbody = document.getElementById(`gridItems-${key}`);
  tbody.appendChild(gridItemRow(key, { bn: "", en: "", link: "#" }, tbody.children.length + Math.random()));
}
function collectGridBoxes() {
  Object.keys(content.gridBoxes).forEach(key => {
    const box = content.gridBoxes[key];
    box.titleBn = val(`[data-box="${key}-titleBn"]`, box.titleBn);
    box.titleEn = val(`[data-box="${key}-titleEn"]`, box.titleEn);
    box.icon = (val(`[data-box="${key}-icon"]`, box.icon) || "").trim() || box.icon;
    const rows = document.querySelectorAll(`#gridItems-${key} tr`);
    box.items = Array.from(rows).map(tr => ({
      bn: tr.querySelector('[data-gi-bn]').value,
      en: tr.querySelector('[data-gi-en]').value,
      link: tr.querySelector('[data-gi-link]').value
    }));
  });
}

/* ---------- 6. Sidebar profiles ---------- */
function renderProfilesForm() {
  const wrap = document.getElementById("profilesWrap");
  wrap.innerHTML = "";
  Object.entries(content.profiles).forEach(([key, p]) => {
    const section = document.createElement("div");
    section.className = "sub-block";
    section.innerHTML = `
      <h4>${escHtml(p.titleBn)} <span style="font-weight:400;color:#888;">(${escHtml(p.titleEn)})</span></h4>
      <div class="form-row">
        <div class="form-group"><label>নাম (বাংলা)</label><input type="text" data-p="${key}-nameBn" value="${escAttr(p.nameBn)}"></div>
        <div class="form-group"><label>Name (English)</label><input type="text" data-p="${key}-nameEn" value="${escAttr(p.nameEn)}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>পদবি / বিবরণ (বাংলা)</label><input type="text" data-p="${key}-roleBn" value="${escAttr(p.roleBn)}"></div>
        <div class="form-group"><label>Role (English)</label><input type="text" data-p="${key}-roleEn" value="${escAttr(p.roleEn)}"></div>
      </div>
      <div class="form-row">
        <div class="form-group" id="photoSlot-${key}"></div>
        <div class="form-group"><label>মোবাইল</label><input type="text" data-p="${key}-mobile" value="${escAttr(p.mobile)}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>ইমেইল</label><input type="email" data-p="${key}-email" value="${escAttr(p.email)}"></div>
        <div class="form-group"><label>রক্তের গ্রুপ</label><input type="text" data-p="${key}-blood" value="${escAttr(p.blood)}"></div>
        <div class="form-group"><label>বিএসআইডি</label><input type="text" data-p="${key}-bsid" value="${escAttr(p.bsid)}"></div>
      </div>
    `;
    wrap.appendChild(section);

    const photoSlot = section.querySelector(`#photoSlot-${key}`);
    const photoField = imageUploadField("ছবি (আপলোড করুন)", p.photo, `profile-preview-${key}`, {
      dataAttr: "data-p", dataAttrValue: `${key}-photo`, placeholder: "photo.jpg"
    });
    photoSlot.replaceWith(photoField);
  });
}
function collectProfiles() {
  Object.keys(content.profiles).forEach(key => {
    const p = content.profiles[key];
    ["nameBn","nameEn","roleBn","roleEn","photo","mobile","email","blood","bsid"].forEach(f => {
      p[f] = val(`[data-p="${key}-${f}"]`, p[f]);
    });
  });
}

/* ---------- 7. Calendar ---------- */
function renderCalendarForm() {
  document.getElementById("calMonthYearInput").value = content.calendar.monthYear;
  const body = document.getElementById("calEventsBody");
  body.innerHTML = "";
  content.calendar.events.forEach((ev, i) => body.appendChild(calRow(ev, i)));
}
function calRow(ev, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-cal-date="${i}" value="${escAttr(ev.date)}" placeholder="১০ সেপ:"></td>
    <td><input type="text" data-cal-text="${i}" value="${escAttr(ev.text)}"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}
function addCalRow() {
  document.getElementById("calEventsBody").appendChild(calRow({ date: "", text: "" }, content.calendar.events.length + Math.random()));
}
function collectCalendar() {
  content.calendar.monthYear = document.getElementById("calMonthYearInput").value;
  const rows = document.querySelectorAll("#calEventsBody tr");
  content.calendar.events = Array.from(rows).map(tr => ({
    date: tr.querySelector('[data-cal-date]').value,
    text: tr.querySelector('[data-cal-text]').value
  }));
}

/* ---------- 7.5 গুরুত্বপূর্ণ লিংক (Event-I কার্ড) ---------- */
function renderImportantLinksForm() {
  if (!content.importantLinks) content.importantLinks = defaultSiteContent().importantLinks;
  const d = content.importantLinks;
  document.getElementById("impTitleBn").value = d.titleBn || "";
  document.getElementById("impTitleEn").value = d.titleEn || "";
  document.getElementById("impHeaderBn").value = d.headerBn || "";
  document.getElementById("impHeaderEn").value = d.headerEn || "";
  const body = document.getElementById("importantLinksBody");
  body.innerHTML = "";
  (d.items || []).forEach(it => body.appendChild(importantLinkRow(it)));
  updateImportantBadge();
}
function importantLinkRow(it) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-il-bn value="${escAttr(it.bn)}" placeholder="বাংলা নাম"></td>
    <td><input type="text" data-il-en value="${escAttr(it.en)}" placeholder="English name"></td>
    <td><input type="text" data-il-link value="${escAttr(it.link)}" placeholder="https://..."></td>
    <td class="action-btns" style="white-space:nowrap;">
      <button type="button" class="btn btn-outline btn-sm" data-il-up aria-label="উপরে সরান"><i class="fas fa-arrow-up"></i></button>
      <button type="button" class="btn btn-outline btn-sm" data-il-down aria-label="নিচে সরান"><i class="fas fa-arrow-down"></i></button>
      <button type="button" class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); updateImportantBadge();"><i class="fas fa-trash"></i></button>
    </td>`;
  tr.querySelector("[data-il-up]").addEventListener("click", () => {
    if (tr.previousElementSibling) tr.parentNode.insertBefore(tr, tr.previousElementSibling);
  });
  tr.querySelector("[data-il-down]").addEventListener("click", () => {
    if (tr.nextElementSibling) tr.parentNode.insertBefore(tr.nextElementSibling, tr);
  });
  return tr;
}
function addImportantLinkRow() {
  document.getElementById("importantLinksBody").appendChild(importantLinkRow({ bn: "", en: "", link: "https://" }));
  updateImportantBadge();
}
function updateImportantBadge() {
  const el = document.getElementById("badge-important");
  if (el) el.textContent = document.querySelectorAll("#importantLinksBody tr").length;
}
function collectImportantLinks() {
  if (!content.importantLinks) content.importantLinks = defaultSiteContent().importantLinks;
  const d = content.importantLinks;
  d.titleBn = document.getElementById("impTitleBn").value;
  d.titleEn = document.getElementById("impTitleEn").value;
  d.headerBn = document.getElementById("impHeaderBn").value;
  d.headerEn = document.getElementById("impHeaderEn").value;
  d.items = Array.from(document.querySelectorAll("#importantLinksBody tr")).map(tr => ({
    bn: tr.querySelector("[data-il-bn]").value.trim(),
    en: tr.querySelector("[data-il-en]").value.trim(),
    link: tr.querySelector("[data-il-link]").value.trim()
  })).filter(x => x.bn || x.en);   // দুই নামই ফাঁকা হলে সারি বাদ
}

/* ---------- 8. Address & Map ---------- */
function renderMapForm() {
  document.getElementById("addressInput").value = content.address;
  document.getElementById("mapEmbedInput").value = content.mapEmbedUrl;
}
function collectMap() {
  content.address = document.getElementById("addressInput").value;
  content.mapEmbedUrl = document.getElementById("mapEmbedInput").value;
}

/* ---------- 9. Footer / social links / quick links / copyright ---------- */
function renderFooterForm() {
  document.getElementById("footerAddressInput").value = content.footer.addressBn;
  document.getElementById("footerTaglineInput").value = content.footer.tagline;
  document.getElementById("footerTaglineEnInput").value = content.footer.taglineEn || "";
  document.getElementById("footerEmailInput").value = content.footer.email;
  document.getElementById("footerPhoneInput").value = content.footer.phone;
  document.getElementById("footerCopyrightInput").value = content.footer.copyrightText;

  // Quick links table
  const qlBody = document.getElementById("quickLinksBody");
  qlBody.innerHTML = "";
  content.footer.quickLinks.forEach((ql, i) => qlBody.appendChild(quickLinkRow(ql, i)));

  // Social links
  const socialWrap = document.getElementById("socialLinksWrap");
  socialWrap.innerHTML = "";
  if (!content.footer.social) content.footer.social = {};
  const socialLabels = {
    facebook: "Facebook", instagram: "Instagram", whatsapp: "WhatsApp",
    linkedin: "LinkedIn", youtube: "YouTube", twitter: "Twitter / X"
  };
  Object.keys(socialLabels).forEach(key => {
    socialWrap.appendChild(labeledInput(socialLabels[key] + " লিঙ্ক", content.footer.social[key],
      v => content.footer.social[key] = v, "https://..."));
  });
}
function quickLinkRow(ql, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-ql-bn="${i}" value="${escAttr(ql.bn)}"></td>
    <td><input type="text" data-ql-en="${i}" value="${escAttr(ql.en)}"></td>
    <td><input type="text" data-ql-link="${i}" value="${escAttr(ql.link)}"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}
function addQuickLinkRow() {
  document.getElementById("quickLinksBody").appendChild(
    quickLinkRow({ bn: "", en: "", link: "#" }, content.footer.quickLinks.length + Math.random())
  );
}
function collectFooter() {
  content.footer.addressBn = document.getElementById("footerAddressInput").value;
  content.footer.tagline = document.getElementById("footerTaglineInput").value;
  content.footer.taglineEn = document.getElementById("footerTaglineEnInput").value;
  content.footer.email = document.getElementById("footerEmailInput").value;
  content.footer.phone = document.getElementById("footerPhoneInput").value;
  content.footer.copyrightText = document.getElementById("footerCopyrightInput").value;

  const rows = document.querySelectorAll("#quickLinksBody tr");
  content.footer.quickLinks = Array.from(rows).map(tr => ({
    bn: tr.querySelector('[data-ql-bn]').value,
    en: tr.querySelector('[data-ql-en]').value,
    link: tr.querySelector('[data-ql-link]').value
  }));
  // content.footer.social is already live-bound via labeledInput above
}

/* ---------- 10. Unit page (unit.html): registry cards + events log ---------- */
function renderUnitForm() {
  if (!content.unit) content.unit = defaultSiteContent().unit;
  const u = content.unit;
  if (!u.nationalRegistry) u.nationalRegistry = { regNo: "", org: "", groupName: "", status: "" };
  if (!u.districtRegistry) u.districtRegistry = { regNo: "", districtRover: "", region: "", location: "" };
  if (!Array.isArray(u.events)) u.events = [];

  document.getElementById("unitHeaderTitleInput").value = u.headerTitleBn || "";

  document.getElementById("unitNatRegNo").value = u.nationalRegistry.regNo || "";
  document.getElementById("unitNatOrg").value = u.nationalRegistry.org || "";
  document.getElementById("unitNatGroupName").value = u.nationalRegistry.groupName || "";
  document.getElementById("unitNatStatus").value = u.nationalRegistry.status || "";

  document.getElementById("unitDistRegNo").value = u.districtRegistry.regNo || "";
  document.getElementById("unitDistRover").value = u.districtRegistry.districtRover || "";
  document.getElementById("unitDistRegion").value = u.districtRegistry.region || "";
  document.getElementById("unitDistLocation").value = u.districtRegistry.location || "";

  const body = document.getElementById("unitEventsBody");
  body.innerHTML = "";
  u.events.forEach((ev, i) => body.appendChild(unitEventRow(ev, i)));
}
function unitEventRow(ev, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-ue-desc="${i}" value="${escAttr(ev.desc)}" placeholder="ইভেন্টের বিবরণ"></td>
    <td><input type="text" data-ue-date="${i}" value="${escAttr(ev.date)}" placeholder="তারিখ / সাল"></td>
    <td><input type="text" data-ue-place="${i}" value="${escAttr(ev.place)}" placeholder="স্থান / আয়োজক"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}
function addUnitEventRow() {
  document.getElementById("unitEventsBody").appendChild(
    unitEventRow({ desc: "", date: "", place: "" }, content.unit.events.length + Math.random())
  );
}
function collectUnit() {
  const u = content.unit;
  u.headerTitleBn = document.getElementById("unitHeaderTitleInput").value;

  u.nationalRegistry.regNo = document.getElementById("unitNatRegNo").value;
  u.nationalRegistry.org = document.getElementById("unitNatOrg").value;
  u.nationalRegistry.groupName = document.getElementById("unitNatGroupName").value;
  u.nationalRegistry.status = document.getElementById("unitNatStatus").value;

  u.districtRegistry.regNo = document.getElementById("unitDistRegNo").value;
  u.districtRegistry.districtRover = document.getElementById("unitDistRover").value;
  u.districtRegistry.region = document.getElementById("unitDistRegion").value;
  u.districtRegistry.location = document.getElementById("unitDistLocation").value;

  const rows = document.querySelectorAll("#unitEventsBody tr");
  u.events = Array.from(rows).map(tr => ({
    desc: tr.querySelector('[data-ue-desc]').value,
    date: tr.querySelector('[data-ue-date]').value,
    place: tr.querySelector('[data-ue-place]').value
  }));
}

/* ---------- 11. Achievements page (amader_orjon.html) ---------- */
function renderAchievementsForm() {
  if (!content.achievements) content.achievements = defaultSiteContent().achievements;
  const a = content.achievements;
  if (!Array.isArray(a.items)) a.items = [];

  document.getElementById("achHeadingInput").value = a.pageHeadingBn || "";
  document.getElementById("achSubInput").value = a.pageSubBn || "";
  document.getElementById("achSectionTitleInput").value = a.sectionTitleBn || "";
  document.getElementById("achSectionIntroInput").value = a.sectionIntroBn || "";

  const body = document.getElementById("achievementsBody");
  body.innerHTML = "";
  a.items.forEach((item, i) => body.appendChild(achievementRow(item, i)));
}
function achievementRow(item, i) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" data-ach-year="${i}" value="${escAttr(item.year)}" placeholder="২০২৬"></td>
    <td><input type="text" data-ach-title="${i}" value="${escAttr(item.title)}" placeholder="অর্জনের শিরোনাম"></td>
    <td><input type="text" data-ach-level="${i}" value="${escAttr(item.level)}" placeholder="জাতীয় / জেলা / আঞ্চলিক পর্যায়"></td>
    <td><input type="text" data-ach-details="${i}" value="${escAttr(item.details)}" placeholder="বিস্তারিত বিবরণ"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}
function addAchievementRow() {
  document.getElementById("achievementsBody").appendChild(
    achievementRow({ year: "", title: "", level: "", details: "" }, content.achievements.items.length + Math.random())
  );
}
function collectAchievements() {
  const a = content.achievements;
  a.pageHeadingBn = document.getElementById("achHeadingInput").value;
  a.pageSubBn = document.getElementById("achSubInput").value;
  a.sectionTitleBn = document.getElementById("achSectionTitleInput").value;
  a.sectionIntroBn = document.getElementById("achSectionIntroInput").value;

  const rows = document.querySelectorAll("#achievementsBody tr");
  a.items = Array.from(rows).map(tr => ({
    year: tr.querySelector('[data-ach-year]').value,
    title: tr.querySelector('[data-ach-title]').value,
    level: tr.querySelector('[data-ach-level]').value,
    details: tr.querySelector('[data-ach-details]').value
  }));
}

/* ---------- 12. Members page (সদস্য প্রোফাইল) ---------- */
const MEMBER_GROUPS = [
  { key: "srm",   title: "সিনিয়র রোভার মেট (SRM)" },
  { key: "asrm",  title: "সহকারী সিনিয়র রোভার মেট (ASRM)" },
  { key: "rm",    title: "রোভার মেট (RM)" },
  { key: "rover", title: "সাধারণ রোভার সদস্য" }
];

function toBnNum(n) {
  return String(n).padStart(2, "0").replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

function renderMembersForm() {
  if (!content.members) content.members = defaultSiteContent().members;
  const m = content.members;
  document.getElementById("memHeadingInput").value = m.pageHeadingBn || "";
  document.getElementById("memSubInput").value = m.pageSubBn || "";
  document.getElementById("memGroupInput").value = m.groupNameBn || "";

  const wrap = document.getElementById("membersWrap");
  wrap.innerHTML = "";

  MEMBER_GROUPS.forEach(g => {
    if (!Array.isArray(m[g.key])) m[g.key] = [];

    const block = document.createElement("div");
    block.className = "sub-block";
    block.innerHTML = `
      <h4 style="margin:0 0 10px;color:var(--primary-dark);"><i class="fas fa-user-check"></i> ${escHtml(g.title)}</h4>
      <table>
        <thead>
          <tr>
            <th style="width:7%;">ক্রমিক</th>
            <th style="width:24%;">নাম</th>
            <th style="width:14%;">শ্রেণী</th>
            <th style="width:10%;">রোল</th>
            <th style="width:18%;">মোবাইল</th>
            <th style="width:19%;">ভর্তির তারিখ</th>
            <th style="width:8%;">অ্যাকশন</th>
          </tr>
        </thead>
        <tbody id="memBody-${g.key}"></tbody>
      </table>
      <button type="button" class="btn btn-primary btn-sm" onclick="addMemberRow('${g.key}')"><i class="fas fa-plus"></i> নতুন সদস্য যোগ করুন</button>
    `;
    wrap.appendChild(block);

    const tbody = block.querySelector(`#memBody-${g.key}`);
    m[g.key].forEach(mem => tbody.appendChild(memberRow(mem)));
    renumberMembers(tbody);
  });
}

function memberRow(mem) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="mem-sl" style="text-align:center;font-weight:600;"></td>
    <td><input type="text" data-f="name" value="${escAttr(mem.name)}" placeholder="নাম"></td>
    <td><input type="text" data-f="cls" value="${escAttr(mem.cls)}" placeholder="শ্রেণী"></td>
    <td><input type="text" data-f="roll" value="${escAttr(mem.roll)}" placeholder="রোল"></td>
    <td><input type="text" data-f="mobile" value="${escAttr(mem.mobile)}" placeholder="মোবাইল"></td>
    <td><input type="text" data-f="date" value="${escAttr(mem.date)}" placeholder="01-09-2025"></td>
    <td class="action-btns"><button type="button" class="btn btn-danger" onclick="removeMemberRow(this)"><i class="fas fa-trash"></i></button></td>
  `;
  return tr;
}

function renumberMembers(tbody) {
  tbody.querySelectorAll(".mem-sl").forEach((td, i) => td.textContent = toBnNum(i + 1));
}

function addMemberRow(key) {
  const tbody = document.getElementById(`memBody-${key}`);
  tbody.appendChild(memberRow({ name: "", cls: "-", roll: "-", mobile: "-", date: "-" }));
  renumberMembers(tbody);
}

function removeMemberRow(btn) {
  const tbody = btn.closest("tbody");
  btn.closest("tr").remove();
  renumberMembers(tbody);
}

function collectMembers() {
  const m = content.members;
  m.pageHeadingBn = document.getElementById("memHeadingInput").value;
  m.pageSubBn = document.getElementById("memSubInput").value;
  m.groupNameBn = document.getElementById("memGroupInput").value;

  MEMBER_GROUPS.forEach(g => {
    const rows = document.querySelectorAll(`#memBody-${g.key} tr`);
    m[g.key] = Array.from(rows).map(tr => {
      const get = f => tr.querySelector(`[data-f="${f}"]`).value.trim();
      return { name: get("name"), cls: get("cls"), roll: get("roll"), mobile: get("mobile"), date: get("date") };
    }).filter(x => x.name); // নাম ফাঁকা থাকলে সেই সারি বাদ যাবে
  });
}

/* ---------- 13. Executive Committee (crew-council.html) ---------- */
function defaultExecMember(avatar) {
  return { avatar: avatar || "", photo: "", name: "", roleBn: "", roleEn: "", bsid: "", joinDate: "" };
}
function renderExecutiveCommitteeForm() {
  if (!content.executiveCommittee) content.executiveCommittee = defaultSiteContent().executiveCommittee;
  const ec = content.executiveCommittee;
  if (!ec.rover) ec.rover = { salamBn: "", salamEn: "", orgNameBn: "", orgNameEn: "", councilNameBn: "", councilNameEn: "", members: [] };
  if (!Array.isArray(ec.crewCouncil)) ec.crewCouncil = [];
  if (!Array.isArray(ec.rover.members)) ec.rover.members = [];

  document.getElementById("execRoverSalamBn").value = ec.rover.salamBn || "";
  document.getElementById("execRoverSalamEn").value = ec.rover.salamEn || "";
  document.getElementById("execRoverOrgBn").value = ec.rover.orgNameBn || "";
  document.getElementById("execRoverOrgEn").value = ec.rover.orgNameEn || "";
  document.getElementById("execRoverCouncilBn").value = ec.rover.councilNameBn || "";
  document.getElementById("execRoverCouncilEn").value = ec.rover.councilNameEn || "";

  renderExecTable("execCrewBody", ec.crewCouncil, "exec-crew");
  renderExecTable("execRoverBody", ec.rover.members, "exec-rover");
}
function execMemberRow(m, previewPrefix, rowIndex) {
  const tr = document.createElement("tr");
  const previewId = `${previewPrefix || "exec"}-photo-${rowIndex ?? Math.random().toString(36).slice(2)}`;

  const tdPhoto = imageUploadCell(m.photo, previewId, {
    dataAttr: "data-em-photo", dataAttrValue: "1", placeholder: "photo.jpg"
  });

  const tdAvatar = document.createElement("td");
  tdAvatar.innerHTML = `<input type="text" data-em-avatar value="${escAttr(m.avatar)}" placeholder="RM" style="max-width:70px;">`;
  const tdName = document.createElement("td");
  tdName.innerHTML = `<input type="text" data-em-name value="${escAttr(m.name)}" placeholder="নাম">`;
  const tdRoleBn = document.createElement("td");
  tdRoleBn.innerHTML = `<input type="text" data-em-rolebn value="${escAttr(m.roleBn)}" placeholder="পদবি (বাংলা)">`;
  const tdRoleEn = document.createElement("td");
  tdRoleEn.innerHTML = `<input type="text" data-em-roleen value="${escAttr(m.roleEn)}" placeholder="Role (English)">`;
  const tdBsid = document.createElement("td");
  tdBsid.innerHTML = `<input type="text" data-em-bsid value="${escAttr(m.bsid)}" placeholder="BSID">`;
  const tdJoin = document.createElement("td");
  tdJoin.innerHTML = `<input type="text" data-em-join value="${escAttr(m.joinDate)}" placeholder="যোগদানের তারিখ">`;
  const tdBtn = document.createElement("td");
  tdBtn.className = "action-btns";
  tdBtn.innerHTML = `<button type="button" class="btn btn-danger" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button>`;

  tr.appendChild(tdPhoto);
  tr.appendChild(tdAvatar);
  tr.appendChild(tdName);
  tr.appendChild(tdRoleBn);
  tr.appendChild(tdRoleEn);
  tr.appendChild(tdBsid);
  tr.appendChild(tdJoin);
  tr.appendChild(tdBtn);
  return tr;
}
function renderExecTable(tbodyId, list, previewPrefix) {
  const body = document.getElementById(tbodyId);
  body.innerHTML = "";
  list.forEach((m, i) => body.appendChild(execMemberRow(m, previewPrefix, i)));
}
function addExecRow(tbodyId) {
  const previewPrefix = tbodyId === "execCrewBody" ? "exec-crew" : "exec-rover";
  document.getElementById(tbodyId).appendChild(execMemberRow(defaultExecMember(""), previewPrefix, Date.now()));
}
function collectExecTable(tbodyId) {
  const rows = document.querySelectorAll(`#${tbodyId} tr`);
  return Array.from(rows).map(tr => ({
    photo: tr.querySelector('[data-em-photo]').value,
    avatar: tr.querySelector('[data-em-avatar]').value,
    name: tr.querySelector('[data-em-name]').value,
    roleBn: tr.querySelector('[data-em-rolebn]').value,
    roleEn: tr.querySelector('[data-em-roleen]').value,
    bsid: tr.querySelector('[data-em-bsid]').value,
    joinDate: tr.querySelector('[data-em-join]').value
  })).filter(x => x.name);
}
function collectExecutiveCommittee() {
  const ec = content.executiveCommittee;
  ec.rover.salamBn = document.getElementById("execRoverSalamBn").value;
  ec.rover.salamEn = document.getElementById("execRoverSalamEn").value;
  ec.rover.orgNameBn = document.getElementById("execRoverOrgBn").value;
  ec.rover.orgNameEn = document.getElementById("execRoverOrgEn").value;
  ec.rover.councilNameBn = document.getElementById("execRoverCouncilBn").value;
  ec.rover.councilNameEn = document.getElementById("execRoverCouncilEn").value;
  ec.crewCouncil = collectExecTable("execCrewBody");
  ec.rover.members = collectExecTable("execRoverBody");
}

/* Sob section theke data content-e tule ana */
function collectAllSections() {
  collectHeader();
  collectNav();
  collectEventPopup();
  collectMarquee();
  collectNotices();
  collectGallery();
  collectGridBoxes();
  collectProfiles();
  collectCalendar();
  collectImportantLinks();
  collectMap();
  collectFooter();
  collectUnit();
  collectAchievements();
  collectMembers();
  collectExecutiveCommittee();
}

function saveAll() {
  collectAllSections();
  saveSiteContent(content);
  toast("✓ সব পরিবর্তন সংরক্ষণ করা হয়েছে (শুধু এই ব্রাউজারে)। সবাইকে দেখাতে \"সাইটে প্রকাশ\" চাপুন।");
}

/* ---------- Helpers ---------- */
function val(selector, fallback) {
  const el = document.querySelector(selector);
  return el ? el.value : fallback;
}
function escHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function escAttr(str) { return escHtml(str); }

/* ==========================================================================
   Extras: unsaved warning, Ctrl+S, backup/restore, PUBLISH, live counters,
   achievement row move buttons
   ========================================================================== */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const saveBtn = $("saveAllBtn");
  const main = document.querySelector("main");

  /* ---------- স্টাইল ---------- */
  const st = document.createElement("style");
  st.textContent = `
    #saveAllBtn.dirty { box-shadow: 0 0 0 3px rgba(192,57,43,.35), 0 4px 12px rgba(201,162,39,.3); }
    #saveAllBtn.dirty::after { content: "●"; color: var(--danger); font-size: 11px; }
    .top-actions { flex-wrap: wrap; }
  `;
  document.head.appendChild(st);

  /* ---------- ১. সংরক্ষণ হয়নি — সতর্কতা ---------- */
  let dirty = false;
  const baseTitle = document.title;
  function setDirty(v) {
    dirty = v;
    saveBtn.classList.toggle("dirty", v);
    document.title = (v ? "● " : "") + baseTitle;
  }
  ["input", "change"].forEach(ev => main.addEventListener(ev, () => setDirty(true)));
  main.addEventListener("click", e => {
    if (e.target.closest(".btn-danger, .btn-primary")) setDirty(true);
  });
  saveBtn.addEventListener("click", () => setDirty(false));
  window.addEventListener("beforeunload", e => {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  /* Ctrl+S / Cmd+S = সব সংরক্ষণ */
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveBtn.click();
    }
  });

  function renderAll() {
    renderAllForms();
    if (typeof refreshStats === "function") refreshStats();
  }

  function makeBtn(icon, label, cls) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + cls;
    b.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
    return b;
  }

  function downloadJson(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  const actions = document.querySelector(".top-actions");
  const publishBtn = makeBtn("fa-cloud-upload-alt", "সাইটে প্রকাশ", "btn-outline");
  publishBtn.title = "site-content.json বানায় — এটা index.html এর ফোল্ডারে আপলোড করলে সবাই দেখবে";
  const exportBtn = makeBtn("fa-download", "ব্যাকআপ নিন", "btn-outline");
  const importBtn = makeBtn("fa-upload", "ব্যাকআপ ফিরিয়ে আনুন", "btn-outline");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.style.display = "none";
  actions.prepend(importBtn);
  actions.prepend(exportBtn);
  actions.prepend(publishBtn);
  actions.appendChild(fileInput);

  /* ---------- ২. সাইটে প্রকাশ: site-content.json ডাউনলোড ----------
     এই ফাইল hosting-এ index.html এর পাশে (একই ফোল্ডারে) আপলোড করলে
     সব visitor নতুন কনটেন্ট দেখবে। (site-data.js এটা নিজে পড়ে নেয়।) */
  publishBtn.addEventListener("click", () => {
    collectAllSections();
    saveSiteContent(content);
    setDirty(false);
    downloadJson("site-content.json", content);
    toast("site-content.json ডাউনলোড হয়েছে। এটি index.html এর ফোল্ডারে আপলোড করুন।");
  });

  /* ---------- ৩. ব্যাকআপ নিন / ফিরিয়ে আনুন (JSON) ---------- */
  exportBtn.addEventListener("click", () => {
    collectAllSections();
    downloadJson("bsrsg-backup-" + new Date().toISOString().slice(0, 10) + ".json", content);
    toast("ব্যাকআপ ফাইল ডাউনলোড হয়েছে।");
  });

  importBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const need = ["header", "nav", "marquee", "pdfNotices", "gallery", "gridBoxes", "profiles", "calendar", "footer"];
        if (!data || need.some(k => !(k in data))) throw new Error("bad");
        if (!confirm("বর্তমান সব কনটেন্ট এই ব্যাকআপ দিয়ে বদলে যাবে। চালিয়ে যাবেন?")) return;
        content = mergeContent(defaultSiteContent(), data);
        saveSiteContent(content);
        renderAll();
        setDirty(false);
        toast("✓ ব্যাকআপ ফিরিয়ে আনা হয়েছে।");
      } catch (e) {
        toast("ফাইলটি সঠিক ব্যাকআপ ফাইল নয়।");
      }
    };
    reader.readAsText(file);
  });

  /* ---------- ৪. কাউন্টার সবসময় আপ-টু-ডেট ---------- */
  ["noticesBody", "galleryBody", "achievementsBody", "calEventsBody", "execCrewBody", "execRoverBody"]
    .forEach(id => {
      const el = $(id);
      if (el && typeof refreshStats === "function") new MutationObserver(() => refreshStats()).observe(el, { childList: true });
    });

  /* ---------- ৫. অর্জনের সারি উপরে/নিচে সরানো ---------- */
  const achTable = document.querySelector("#sec-achievements table");
  if (achTable) {
    achTable.insertAdjacentHTML("beforebegin",
      '<p class="card-note">নোট: তালিকার সবচেয়ে নিচের অর্জনটি সাইটে সবার উপরে (সবচেয়ে বড় ক্রমিক) দেখাবে। তীর বোতামে ক্রম বদলান।</p>');
  }
  function addMoveButtons() {
    document.querySelectorAll("#achievementsBody tr").forEach(tr => {
      const td = tr.lastElementChild;
      if (!td || td.querySelector(".mv")) return;
      td.style.whiteSpace = "nowrap";
      const del = td.querySelector(".btn-danger");
      [["up", "fa-arrow-up"], ["down", "fa-arrow-down"]].forEach(([dir, icon]) => {
        const b = makeBtn(icon, "", "btn-outline btn-sm mv");
        b.style.marginRight = "4px";
        b.setAttribute("aria-label", dir === "up" ? "উপরে সরান" : "নিচে সরান");
        b.addEventListener("click", () => {
          if (dir === "up" && tr.previousElementSibling) tr.parentNode.insertBefore(tr, tr.previousElementSibling);
          if (dir === "down" && tr.nextElementSibling) tr.parentNode.insertBefore(tr.nextElementSibling, tr);
          setDirty(true);
        });
        td.insertBefore(b, del);
      });
    });
  }
  const achBody = $("achievementsBody");
  if (achBody) new MutationObserver(addMoveButtons).observe(achBody, { childList: true });
})();