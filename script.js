const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const estimateModal = document.querySelector(".estimate-modal");
const estimateTriggers = document.querySelectorAll(".estimate-trigger");
const modalCloseControls = document.querySelectorAll("[data-modal-close]");
const forms = document.querySelectorAll(".estimate-form");
const phoneInputs = document.querySelectorAll('input[name="phone"]');

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
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");

    if (!hash?.startsWith("#")) return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();

    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    const top =
      hash === "#top"
        ? 0
        : Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerHeight - 18);

    window.scrollTo({ top, behavior: "smooth" });
    window.history.pushState(null, "", hash);
  });
});

const formatPhoneInput = (event) => {
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
};

phoneInputs.forEach((input) => {
  input.addEventListener("input", formatPhoneInput);
});

const openEstimateModal = () => {
  if (!estimateModal) return;
  estimateModal.hidden = false;
  document.body.classList.add("modal-open");
  header.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  window.lucide?.createIcons();
  estimateModal.querySelector("select, input, button")?.focus();
};

const closeEstimateModal = () => {
  if (!estimateModal) return;
  estimateModal.hidden = true;
  document.body.classList.remove("modal-open");
};

estimateTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openEstimateModal();
  });
});

modalCloseControls.forEach((control) => {
  control.addEventListener("click", closeEstimateModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !estimateModal?.hidden) {
    closeEstimateModal();
  }
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    status.textContent = "Заявка принята. Специалист свяжется с вами в ближайшее время.";
    form.reset();
  });
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
