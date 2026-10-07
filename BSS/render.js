/* ==========================================================================
   render.js  (fixed)
   site-data.js -> localStorage / defaults theke content niye index.html e boshay.
   Load order: site-data.js  ->  render.js  ->  script.js
   Ager version-e index.html e #navLinks, #pdfNoticeList, #photoFrame,
   #gridBoxes, #profilePresident ... ei id gulo chilo na, tai marquee chhara
   kichui render hoto na. Ekhon class/position diye element khoja hoy,
   tai index.html e id bosate hobe na. (Kono element na thakle shudhu oi
   section skip hoy; baki section cholte thake.)
   ========================================================================== */
(function renderSite() {
  const content = loadSiteContent();

  // script.js language toggle e marquee-r Bangla text fallback hishebe lage
  window.SITE_MARQUEE_BN = content.marquee;

  const steps = [
    () => renderHeader(content.header),
    () => renderNav(content.nav),
    () => renderMarquee(content.marquee),
    () => renderNotices(content.pdfNotices),
    () => renderGallery(content.gallery),
    () => renderGridBoxes(content.gridBoxes),
    () => renderProfiles(content.profiles),
    () => renderCalendar(content.calendar),
    () => renderImportantLinks(content.importantLinks),
    () => renderAddressMap(content),
    () => renderFooter(content)
  ];
  // ekta section-e error hole baki gulo jeno bondho na hoy
  steps.forEach(fn => { try { fn(); } catch (e) { console.warn("render.js: section skipped", e); } });
})();

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const $q = (sel, root) => (root || document).querySelector(sel);
const $qa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

/* ---------- 0. Header: title, logo, slider ---------- */
function renderHeader(h) {
  if (!h) return;
  const title = $q(".hero-header .logo-title h1");
  if (title && h.titleBn) {
    title.textContent = h.titleBn;
    title.setAttribute("data-bn", h.titleBn);
    title.setAttribute("data-en", h.titleEn || h.titleBn);
  }
  const logo = $q(".hero-header img.logo");
  if (logo && h.logo) logo.src = h.logo;

  const bg = $q(".hero-header .slider-bg");
  const imgs = Array.isArray(h.sliderImages) ? h.sliderImages.filter(Boolean) : [];
  if (bg && imgs.length) {
    bg.innerHTML = "";
    imgs.forEach((src, i) => {
      const d = document.createElement("div");
      d.className = "slide" + (i === 0 ? " active" : "");
      d.style.backgroundImage = 'url("' + src.replace(/"/g, "%22") + '")';
      bg.appendChild(d);
    });
  }
}

/* ---------- 1. Navbar ---------- */
function renderNav(nav) {
  const ul = document.getElementById("navLinks") || $q(".navbar .nav-links");
  if (!ul || !Array.isArray(nav)) return;
  ul.innerHTML = nav.map(navTopItemHtml).join("");
}

function navTopItemHtml(item) {
  if (item.type === "simple") {
    return `<li><a href="${esc(item.link)}" data-bn="${esc(item.bn)}" data-en="${esc(item.en)}">${esc(item.bn)}</a></li>`;
  }
  if (item.type === "dropdown") {
    return `<li class="dropdown">
      <a href="#" data-bn="${esc(item.bn)}" data-en="${esc(item.en)}">${esc(item.bn)} <i class="fas fa-caret-down"></i></a>
      <ul class="dropdown-menu">${(item.children || []).map(navChildHtml).join("")}</ul>
    </li>`;
  }
  if (item.type === "mega") {
    return `<li class="nav-item mega-dropdown">
      <a href="#" class="nav-link" data-bn="${esc(item.bn)}" data-en="${esc(item.en)}">${esc(item.bn)} ▾</a>
      <div class="mega-menu"><div class="mega-grid">${(item.columns || []).map(megaColHtml).join("")}</div></div>
    </li>`;
  }
  return "";
}

function navChildHtml(child) {
  if (Array.isArray(child.children)) {
    return `<li class="has-submenu">
      <a href="#" data-bn="${esc(child.bn)}" data-en="${esc(child.en)}">${esc(child.bn)} <i class="fas fa-caret-right"></i></a>
      <ul class="sub-dropdown-menu">${child.children.map(navChildHtml).join("")}</ul>
    </li>`;
  }
  return `<li><a href="${esc(child.link)}" data-bn="${esc(child.bn)}" data-en="${esc(child.en)}">${esc(child.bn)}</a></li>`;
}

function megaColHtml(col) {
  const subHeader = col.subHeaderBn
    ? `<span class="sub-header" data-bn="${esc(col.subHeaderBn)}" data-en="${esc(col.subHeaderEn || "")}">${esc(col.subHeaderBn)}</span>`
    : "";
  return `<div class="mega-col">
    <h4 data-bn="${esc(col.titleBn)}" data-en="${esc(col.titleEn)}">${esc(col.titleBn)}</h4>
    ${subHeader}
    <ul>${(col.items || []).map(navChildHtml).join("")}</ul>
  </div>`;
}

