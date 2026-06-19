// Gallery lightbox controller
// Auto-initializes on pages that contain #glLightbox.

(function () {
  const lightbox = document.getElementById('glLightbox');
  if (!lightbox) return;

  const imgEl = document.getElementById('glLightboxImg');
  const captionEl = document.getElementById('glLightboxCaption');

  const closeBtn = document.getElementById('glLightboxClose');
  const prevBtn = document.getElementById('glLightboxPrev');
  const nextBtn = document.getElementById('glLightboxNext');

  const thumbnails = Array.from(document.querySelectorAll('main .pictures img'));
  if (!imgEl || !captionEl || !closeBtn || thumbnails.length === 0) return;

  let index = 0;
  let lastFocus = null;

  function openAt(i) {
    index = (i + thumbnails.length) % thumbnails.length;

    const thumb = thumbnails[index];
    const src = thumb.getAttribute('data-full') || thumb.getAttribute('src');
    const alt = (thumb.getAttribute('data-caption') || thumb.getAttribute('alt') || '').trim();

    imgEl.src = src;
    imgEl.alt = alt || 'Gallery image';
    captionEl.textContent = alt || '';

    lastFocus = document.activeElement;

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    closeBtn.focus();
  }

  function close() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    imgEl.src = '';

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function showNext(delta) {
    openAt(index + delta);
  }

  thumbnails.forEach((thumb, i) => {
    thumb.addEventListener('click', () => openAt(i));
  });

  closeBtn.addEventListener('click', close);

  // Click outside dialog (on overlay)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => showNext(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => showNext(1));

  document.addEventListener('keydown', (e) => {
    const isOpen = lightbox.getAttribute('aria-hidden') === 'false';
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showNext(-1);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNext(1);
      return;
    }
  });

  // Ensure initial hidden state.
  if (lightbox.getAttribute('aria-hidden') === null) {
    lightbox.setAttribute('aria-hidden', 'true');
  }
})();

