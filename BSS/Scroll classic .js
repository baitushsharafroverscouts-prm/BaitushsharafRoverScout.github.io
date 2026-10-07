/* =========================================================
   Scroll Animation (Classic layout)
   HTML-এ কিছু বদলাতে হবে না — নিজেই দরকারি এলিমেন্ট খুঁজে নেয়।
   ব্যবহার: </body> এর ঠিক আগে
   <script src="scroll-classic.js" defer></script>
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

        /* ---------- ৩. স্ক্রল হ্যান্ডলার ---------- */
        var ticking = false;

        function update() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var progress = max > 0 ? Math.min(y / max, 1) : 0;

            bar.style.transform = "scaleX(" + progress + ")";
            toTop.classList.toggle("show", y > 420);

            if (navbar) {
                navbar.classList.toggle("scrolled", y > 20);
            }

            if (hero && !reduceMotion) {
                var h = hero.offsetHeight || 1;
                if (y < h) {
                    hero.style.setProperty("--parallax", (y * 0.22).toFixed(1));
                    hero.style.setProperty("--fade", Math.max(1 - y / (h * 0.9), 0).toFixed(2));
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

        var variants = ["from-left", "from-right", "zoom-in", "reveal-soft"];
        var seen = [];
        var items = [];

        function add(el, variant) {
            if (!el || seen.indexOf(el) !== -1) return;
            seen.push(el);
            el.classList.add("reveal");
            if (variant) el.classList.add(variant);
            items.push(el);
        }

        function addAll(selector, variant, filter) {
            document.querySelectorAll(selector).forEach(function (el) {
                if (filter && !filter(el)) return;
                add(el, variant);
            });
        }

        addAll(".content-card", "");
        addAll(".content-card h2", "from-left");
        addAll(".content-card p", "reveal-soft");
        addAll(".highlight-box", "from-left");
        addAll(".table-responsive", "zoom-in");
        /* টেবিলের হেডার সারি বাদ, বাকি সারি একটার পর একটা */
        addAll(".info-table tr", "reveal-soft", function (tr) {
            return !tr.querySelector("th");
        });
        addAll(".footer-section", "");
        addAll(".footer-bottom", "reveal-soft");

        var observer = new IntersectionObserver(function (entries) {
            var order = 0;
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var delay = Math.min(order * 90, 540);

                el.style.setProperty("--delay", delay + "ms");
                el.classList.add("in-view");
                observer.unobserve(el);
                order++;

                /* অ্যানিমেশন শেষ হলে ক্লাস সরিয়ে দিই,
                   যাতে hover ইত্যাদি আগের মতো কাজ করে */
                window.setTimeout(function () {
                    el.classList.remove("reveal", "in-view");
                    variants.forEach(function (v) { el.classList.remove(v); });
                    el.style.removeProperty("--delay");
                }, delay + 900);
            });
        }, { threshold: 0.06, rootMargin: "0px 0px -40px 0px" });

        items.forEach(function (el) {
            observer.observe(el);
        });
    });
})();