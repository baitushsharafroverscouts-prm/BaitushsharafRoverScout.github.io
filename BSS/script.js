// 1. Settings Dropdown Toggle (3-dot)
const menuToggle = document.getElementById('menuToggle');
const settingsDropdown = document.getElementById('settingsDropdown');

if (menuToggle && settingsDropdown) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!settingsDropdown.contains(e.target) && e.target !== menuToggle) {
            settingsDropdown.classList.remove('show');
        }
    });
}

// 2. Header Background Slider (3s Interval)
const headerSlides = document.querySelectorAll('.hero-header .slide');
let currentHeaderSlide = 0;

if (headerSlides.length > 0) {
    setInterval(() => {
        headerSlides[currentHeaderSlide].classList.remove('active');
        currentHeaderSlide = (currentHeaderSlide + 1) % headerSlides.length;
        headerSlides[currentHeaderSlide].classList.add('active');
    }, 3000);
}

// 3. Photo Gallery Frame Slider (3s Interval)
const gallerySlides = document.querySelectorAll('.gallery-slide');
let currentGallerySlide = 0;

if (gallerySlides.length > 0) {
    setInterval(() => {
        gallerySlides[currentGallerySlide].classList.remove('active');
        currentGallerySlide = (currentGallerySlide + 1) % gallerySlides.length;
        gallerySlides[currentGallerySlide].classList.add('active');
    }, 3000);
}

// 4. Dark / Light Mode — সম্পূর্ণ ম্যানুয়াল
//    - ডিভাইসের (system) থিম অনুসরণ করে না
//    - ডিফল্ট সবসময় Light
//    - ইউজার সুইচ চাপলে সেই পছন্দ মনে রাখে (পরের বার খুললেও একই থাকে)
const THEME_KEY = 'theme';
const darkModeToggle = document.getElementById('darkModeToggle');

function getSavedTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (err) {
        return null; // private mode ইত্যাদিতে storage বন্ধ থাকলেও চলবে
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
        /* ignore */
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme; // ব্রাউজারের অটো-ডার্কও আটকায়
    if (darkModeToggle) {
        darkModeToggle.checked = (theme === 'dark'); // সুইচ আর থিম সবসময় মিলে থাকবে
    }
}

// পেজ খুললে: সেভ করা পছন্দ, না থাকলে Light
applyTheme(getSavedTheme() || 'light');

if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        saveTheme(theme);
    });
}

// 5. Language Switcher (Bangla / English) — ম্যানুয়াল + পছন্দ সেভ করা
//    - ডিফল্ট বাংলা, ইউজার বাটন চাপলে বদলাবে
//    - পরের বার পেজ খুললেও শেষ বেছে নেওয়া ভাষাই থাকবে
//    - বাটনের লেখা সবসময় "অন্য ভাষা"-র নাম দেখাবে (বাংলা থাকলে English, English থাকলে বাংলা)
const LANG_KEY = 'lang';
const langToggleBtn = document.getElementById('langToggleBtn');

const noticeTexts = {
    en: "New member registration for Baitush Sharaf Rover Scout Group has started. Contact for details.",
    bn: "বায়তুশ শরফ রোভার স্কাউট গ্রুপের নতুন সদস্য রেজিস্ট্রেশন কার্যক্রম শুরু হয়েছে। বিস্তারিত জানতে যোগাযোগ করুন।"
};

function getSavedLang() {
    try {
        const saved = localStorage.getItem(LANG_KEY);
        return saved === 'bn' || saved === 'en' ? saved : null;
    } catch (err) {
        return null;
    }
}

function saveLang(lang) {
    try {
        localStorage.setItem(LANG_KEY, lang);
    } catch (err) {
        /* ignore */
    }
}

let currentLang = getSavedLang() || 'bn';

// এলিমেন্টের ভেতরে আইকন/চাইল্ড থাকলে শুধু টেক্সট অংশ বদলাবে (আইকন ঠিক থাকবে)
function setTextFromAttr(el, text) {
    if (el.children.length === 0) {
        el.textContent = text;
        return;
    }
    for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            const lead = node.textContent.match(/^\s*/)[0];
            const trail = node.textContent.match(/\s*$/)[0];
            node.textContent = lead + text + trail; // আইকনের পাশের স্পেস ঠিক রাখে
            return;
        }
    }
}

