/* ============================================================
   micaheckert.ca — scripts
   ============================================================ */

'use strict';

/* ----- Gallery data ----- */
const photos = [
  {
    src: 'Photos/DSC05240.JPG',
    caption: 'Arctic coastal cliffs from the air, Yukon'
  },
  {
    src: 'Photos/DJI_20250801232636_0079_D_Original.jpg',
    caption: 'Field station on Qikiqtaruk (Herschel Island) at golden hour'
  },
  {
    src: 'Photos/DSCF8684.JPG',
    caption: 'On the tundra, Yukon'
  },
  {
    src: 'Photos/DSCF8690.JPG',
    caption: 'Arctic fieldwork, Yukon'
  },
  {
    src: 'Photos/DJI_20250806140757_0256_D.JPG',
    caption: 'Field team at the helicopter, Arctic fieldwork 2025'
  },
  {
    src: 'Photos/DSCF9071.JPG',
    caption: 'Field team beside the Pilatus Porter on the glacier'
  },
  {
    src: 'Photos/DSC05940.JPG',
    caption: 'Monitoring coastal flooding at Qikiqtaruk, Yukon'
  },
  {
    src: 'Photos/DSCF8325.JPG',
    caption: 'Sea ice, Yukon Arctic coast'
  },
  {
    src: 'Photos/DSCF8259.JPG',
    caption: 'Permafrost thaw and coastal erosion, Yukon'
  },
  {
    src: 'Photos/DSCF8305.JPG',
    caption: 'Processing drone data in the field'
  },
  {
    src: 'Photos/IMG_1710.jpg',
    caption: 'Ready to fly — drone operations in the Arctic'
  },
];


/* ============================================================
   Build the gallery
   ============================================================ */
(function buildGallery() {
  const galleryEl = document.getElementById('gallery');
  if (!galleryEl) return;

  /* On the main page (index.html) only show the first 4 photos as a teaser */
  const isFeatured = galleryEl.classList.contains('gallery-featured');
  const displayPhotos = isFeatured ? photos.slice(0, 4) : photos;

  displayPhotos.forEach(function(photo, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', photo.caption);

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';

    item.appendChild(img);
    item.appendChild(overlay);
    galleryEl.appendChild(item);

    item.addEventListener('click', function() { openLightbox(index); });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });
})();


/* ============================================================
   Lightbox
   ============================================================ */
var currentLbIndex = 0;
var lightbox   = document.getElementById('lightbox');
var lbImg      = document.getElementById('lb-img');
var lbCaption  = document.getElementById('lb-caption');
var lbClose    = document.getElementById('lb-close');
var lbPrev     = document.getElementById('lb-prev');
var lbNext     = document.getElementById('lb-next');

function openLightbox(index) {
  currentLbIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  var photo = photos[currentLbIndex];
  lbImg.src = photo.src;
  lbImg.alt = photo.caption;
  lbCaption.textContent = photo.caption;
}

function prevPhoto() {
  currentLbIndex = (currentLbIndex - 1 + photos.length) % photos.length;
  updateLightbox();
}

function nextPhoto() {
  currentLbIndex = (currentLbIndex + 1) % photos.length;
  updateLightbox();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevPhoto);
lbNext.addEventListener('click', nextPhoto);

lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  prevPhoto();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'Escape')     closeLightbox();
});


/* ============================================================
   Navbar — solid on scroll
   ============================================================ */
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   Mobile hamburger menu
   ============================================================ */
(function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  function toggleMenu() {
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close on Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu();
      hamburger.focus();
    }
  });
})();


/* ============================================================
   CV PDF embed — show placeholder if PDF not yet available
   ============================================================ */
(function initCvEmbed() {
  var frame = document.querySelector('.cv-inset-embed iframe');
  if (!frame) return;

  fetch('Eckert_CV.pdf', { method: 'HEAD' })
    .then(function(r) {
      if (!r.ok) showPlaceholder();
    })
    .catch(showPlaceholder);

  function showPlaceholder() {
    frame.style.display = 'none';
    var ph = document.createElement('div');
    ph.className = 'cv-embed-placeholder';
    ph.innerHTML = '<p>// Add <strong>Eckert_CV.pdf</strong> to the website folder to enable preview</p>';
    frame.parentNode.appendChild(ph);
  }
})();


/* ============================================================
   PDF Modal — Verkaik et al. 2025
   ============================================================ */
(function initPdfModal() {
  var modal    = document.getElementById('pdf-modal');
  var closeBtn = document.getElementById('pdf-modal-close');
  var modalObj = document.getElementById('pdf-modal-iframe');
  var openBtn  = document.getElementById('open-pdf-btn');
  if (!modal) return;

  function openModal() {
    if (modalObj && (!modalObj.getAttribute('data') || modalObj.getAttribute('data') === '')) {
      modalObj.setAttribute('data', 'verkaik2025.pdf');
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();


/* ============================================================
   Video Modal — Introductory video
   ============================================================ */
(function initVideoModal() {
  var modal    = document.getElementById('video-modal');
  var closeBtn = document.getElementById('video-modal-close');
  var player   = document.getElementById('video-modal-player');
  var openBtn  = document.getElementById('open-video-btn');
  if (!modal || !openBtn) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (player) { player.pause(); }
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();


/* ============================================================
   Photography slideshow — Western Arctic
   ============================================================ */
(function initSlideshow() {
  var slides = document.querySelectorAll('.slideshow-img');
  var dots   = document.querySelectorAll('.slideshow-dot');
  if (!slides.length) return;

  var current = 0;
  var timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function advance() { goTo((current + 1) % slides.length); }

  function startTimer() { timer = setInterval(advance, 5000); }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });

  startTimer();
})();


/* ============================================================
   Scroll-reveal (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  var allFadeEls = document.querySelectorAll('.fade-in');

  if (!('IntersectionObserver' in window)) {
    allFadeEls.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  allFadeEls.forEach(function(el) { observer.observe(el); });

  /* Safety fallback: any element still invisible after 800ms becomes visible.
     This handles direct-hash navigation where items are already in the viewport
     before the observer has a chance to fire. */
  setTimeout(function() {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(function(el) {
      el.classList.add('visible');
    });
  }, 800);
})();


/* ============================================================
   Hero banner video — slow playback
   ============================================================ */
(function initHeroVideoSpeed() {
  var heroVideo = document.querySelector('#home video');
  if (!heroVideo) return;
  heroVideo.playbackRate = 0.75;
  heroVideo.addEventListener('play', function() {
    heroVideo.playbackRate = 0.75;
  });
})();
