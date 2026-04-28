const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

function closeLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.classList.remove("lightbox-open");
}

function openLightbox(button) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  const src = button.dataset.fullSrc;
  const caption = button.dataset.caption || "";
  if (!src) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

document.querySelectorAll(".image-button").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
