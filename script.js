/* ============================================================
   Beauty Lodge by Anna — site behavior
   ============================================================ */

/* -------------------------------------------------------------
   YOUR SETMORE BOOKING PAGE
   Every "Book" button opens this in an on-page overlay.
   To change it later, edit just this one line.
   ------------------------------------------------------------- */
const SETMORE_URL = "https://beautylodgebyanna.setmore.com";

/* Instagram (used in nav + footer) */
const INSTAGRAM_URL = "https://www.instagram.com/beauty_lodge_by_anna/";

document.addEventListener("DOMContentLoaded", () => {
  // Turn every [data-book] button into a Setmore "Book Now" trigger.
  // Buttons keep all their own styling — we just add the Setmore hook.
  document.querySelectorAll("[data-book]").forEach((el) => {
    el.classList.add("anywhere-book-now-button");
    el.setAttribute("data-booking-url", SETMORE_URL);
    el.setAttribute("data-new-tab", "false"); // opens in an on-page overlay
    el.setAttribute("href", SETMORE_URL);      // fallback if the widget is slow to load
    el.setAttribute("rel", "noopener");
  });

  // Load the Setmore "Anywhere Book Now" widget (once, works on every page).
  if (!document.getElementById("anywhere_book_now_script")) {
    const s = document.createElement("script");
    s.id = "anywhere_book_now_script";
    s.src = "https://assets.setmore.com/integration/book-now/live/v1/anywhere-book-now.js";
    document.body.appendChild(s);
  }

  // Instagram links
  document.querySelectorAll("[data-ig]").forEach((el) => {
    el.setAttribute("href", INSTAGRAM_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Scroll reveal
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }
});
