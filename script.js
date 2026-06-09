const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = Array.from(document.querySelectorAll(".nav-link"));
const sections = navItems
  .map((link) => {
    const href = link.getAttribute("href");
    return href?.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.08, 0.2, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll(".hero-collage .photo").forEach((photo) => {
  photo.addEventListener("pointermove", (event) => {
    const rect = photo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    photo.style.setProperty("--tilt-x", `${x * 4}deg`);
    photo.style.setProperty("--tilt-y", `${y * -4}deg`);
  });

  photo.addEventListener("pointerleave", () => {
    photo.style.removeProperty("--tilt-x");
    photo.style.removeProperty("--tilt-y");
  });
});
