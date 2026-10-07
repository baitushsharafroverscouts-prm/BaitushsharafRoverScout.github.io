document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadSiteContent !== "function") return;
  const m = loadSiteContent().members;
  if (!m) return;

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const bn = n => String(n).padStart(2, "0").replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);

  // হিরো টেক্সট
  const h1 = document.querySelector(".hero-content h1");
  const p  = document.querySelector(".hero-content p");
  const h3 = document.querySelector(".hero-content h3");
  if (h1 && m.pageHeadingBn) h1.textContent = m.pageHeadingBn;
  if (p  && m.pageSubBn)     p.textContent  = m.pageSubBn;
  if (h3 && m.groupNameBn)   h3.textContent = m.groupNameBn;

  // টেবিলসমূহ
  [["srmTable","srm"], ["asrmTable","asrm"], ["rmTable","rm"], ["roverTable","rover"]].forEach(([id, key]) => {
    const tbody = document.querySelector(`#${id} tbody`);
    const list = m[key];
    if (!tbody || !Array.isArray(list)) return;

    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6">কোনো তথ্য পাওয়া যায়নি</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map((x, i) => `
      <tr>
        <td>${bn(i + 1)}</td>
        <td>${esc(x.name) || "-"}</td>
        <td>${esc(x.cls) || "-"}</td>
        <td>${esc(x.roll) || "-"}</td>
        <td>${esc(x.mobile) || "-"}</td>
        <td>${esc(x.date) || "-"}</td>
      </tr>`).join("");
  });
});