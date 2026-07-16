/* ============================================================
   Beauty Lodge by Anna — site behavior
   ============================================================ */

/* -------------------------------------------------------------
   1) YOUR BOOKING LINK  ← edit this ONE line when you have it.
   Every "Book" button on the site points here automatically.
   Example: const BOOKING_URL = "https://beautylodgebyanna.glossgenius.com/";
   ------------------------------------------------------------- */
const BOOKING_URL = "#"; // placeholder — paste your GlossGenius link here

/* Instagram handle (used in nav + footer) */
const INSTAGRAM_URL = "https://www.instagram.com/beauty_lodge_by_anna/";

document.addEventListener("DOMContentLoaded", () => {
  // Wire every booking button
  document.querySelectorAll("[data-book]").forEach((el) => {
    el.setAttribute("href", BOOKING_URL);
    if (BOOKING_URL && BOOKING_URL !== "#") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });

  // Wire Instagram links
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
