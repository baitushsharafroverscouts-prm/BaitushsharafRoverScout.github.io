document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var menuToggle = document.getElementById("menuToggle");
    var settingsDropdown = document.getElementById("settingsDropdown");
    var darkModeToggle = document.getElementById("darkModeToggle");
    var langToggleBtn = document.getElementById("langToggleBtn");
    var table = document.getElementById("achievementTable");

    var currentLang = "bn";

    /* ---------- localStorage (নিরাপদ ভাবে) ---------- */
    function saveSetting(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
    function loadSetting(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    /* ---------- অ্যাডমিন প্যানেলের ডেটা থেকে পেজ রেন্ডার ----------
       site-data.js (loadSiteContent) থেকে content.achievements পড়ে
       হিরো টেক্সট, সেকশন শিরোনাম, ভূমিকা এবং টেবিলের সারি বানায়।
       ডেটা না পেলে HTML-এ লেখা আগের কনটেন্টই থাকবে। */
    function setTextIfPresent(selector, value) {
        var el = document.querySelector(selector);
        if (el && value) el.textContent = value;
    }

    function renderAchievements() {
        if (typeof loadSiteContent !== "function" || !table) return;

        var content;
        try { content = loadSiteContent(); } catch (e) { return; }
        var a = content && content.achievements;
        if (!a) return;

        setTextIfPresent(".hero-content h1", a.pageHeadingBn);
        setTextIfPresent(".hero-content p", a.pageSubBn);
        setTextIfPresent(".content-card h2", a.sectionTitleBn);
        setTextIfPresent(".intro-text", a.sectionIntroBn);

        if (!Array.isArray(a.items) || a.items.length === 0) return;

        var tbody = table.querySelector("tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        a.items.forEach(function (item) {
            var tr = document.createElement("tr");
            // প্রথম ঘর ক্রমিক নম্বর — numberRows() নিজে বসাবে
            ["", item.year, item.title, item.level, item.details].forEach(function (text) {
                var td = document.createElement("td");
                td.textContent = text || "";
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    /* ---------- ক্রমিক নম্বর (উপরে সবচেয়ে বড়, নিচে ১) ---------- */
    var bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

    function formatNumber(n, lang) {
        var text = n < 10 ? "0" + n : String(n);
        if (lang === "bn") {
            return text.replace(/\d/g, function (d) { return bnDigits[d]; });
        }
        return text;
    }

    function numberRows() {
        if (!table) return;
        var rows = table.querySelectorAll("tbody tr");
        var total = rows.length;
        rows.forEach(function (row, index) {
            var cell = row.querySelector("td:first-child");
            if (cell) {
                // প্রথম সারি (সবার উপরে) = সবচেয়ে বড় নম্বর, শেষ সারি = ০১
                cell.textContent = formatNumber(total - index, currentLang);
            }
        });
    }

    /* ---------- সেটিংস মেনু (তিন ডট) ---------- */
    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = settingsDropdown.classList.toggle("show");
        menuToggle.setAttribute("aria-expanded", open);
    });

    settingsDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function () {
        settingsDropdown.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".dropdown.open").forEach(function (d) {
            d.classList.remove("open");
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            settingsDropdown.classList.remove("show");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ---------- ডার্ক মোড ---------- */
    function setDarkMode(on) {
        body.classList.toggle("dark-mode", on);
        darkModeToggle.checked = on;
        saveSetting("theme", on ? "dark" : "light");
    }

    darkModeToggle.addEventListener("change", function () {
        setDarkMode(darkModeToggle.checked);
    });

    /* ---------- ভাষা পরিবর্তন (বাংলা / English) ---------- */
    function setText(el, text) {
        // আইকন (<i>) থাকলে সেটা ঠিক রেখে শুধু লেখা বদলাবে
        var textNode = Array.prototype.find.call(el.childNodes, function (n) {
            return n.nodeType === 3 && n.textContent.trim() !== "";
        });
        if (textNode) {
            textNode.textContent = el.querySelector("i") ? text + " " : text;
        } else {
            el.textContent = text;
        }
    }

    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        document.querySelectorAll("[data-bn][data-en]").forEach(function (el) {
            setText(el, el.getAttribute("data-" + lang));
        });

        langToggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";
        numberRows();
        saveSetting("lang", lang);
    }

    langToggleBtn.addEventListener("click", function () {
        applyLanguage(currentLang === "bn" ? "en" : "bn");
    });

    /* ---------- মোবাইলে ড্রপডাউন মেনু ---------- */
    document.querySelectorAll(".nav-links > .dropdown > a").forEach(function (link) {
        link.addEventListener("click", function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                var parent = link.parentElement;
                document.querySelectorAll(".dropdown.open").forEach(function (d) {
                    if (d !== parent) d.classList.remove("open");
                });
                parent.classList.toggle("open");
            } else if (link.getAttribute("href") === "#") {
                e.preventDefault();
            }
        });
    });

    /* ---------- শুরুতে ডেটা রেন্ডার ও সেভ করা সেটিং লোড ---------- */
    renderAchievements();
    setDarkMode(loadSetting("theme") === "dark");
    applyLanguage(loadSetting("lang") === "en" ? "en" : "bn");
});


/* =========================================================
   স্ক্রল অ্যানিমেশন
   HTML-এ কিছু বদলাতে হবে না — এই ফাইল নিজেই দরকারি এলিমেন্টে
   অ্যানিমেশন ক্লাস যোগ করে নেয়।
   ব্যবহার: </body> এর ঠিক আগে
   <script src="scroll-animation.js" defer></script>
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var navbar = document.querySelector(".navbar");
        var heroContent = document.querySelector(".hero-content");
        var hero = document.querySelector(".hero");

        /* ---------- ১. স্ক্রল প্রোগ্রেস বার ---------- */
        var bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        /* ---------- ২. উপরে ফেরার বাটন ---------- */
        var toTop = document.createElement("button");
        toTop.className = "to-top";
        toTop.type = "button";
        toTop.setAttribute("aria-label", "উপরে যান");
        toTop.textContent = "\u2191";
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
        document.body.appendChild(toTop);

        /* ---------- ৩. স্ক্রল হ্যান্ডলার (rAF দিয়ে হালকা) ---------- */
        var ticking = false;

        function update() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var progress = max > 0 ? Math.min(y / max, 1) : 0;

            bar.style.transform = "scaleX(" + progress + ")";

            if (navbar) {
                navbar.classList.toggle("scrolled", y > 20);
            }

            toTop.classList.toggle("show", y > 420);

            if (heroContent && hero && !reduceMotion) {
                var h = hero.offsetHeight || 1;
                if (y < h) {
                    heroContent.style.setProperty("--parallax", (y * 0.22).toFixed(1));
                    heroContent.style.setProperty("--fade", Math.max(1 - y / (h * 0.95), 0).toFixed(2));
                }
            }

            ticking = false;
        }

        window.addEventListener("scroll", function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        window.addEventListener("resize", update);
        update();

        /* ---------- ৪. স্ক্রল রিভিল ---------- */
        if (reduceMotion || !("IntersectionObserver" in window)) {
            return; /* অ্যানিমেশন ছাড়াই সব দেখা যাবে */
        }

        /* [selector, extra classes] */
        var targets = [
            [".hero-content > *", ""],
            [".content-card h2", "from-left"],
            [".intro-text", ""],
            [".table-responsive", "zoom-in"],
            [".info-table tbody tr", "reveal-soft"],
            [".footer-section", ""],
            [".footer-bottom", "reveal-soft"]
        ];

        var items = [];
        targets.forEach(function (t) {
            document.querySelectorAll(t[0]).forEach(function (el) {
                el.classList.add("reveal");
                if (t[1]) el.classList.add(t[1]);
                items.push(el);
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            var order = 0;
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                /* একসাথে যেগুলো দেখা যায় সেগুলো একটার পর একটা আসবে */
                entry.target.style.setProperty("--delay", Math.min(order * 90, 540) + "ms");
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
                order++;
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) {
            observer.observe(el);
        });
    });
})();