function applyLang(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    // data-bn / data-en থাকা সব লেখা
    document.querySelectorAll('[data-bn], [data-en]').forEach(el => {
        if (el === langToggleBtn) return; // ভাষার বাটন নিজে আলাদাভাবে সেট হয়
        const text = el.getAttribute(`data-${lang}`);
        if (text) setTextFromAttr(el, text);
    });

    // placeholder, title, aria-label, alt বদলাতে চাইলে:
    // data-bn-placeholder="..." data-en-placeholder="..." (title / aria-label / alt এর জন্যও একই নিয়ম)
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attr => {
        document.querySelectorAll(`[data-${lang}-${attr}]`).forEach(el => {
            el.setAttribute(attr, el.getAttribute(`data-${lang}-${attr}`));
        });
    });

    // নোটিশ টেক্সট
    const noticeEl = document.getElementById('noticeText');
    if (noticeEl) {
        noticeEl.textContent = noticeTexts[lang];
    }

    // বাটনে দেখাবে অন্য ভাষার নাম
    if (langToggleBtn) {
        langToggleBtn.textContent = lang === 'bn' ? 'English' : 'বাংলা';
    }

    // "উপরে যান" বাটন (স্ক্রল অংশ যোগ করে)
    const topBtn = document.querySelector('.to-top');
    if (topBtn) {
        topBtn.setAttribute('aria-label', lang === 'bn' ? 'উপরে যান' : 'Back to top');
    }
}

// পেজ খুললে সেভ করা ভাষা (না থাকলে বাংলা) বসাও
applyLang(currentLang);

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        applyLang(currentLang === 'bn' ? 'en' : 'bn');
        saveLang(currentLang);
    });
}

/* =========================================================
   6. Scroll Animation
   (এই কোড এখন script.js-এর ভেতরেই আছে,
    তাই আলাদা scroll-effects.js লিংক করার দরকার নেই।
    CSS-এ scroll-effects.css লিংক থাকতে হবে।)
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
        var hero = document.querySelector(".hero-header");
        var heroContent = document.querySelector(".header-content");

        /* ---------- ১. স্ক্রল প্রোগ্রেস বার ---------- */
        var bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        /* ---------- ২. উপরে ফেরার বাটন ---------- */
        var toTop = document.createElement("button");
        toTop.className = "to-top";
        toTop.type = "button";
        toTop.setAttribute("aria-label", currentLang === "en" ? "Back to top" : "উপরে যান");
        toTop.textContent = "\u2191";
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
        document.body.appendChild(toTop);

        /* ---------- ৩. স্ক্রল হ্যান্ডলার ---------- */
        var ticking = false;

        function update() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var progress = max > 0 ? Math.min(y / max, 1) : 0;

            bar.style.transform = "scaleX(" + progress + ")";
            toTop.classList.toggle("show", y > 420);

            if (hero && heroContent && !reduceMotion) {
                var h = hero.offsetHeight || 1;
                if (y < h) {
                    heroContent.style.setProperty("--parallax", (y * 0.2).toFixed(1));
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

        /* [selector, অ্যানিমেশনের ধরন] */
        var targets = [
            [".notice-container", "reveal-soft"],
            [".body-area > *", "from-left"],
            [".sidebar > *", "from-right"],
            [".grid-2x2 > *", "zoom-in"],
            [".section-title", ""],
            [".section-subtitle", ""],
            [".class-card", "zoom-in"],
            [".course-card", ""],
            [".teacher-card", "from-right"],
            [".app-banner", "zoom-in"],
            [".social-card", "reveal-soft"],
            [".footer-section", ""],
            [".footer-bottom", "reveal-soft"]
        ];

        var variants = ["from-left", "from-right", "zoom-in", "reveal-soft"];
        var seen = [];
        var items = [];

        targets.forEach(function (t) {
            document.querySelectorAll(t[0]).forEach(function (el) {
                if (seen.indexOf(el) !== -1) return;
                seen.push(el);
                el.classList.add("reveal");
                if (t[1]) el.classList.add(t[1]);
                items.push(el);
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            var order = 0;
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var delay = Math.min(order * 90, 540);

                /* একসাথে যেগুলো দেখা যায় সেগুলো একটার পর একটা আসবে */
                el.style.setProperty("--delay", delay + "ms");
                el.classList.add("in-view");
                observer.unobserve(el);
                order++;

                /* অ্যানিমেশন শেষ হলে ক্লাস সরিয়ে দিই,
                   যাতে কার্ডের মূল hover transition আবার আগের মতো কাজ করে */
                window.setTimeout(function () {
                    el.classList.remove("reveal", "in-view");
                    variants.forEach(function (v) { el.classList.remove(v); });
                    el.style.removeProperty("--delay");
                }, delay + 900);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) {
            observer.observe(el);
        });
    });
})();

