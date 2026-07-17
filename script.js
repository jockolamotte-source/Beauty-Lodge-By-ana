/* ============================================================
   Beauty Lodge by Anna — site behavior
   ============================================================ */

const SETMORE_URL = "https://beautylodgebyanna.setmore.com";
const INSTAGRAM_URL = "https://www.instagram.com/beauty_lodge_by_anna/";

/* Public Google Calendar iCal feed — no API key required. */
const PUBLIC_CALENDAR_ICS_URL =
  "https://calendar.google.com/calendar/ical/2d825d82fd73f29a31cc9ebbb991f27b0c1921e830468cc897d4e0742fb67e60%40group.calendar.google.com/public/basic.ics";

const MAX_POPUP_EVENTS = 6;
const CALENDAR_REFRESH_MINUTES = 15;

function escapeEventText(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function decodeICalText(value = "") {
  return String(value)
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function unfoldICalLines(text) {
  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n[ \t]/g, "");
}

function getICalProperty(block, propertyName) {
  const lines = block.split("\n");
  const prefix = propertyName.toUpperCase();

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (upper.startsWith(`${prefix}:`) || upper.startsWith(`${prefix};`)) {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return null;

      const left = line.slice(0, separatorIndex);
      const value = line.slice(separatorIndex + 1);
      const parameters = {};

      left.split(";").slice(1).forEach((parameter) => {
        const equalsIndex = parameter.indexOf("=");
        if (equalsIndex > -1) {
          parameters[parameter.slice(0, equalsIndex).toUpperCase()] =
            parameter.slice(equalsIndex + 1);
        }
      });

      return { value: decodeICalText(value), parameters };
    }
  }

  return null;
}

function parseICalDate(property) {
  if (!property?.value) return null;

  const value = property.value.trim();
  const isDateOnly =
    property.parameters?.VALUE === "DATE" || /^\d{8}$/.test(value);

  if (isDateOnly) {
    return {
      date: new Date(
        Number(value.slice(0, 4)),
        Number(value.slice(4, 6)) - 1,
        Number(value.slice(6, 8)),
        0, 0, 0
      ),
      allDay: true
    };
  }

  const match = value.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/
  );

  if (!match) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime())
      ? null
      : { date: fallback, allDay: false };
  }

  const [, year, month, day, hour, minute, second = "00", utcMarker] = match;

  const date = utcMarker
    ? new Date(Date.UTC(
        Number(year), Number(month) - 1, Number(day),
        Number(hour), Number(minute), Number(second)
      ))
    : new Date(
        Number(year), Number(month) - 1, Number(day),
        Number(hour), Number(minute), Number(second)
      );

  return { date, allDay: false };
}

function parsePublicCalendar(icsText) {
  const unfolded = unfoldICalLines(icsText);

  return unfolded
    .split("BEGIN:VEVENT")
    .slice(1)
    .map((chunk) => chunk.split("END:VEVENT")[0])
    .map((block) => {
      const startResult = parseICalDate(getICalProperty(block, "DTSTART"));
      const endResult = parseICalDate(getICalProperty(block, "DTEND"));
      if (!startResult?.date) return null;

      const status = getICalProperty(block, "STATUS")?.value?.toUpperCase() || "";
      if (status === "CANCELLED") return null;

      return {
        summary: getICalProperty(block, "SUMMARY")?.value || "Beauty Lodge Pop-Up",
        description: getICalProperty(block, "DESCRIPTION")?.value || "",
        location: getICalProperty(block, "LOCATION")?.value || "",
        start: startResult.date,
        end: endResult?.date || null,
        allDay: startResult.allDay
      };
    })
    .filter(Boolean);
}

function formatEventMonth(date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" })
    .format(date)
    .toUpperCase();
}

function formatEventDay(date) {
  return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
}

function formatEventSchedule(event) {
  const dateText = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(event.start);

  if (event.allDay) return dateText;

  const startTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(event.start);

  if (!event.end) return `${dateText} · ${startTime}`;

  const sameDay =
    event.start.getFullYear() === event.end.getFullYear() &&
    event.start.getMonth() === event.end.getMonth() &&
    event.start.getDate() === event.end.getDate();

  if (sameDay) {
    const endTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(event.end);
    return `${dateText} · ${startTime}–${endTime}`;
  }

  const endText = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(event.end);

  return `${dateText} · ${startTime} through ${endText}`;
}

function getShortDescription(description = "") {
  const cleaned = String(description)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return cleaned.length <= 180
    ? cleaned
    : `${cleaned.slice(0, 180).trim()}…`;
}