/* ---------- 2. Marquee ---------- */
function renderMarquee(text) {
  const el = document.getElementById("noticeText");
  if (el) el.textContent = text;
}

/* ---------- 3. PDF notices ---------- */
function renderNotices(notices) {
  const ul = document.getElementById("pdfNoticeList") || $q(".pdf-notice-list");
  if (!ul || !Array.isArray(notices)) return;
  ul.innerHTML = notices.filter(n => n.titleBn || n.titleEn).map(n => `
    <li>
      <a href="#" class="notice-link" data-bn="${esc(n.titleBn)}" data-en="${esc(n.titleEn || n.titleBn)}">${esc(n.titleBn)}</a>
      ${n.file ? `<a href="${esc(n.file)}" download class="download-btn"><i class="fas fa-file-pdf"></i> PDF Download</a>` : ""}
    </li>
  `).join("");
}

/* ---------- 4. Gallery ---------- */
function renderGallery(gallery) {
  const frame = document.getElementById("photoFrame") || $q(".photo-frame");
  if (!frame || !Array.isArray(gallery)) return;
  const list = gallery.filter(g => g.img);
  frame.innerHTML = list.map((g, i) => `
    <div class="gallery-slide${i === 0 ? " active" : ""}">
      <img src="${esc(g.img)}" alt="Gallery Photo ${i + 1}">
      ${g.captionBn ? `<div class="caption" data-bn="${esc(g.captionBn)}" data-en="${esc(g.captionEn || g.captionBn)}">${esc(g.captionBn)}</div>` : ""}
    </div>
  `).join("");
}

/* ---------- 5. 2x2 grid boxes ---------- */
function renderGridBoxes(gridBoxes) {
  const wrap = document.getElementById("gridBoxes") || $q(".grid-2x2");
  if (!wrap || !gridBoxes) return;
  const isExternal = l => /^https?:\/\//i.test(l || "");
  wrap.innerHTML = Object.values(gridBoxes).map(box => `
    <div class="card-box grid-item">
      <div class="box-title-wrap">
        <i class="fas ${esc(box.icon || "fa-star")} grid-logo"></i>
        <h3 data-bn="${esc(box.titleBn)}" data-en="${esc(box.titleEn)}">${esc(box.titleBn)}</h3>
      </div>
      <ul class="option-list">
        ${(box.items || []).map(it => `<li><a href="${esc(it.link)}"${isExternal(it.link) ? ' target="_blank" rel="noopener"' : ""} data-bn="${esc(it.bn)}" data-en="${esc(it.en)}">${esc(it.bn)}</a></li>`).join("")}
      </ul>
    </div>
  `).join("");
}

/* ---------- 6. Sidebar profiles ----------
   Sidebar card order (index.html): 0 president, 1 rsl, 2 srm, 3 asrm,
   4 calendar, 5 important links, 6 address/map. Id thakle id-i priority pay. */
function sidebarCards() { return $qa(".sidebar .sidebar-card"); }

function renderProfiles(profiles) {
  if (!profiles) return;
  const cards = sidebarCards();
  const map = [
    ["president", "profilePresident", 0],
    ["rsl", "profileRsl", 1],
    ["srm", "profileSrm", 2],
    ["asrm", "profileAsrm", 3]
  ];
  map.forEach(([key, id, idx]) => {
    const el = document.getElementById(id) || cards[idx];
    const p = profiles[key];
    if (!el || !p) return;
    el.innerHTML = `
      <h3 class="classic-title" data-bn="${esc(p.titleBn)}" data-en="${esc(p.titleEn)}">${esc(p.titleBn)}</h3>
      <div class="profile-classic">
        <img src="${esc(p.photo)}" alt="${esc(p.nameEn)}">
        <h4 data-bn="${esc(p.nameBn)}" data-en="${esc(p.nameEn)}">${esc(p.nameBn)}</h4>
        <p data-bn="${esc(p.roleBn)}" data-en="${esc(p.roleEn)}">${esc(p.roleBn)}</p>
      </div>
      <details class="profile-details">
        <summary data-bn="বিস্তারিত" data-en="Details">বিস্তারিত</summary>
        <div class="details-content">
          <p data-bn="মোবাইল: ${esc(p.mobile)}" data-en="Mobile: ${esc(p.mobile)}">মোবাইল: ${esc(p.mobile)}</p>
          <p data-bn="ইমেইল: ${esc(p.email)}" data-en="Email: ${esc(p.email)}">ইমেইল: ${esc(p.email)}</p>
          <p data-bn="রক্তের গ্রুপ: ${esc(p.blood)}" data-en="Blood Group: ${esc(p.blood)}">রক্তের গ্রুপ: ${esc(p.blood)}</p>
          <p data-bn="বিএসআইডি: ${esc(p.bsid)}" data-en="BSID: ${esc(p.bsid)}">বিএসআইডি: ${esc(p.bsid)}</p>
        </div>
      </details>
    `;
  });
}

