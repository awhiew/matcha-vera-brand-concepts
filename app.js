const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
let lightboxHistoryEntryOpen = false;

function isLightboxOpen() {
  return Boolean(lightbox && !lightbox.hidden);
}

function getLightboxState(src, caption) {
  return {
    ...(history.state || {}),
    lightbox: true,
    lightboxSrc: src,
    lightboxCaption: caption,
  };
}

function syncLightboxHistory(src, caption) {
  if (!window.history?.pushState) return;

  const state = getLightboxState(src, caption);

  if (lightboxHistoryEntryOpen) {
    history.replaceState(state, "", window.location.href);
    return;
  }

  history.pushState(state, "", window.location.href);
  lightboxHistoryEntryOpen = true;
}

function closeLightbox({ syncHistory = true } = {}) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.classList.remove("lightbox-open");

  if (syncHistory && lightboxHistoryEntryOpen && window.history?.back) {
    lightboxHistoryEntryOpen = false;
    history.back();
  }
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
  syncLightboxHistory(src, caption);
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

window.addEventListener("popstate", () => {
  if (!isLightboxOpen()) {
    lightboxHistoryEntryOpen = false;
    return;
  }

  lightboxHistoryEntryOpen = false;
  closeLightbox({ syncHistory: false });
});
