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

const galleryFrames = Array.from(document.querySelectorAll(".gallery-frame"));

if (galleryFrames.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Close expanded image">X</button>
    <img class="gallery-lightbox-img" alt="" />
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-img");
  const closeButton = lightbox.querySelector(".gallery-lightbox-close");
  let lastActiveElement = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    lastActiveElement?.focus();
  };

  const openLightbox = (image) => {
    lastActiveElement = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  galleryFrames.forEach((frame) => {
    const image = frame.querySelector("img");
    if (!image) return;

    frame.tabIndex = 0;
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", `Open image: ${image.alt}`);

    frame.addEventListener("click", () => openLightbox(image));
    frame.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(image);
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === closeButton) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