function createPopupEventCard(event) {
  const title = escapeEventText(event.summary);
  const location = escapeEventText(event.location);
  const description = escapeEventText(getShortDescription(event.description));
  const schedule = escapeEventText(formatEventSchedule(event));

  const locationHtml = location
    ? `<p class="popup-location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
        <span>${location}</span>
      </p>`
    : "";

  const descriptionHtml = description
    ? `<p class="popup-description">${description}</p>`
    : "";

  return `<article class="popup-card">
      <div class="popup-date">
        <span class="popup-month">${formatEventMonth(event.start)}</span>
        <span class="popup-day">${formatEventDay(event.start)}</span>
      </div>
      <div class="popup-content">
        <h4>${title}</h4>
        <p class="popup-schedule">${schedule}</p>
        ${locationHtml}
        ${descriptionHtml}
      </div>
    </article>`;
}

function configureDynamicInstagramLink(container) {
  const button = container.querySelector("[data-ig]");
  if (button) {
    button.href = INSTAGRAM_URL;
    button.target = "_blank";
    button.rel = "noopener";
  }
}

async function fetchTextWithTimeout(url, timeoutMilliseconds = 12000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMilliseconds);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Calendar request returned HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchPublicCalendarFeed() {
  const encoded = encodeURIComponent(PUBLIC_CALENDAR_ICS_URL);
  const sources = [
    PUBLIC_CALENDAR_ICS_URL,
    `https://api.allorigins.win/raw?url=${encoded}`,
    `https://corsproxy.io/?url=${encoded}`
  ];

  let lastError = null;

  for (const source of sources) {
    try {
      const text = await fetchTextWithTimeout(source);
      if (text.includes("BEGIN:VCALENDAR")) return text;
      throw new Error("The response was not a valid iCal calendar.");
    } catch (error) {
      lastError = error;
      console.warn("Calendar source failed; trying another source.", error);
    }
  }

  throw lastError || new Error("Unable to retrieve calendar.");
}

function renderEmptyCalendar(container) {
  container.innerHTML = `<div class="popup-empty">
      <p class="eyebrow">More Dates Coming Soon</p>
      <h4>No upcoming pop-ups are scheduled yet.</h4>
      <p>Follow Beauty Lodge on Instagram for announcements and newly added market dates.</p>
      <a class="btn btn-light btn-sm" data-ig href="#">Follow on Instagram</a>
    </div>`;
  configureDynamicInstagramLink(container);
}

function renderCalendarError(container) {
  container.innerHTML = `<div class="popup-empty">
      <p class="eyebrow">Upcoming Events</p>
      <h4>We couldn't load the event calendar.</h4>
      <p>Please check back soon or visit Instagram for the latest pop-up and market announcements.</p>
      <a class="btn btn-light btn-sm" data-ig href="#">Follow on Instagram</a>
    </div>`;
  configureDynamicInstagramLink(container);
}

async function loadPopupEvents() {
  const container = document.getElementById("popup-events");
  if (!container) return;

  try {
    const icsText = await fetchPublicCalendarFeed();
    const now = new Date();

    const events = parsePublicCalendar(icsText)
      .filter((event) => (event.end || event.start) >= now)
      .sort((a, b) => a.start - b.start)
      .slice(0, MAX_POPUP_EVENTS);

    if (events.length === 0) {
      renderEmptyCalendar(container);
      return;
    }

    container.innerHTML = events.map(createPopupEventCard).join("");
  } catch (error) {
    console.error("Unable to load the public Google Calendar:", error);
    renderCalendarError(container);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-book]").forEach((el) => {
    el.classList.add("anywhere-book-now-button");
    el.setAttribute("data-booking-url", SETMORE_URL);
    el.setAttribute("data-new-tab", "false");
    el.setAttribute("href", SETMORE_URL);
    el.setAttribute("rel", "noopener");
  });

  if (!document.getElementById("anywhere_book_now_script")) {
    const script = document.createElement("script");
    script.id = "anywhere_book_now_script";
    script.src = "https://assets.setmore.com/integration/book-now/live/v1/anywhere-book-now.js";
    document.body.appendChild(script);
  }

  document.querySelectorAll("[data-ig]").forEach((el) => {
    el.setAttribute("href", INSTAGRAM_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach((el) => observer.observe(el));
  }

  loadPopupEvents();
  window.setInterval(loadPopupEvents, CALENDAR_REFRESH_MINUTES * 60 * 1000);
});
