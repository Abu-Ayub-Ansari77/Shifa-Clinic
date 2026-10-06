const serviceGroups = [
  { title: "Consultation & Care", icon: "✳", items: ["Patient Counselling", "Online Counselling", "Doctor On Call", { name: "Open 24×7", note: "Emergency availability" }, "Emergency Service", { name: "24 Hours Emergency Service", note: "Emergency availability" }] },
  { title: "Women’s & Family Care", icon: "♡", items: ["Women's Care", "Pregnancy Care", "Preconceptional Counselling", "Growth Monitoring"] },
  { title: "Wellness & Nutrition", icon: "◌", items: ["Dietary Counselling", "Dietitian Service", "Nutrition Counselling", "Weight Loss Counselling", "Weight Gain Diet Counselling"] },
  { title: "Home & Nursing Care", icon: "⌂", items: ["Home Care Visits", "Nursing Care", "Nursing Care at Home", "Bandaging"] },
  { title: "Health Monitoring", icon: "+", items: ["Blood Pressure Check-Up", "Sugar Check Up", "Thyroid Care"] },
  { title: "Specialized Services", icon: "✳", items: ["Sterile Ear Piercing", "Ayurvedic Services"] },
];

const serviceGroupsRoot = document.querySelector("#service-groups");
serviceGroupsRoot.innerHTML = serviceGroups.map((group, index) => {
  const panelId = `service-group-${index + 1}`;
  const rows = group.items.map((item) => {
    const name = typeof item === "string" ? item : item.name;
    const note = typeof item === "string" ? "" : `<small>${item.note}</small>`;
    return `<li><span class="service-check" aria-hidden="true">✓</span><span>${name}${note}</span></li>`;
  }).join("");
  return `<article class="service-category reveal"><button class="service-category-toggle" type="button" aria-expanded="false" aria-controls="${panelId}"><span class="service-category-icon" aria-hidden="true">${group.icon}</span><span class="service-category-title">${group.title}<small>${String(group.items.length).padStart(2, "0")} SERVICES</small></span><span class="service-category-plus" aria-hidden="true">+</span></button><ul class="service-category-items" id="${panelId}" hidden>${rows}</ul></article>`;
}).join("");

serviceGroupsRoot.addEventListener("click", (event) => {
  const button = event.target.closest(".service-category-toggle");
  if (!button) return;
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  document.getElementById(button.getAttribute("aria-controls")).hidden = expanded;
});

const careTabs = [...document.querySelectorAll('[role="tab"]')];
function activateCareTab(tab) {
  careTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    item.classList.toggle("is-active", selected);
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  });
  tab.focus();
}
careTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCareTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    activateCareTab(careTabs[(index + (event.key === "ArrowRight" ? 1 : -1) + careTabs.length) % careTabs.length]);
  });
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});

nav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const heroSection = document.querySelector(".hero");
document.body.classList.add("hero-visible");
if ("IntersectionObserver" in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle("hero-visible", entry.isIntersecting);
  }, { threshold: 0.08 });
  heroObserver.observe(heroSection);
} else {
  const setHeroState = () => document.body.classList.toggle("hero-visible", window.scrollY < heroSection.offsetHeight * 0.9);
  window.addEventListener("scroll", setHeroState, { passive: true });
}
const setScrollState = () => {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", scrolled);
  document.body.classList.toggle("has-scrolled", scrolled);
};
setScrollState();
window.addEventListener("scroll", setScrollState, { passive: true });

requestAnimationFrame(() => document.body.classList.add("page-ready"));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });
  revealItems.forEach((item) => observer.observe(item));
}
