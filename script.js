const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const form = document.querySelector(".estimate-form");
const phoneInput = document.querySelector('input[name="phone"]');

if (window.lucide) {
  window.lucide.createIcons();
} else {
  window.addEventListener("load", () => window.lucide?.createIcons());
}

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

phoneInput?.addEventListener("input", (event) => {
  const value = event.target.value.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
  const digits = value.startsWith("7") ? value.slice(1) : value;
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ];

  let next = "+7";
  if (parts[0]) next += ` (${parts[0]}`;
  if (parts[0]?.length === 3) next += ")";
  if (parts[1]) next += ` ${parts[1]}`;
  if (parts[2]) next += `-${parts[2]}`;
  if (parts[3]) next += `-${parts[3]}`;

  event.target.value = next;
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = form.querySelector(".form-status");
  status.textContent = "Заявка принята. Специалист свяжется с вами в ближайшее время.";
  form.reset();
});

const revealItems = document.querySelectorAll(
  [
    ".hero-copy .eyebrow",
    ".hero-copy h1",
    ".hero-copy .lead",
    ".hero-actions",
    ".hero-proof",
    ".section-heading .eyebrow",
    ".section-heading h2",
    ".facts-grid article",
    ".object-strip article",
    ".steps article",
    ".trust-panel h2",
    ".trust-panel li",
    ".contact-panel",
  ].join(", "),
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