/* ---------- 7. Calendar (sidebar card 4) ---------- */
function renderCalendar(cal) {
  if (!cal) return;
  const card = document.getElementById("profileCalendar") || sidebarCards()[4];
  if (!card) return;
  const header = document.getElementById("calHeader") || $q(".cal-header", card);
  const list = document.getElementById("calEvents") || $q(".cal-events", card);
  if (header) {
    header.textContent = cal.monthYear;
    header.setAttribute("data-bn", cal.monthYear);
    header.setAttribute("data-en", cal.monthYear);
  }
  if (list && Array.isArray(cal.events)) {
    list.innerHTML = cal.events.filter(ev => ev.date || ev.text)
      .map(ev => `<li><span>${esc(ev.date)}</span> ${esc(ev.text)}</li>`).join("");
  }
}

/* ---------- 7.5 Important links / Event-I (sidebar card 5) ---------- */
function renderImportantLinks(d) {
  if (!d) return;
  const card = document.getElementById("importantCard") || sidebarCards()[5];
  if (!card) return;
  const title = $q(".classic-title", card);
  const header = $q(".cal-header", card);
  const list = $q(".cal-events", card);
  if (title) {
    title.textContent = d.titleBn;
    title.setAttribute("data-bn", d.titleBn || "");
    title.setAttribute("data-en", d.titleEn || d.titleBn || "");
  }
  if (header) {
    header.textContent = d.headerBn;
    header.setAttribute("data-bn", d.headerBn || "");
    header.setAttribute("data-en", d.headerEn || d.headerBn || "");
  }
  if (list && Array.isArray(d.items)) {
    list.innerHTML = d.items.map(it =>
      `<li><a href="${esc(it.link)}" target="_blank" rel="noopener" data-bn="${esc(it.bn)}" data-en="${esc(it.en || it.bn)}">${esc(it.bn)}</a></li>`
    ).join("");
  }
}

/* ---------- 8. Address & map (sidebar card 6) ---------- */
function renderAddressMap(content) {
  const card = sidebarCards()[6];
  const addr = document.getElementById("addressText") || (card && $q(".address-text", card));
  if (addr && content.address) addr.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${esc(content.address)}`;
  const frame = card && $q(".map-box iframe", card);
  if (frame && content.mapEmbedUrl && frame.getAttribute("src") !== content.mapEmbedUrl) {
    frame.setAttribute("src", content.mapEmbedUrl);
  }
}

/* ---------- 9. Footer ---------- */
function renderFooter(content) {
  const f = content.footer;
  if (!f) return;
  const sections = $qa(".footer-bar .footer-section");
  const isExternal = l => /^https?:\/\//i.test(l || "");

  // Column 1: naam, thikana, email, phone, tagline
  if (sections[0]) {
    const h4 = $q("h4", sections[0]);
    sections[0].innerHTML = (h4 ? h4.outerHTML : "") + `
      <p id="footerAddress">${esc(f.addressBn || content.address)}</p>
      <p id="footerEmail">ইমেইল: ${esc(f.email)}</p>
      <p id="footerPhone">Number: ${esc(f.phone)}</p>
      <p id="footerTagline" data-bn="${esc(f.tagline)}" data-en="${esc(f.taglineEn || f.tagline)}">${esc(f.tagline)}</p>`;
  }

  // Column 2: quick links
  if (sections[1] && Array.isArray(f.quickLinks)) {
    const ul = $q("ul", sections[1]);
    if (ul) ul.innerHTML = f.quickLinks.filter(q => q.bn || q.en).map(q =>
      `<li><a href="${esc(q.link)}"${isExternal(q.link) ? ' target="_blank" rel="noopener"' : ""} data-bn="${esc(q.bn)}" data-en="${esc(q.en || q.bn)}">${esc(q.bn)}</a></li>`
    ).join("");
  }

  // Column 3: social icons
  if (sections[2] && f.social) {
    const box = $q(".social-icons", sections[2]);
    const icons = [
      ["facebook", "fa-facebook-f"], ["instagram", "fa-instagram"], ["whatsapp", "fa-whatsapp"],
      ["linkedin", "fa-linkedin"], ["youtube", "fa-youtube"], ["twitter", "fa-twitter"]
    ];
    if (box) box.innerHTML = icons.map(([k, ic]) => {
      const url = f.social[k] || "#";
      return `<a href="${esc(url)}"${isExternal(url) ? ' target="_blank" rel="noopener"' : ""} aria-label="${k}"><i class="fab ${ic}"></i></a>`;
    }).join("");
  }

  // Copyright
  const copy = $q(".footer-bar .footer-bottom p");
  if (copy && f.copyrightText) copy.textContent = f.copyrightText;
}