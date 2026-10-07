/* =========================================================
   scroll-effects.js  (v3) — style.css এর স্ক্রল/অ্যানিমেশনের জন্য
   ব্যবহার: index.html এ </body> এর আগে, script.js এর পরে
   <script src="scroll-effects.js" defer></script>
   ========================================================= */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function ready(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    var bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    function toBn(str) { return String(str).replace(/\d/g, function (d) { return bnDigits[d]; }); }

    ready(function () {
        var hero = document.querySelector(".hero-header");
        var heroContent = document.querySelector(".header-content");
        var sliderBg = document.querySelector(".slider-bg");
        var mainNav = document.querySelector(".navbar .nav-links");

        /* ---------- ১. স্ক্রল প্রোগ্রেস বার ---------- */
        var bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        /* ---------- ২. উপরে ফেরার বাটন (প্রোগ্রেস রিং সহ) ---------- */
        var toTop = document.createElement("button");
        toTop.className = "to-top";
        toTop.type = "button";
        toTop.setAttribute("aria-label", "উপরে যান");
        toTop.innerHTML = "<span>\u2191</span>";
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
        document.body.appendChild(toTop);

        /* ---------- ৩. স্টিকি মিনি নেভবার ---------- */
        var sticky = null;
        function buildSticky() {
            if (!mainNav || !hero) return;
            if (!sticky) {
                sticky = document.createElement("div");
                sticky.className = "sticky-nav";
                sticky.setAttribute("aria-hidden", "true");
                document.body.appendChild(sticky);
            }
            var logo = document.querySelector(".logo-title .logo");
            var title = document.querySelector(".logo-title h1");
            var titleText = title ? title.textContent.replace(/\s+/g, " ").trim() : "";

            sticky.innerHTML = "";
            var brand = document.createElement("a");
            brand.className = "sticky-brand";
            brand.href = "#";
            brand.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            });
            if (logo) {
                var img = document.createElement("img");
                img.src = logo.getAttribute("src");
                img.alt = "";
                brand.appendChild(img);
            }
            var span = document.createElement("span");
            span.textContent = titleText;
            brand.appendChild(span);
            sticky.appendChild(brand);
            sticky.appendChild(mainNav.cloneNode(true));
        }
        buildSticky();

        /* ভাষা বদলালে স্টিকি বারও নতুন করে বানাও */
        var langBtn = document.getElementById("langToggleBtn");
        if (langBtn) langBtn.addEventListener("click", function () { setTimeout(buildSticky, 80); });

        /* ---------- ৪. স্ক্রল হ্যান্ডলার (rAF) ---------- */
        var ticking = false;
        function update() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var progress = max > 0 ? Math.min(y / max, 1) : 0;

            bar.style.transform = "scaleX(" + progress + ")";
            toTop.classList.toggle("show", y > 420);
            toTop.style.setProperty("--p", (progress * 100).toFixed(1));

            if (hero) {
                var h = hero.offsetHeight || 1;
                if (sticky) sticky.classList.toggle("show", y > h + 20);

                if (!reduceMotion && y < h) {
                    if (heroContent) {
                        heroContent.style.setProperty("--parallax", (y * 0.25).toFixed(1));
                        heroContent.style.setProperty("--fade", Math.max(1 - y / (h * 0.9), 0).toFixed(2));
                    }
                    if (sliderBg) sliderBg.style.setProperty("--bgshift", Math.min(y * 0.12, 40).toFixed(1));
                }
            }
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener("resize", update);
        update();

        /* ---------- ৫. বাটনে ক্লিক রিপল (এটা reduce-motion এও নিরাপদ) ---------- */
        if (!reduceMotion) {
            document.addEventListener("click", function (e) {
                var btn = e.target.closest(".btn, .download-btn, .lang-btn");
                if (!btn) return;
                var rect = btn.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var r = document.createElement("span");
                r.className = "ripple";
                r.style.width = r.style.height = size + "px";
                r.style.left = (e.clientX - rect.left - size / 2) + "px";
                r.style.top = (e.clientY - rect.top - size / 2) + "px";
                btn.appendChild(r);
                setTimeout(function () { r.remove(); }, 700);
            });
        }

        if (reduceMotion || !("IntersectionObserver" in window)) return;

        /* ---------- ৬. কার্ডে 3D টিল + আলো (শুধু মাউস থাকলে) ---------- */
        if (canHover) {
            var tiltSel = ".grid-item, .class-card, .course-card, .teacher-card, .social-card";
            document.querySelectorAll(tiltSel).forEach(function (el) {
                el.classList.add("tilt");
                el.addEventListener("pointermove", function (e) {
                    if (e.pointerType !== "mouse") return;
                    var r = el.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width;
                    var py = (e.clientY - r.top) / r.height;
                    el.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
                    el.style.setProperty("--ry", ((px - 0.5) * 9).toFixed(2) + "deg");
                    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
                    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
                });
                el.addEventListener("pointerleave", function () {
                    el.style.setProperty("--rx", "0deg");
                    el.style.setProperty("--ry", "0deg");
                });
            });
        }

        /* ---------- ৭. শিরোনামের শব্দ একে একে (section-title) ---------- */
        var splitEls = [];
        document.querySelectorAll(".section-title").forEach(function (el) {
            if (el.children.length) return; /* আইকন/ট্যাগ থাকলে বাদ */
            var words = el.textContent.trim().split(/\s+/);
            el.textContent = "";
            words.forEach(function (w, i) {
                var s = document.createElement("span");
                s.className = "w";
                s.style.setProperty("--i", i);
                s.textContent = w;
                el.appendChild(s);
                if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
            });
            el.classList.add("split-words");
            splitEls.push(el);
        });

        /* ---------- ৮. লিস্ট আইটেম stagger ---------- */
        var staggerEls = [];
        document.querySelectorAll(".option-list, .pdf-notice-list, .cal-events, .details-content").forEach(function (list) {
            if (list.classList.contains("details-content")) return;
            Array.prototype.forEach.call(list.children, function (child, i) {
                child.style.setProperty("--i", i);
            });
            list.classList.add("stagger");
            staggerEls.push(list);
        });

        var listObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.classList.contains("stagger")) el.classList.add("stagger-in");
                if (el.classList.contains("split-words")) el.classList.add("words-in");
                if (el.hasAttribute("data-count")) runCounter(el);
                listObserver.unobserve(el);
            });
        }, { threshold: 0.2, rootMargin: "0px 0px -30px 0px" });

        staggerEls.concat(splitEls).forEach(function (el) { listObserver.observe(el); });

        /* ---------- ৯. সংখ্যা গোনা: <span data-count="120" data-suffix="+"> ---------- */
        function runCounter(el) {
            var target = parseFloat(el.getAttribute("data-count")) || 0;
            var suffix = el.getAttribute("data-suffix") || "";
            var bn = el.hasAttribute("data-bn-digits");
            var start = null, dur = 1600;
            function step(ts) {
                if (start === null) start = ts;
                var t = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - t, 3);
                var text = Math.round(target * eased).toString();
                el.textContent = (bn ? toBn(text) : text) + suffix;
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
        document.querySelectorAll("[data-count]").forEach(function (el) { listObserver.observe(el); });

        /* ---------- ১০. স্ক্রল রিভিল ---------- */
        var targets = [
            [".notice-container", "reveal-soft"],
            [".body-area > .card-box", "zoom-in"],
            [".grid-2x2 > .grid-item", "flip-up"],
            [".sidebar > .card-box", "from-right"],
            [".section-title", ""],
            [".section-subtitle", "reveal-soft"],
            [".class-card", "zoom-in"],
            [".course-card", ""],
            [".teacher-card", "zoom-in"],
            [".app-banner", "zoom-in"],
            [".social-card", "reveal-soft"],
            [".footer-section", "blur-in"],
            [".footer-bottom", "reveal-soft"]
        ];

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

        var revealObserver = new IntersectionObserver(function (entries) {
            var order = 0;
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.style.setProperty("--delay", Math.min(order * 110, 660) + "ms");
                el.classList.add("in-view");
                revealObserver.unobserve(el);
                order++;

                /* অ্যানিমেশন শেষে reveal ক্লাস সরাও, যাতে hover/tilt ঠিক চলে */
                var cleaned = false;
                function cleanup() {
                    if (cleaned) return;
                    cleaned = true;
                    el.classList.remove("reveal", "in-view", "from-left", "from-right",
                        "zoom-in", "reveal-soft", "flip-up", "blur-in");
                    el.style.removeProperty("--delay");
                }
                el.addEventListener("transitionend", function handler(e) {
                    if (e.target !== el || e.propertyName !== "opacity") return;
                    el.removeEventListener("transitionend", handler);
                    cleanup();
                });
                setTimeout(cleanup, 1800);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) { revealObserver.observe(el); });
    });
})();