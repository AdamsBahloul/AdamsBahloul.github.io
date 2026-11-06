/**
 * =============================================================================
 * PORTFOLIO CLIENT ENGINE - ADAM BAHLOUL
 * Handles: Hero crosshairs, Project modal, Drawer navigation, Clocks, Accessibility
 * =============================================================================
 */

(function () {
  'use strict';

  // Retrieve central portfolio data
  const data = window.portfolioData || {};
  const { projects = [], playground = [], personal = {} } = data;

  // State management
  let currentModalType = null; // 'project' | 'playground'
  let currentModalIndex = 0;
  let modalImageInterval = null;
  let currentModalFrameIndex = 0;
  let isDrawerOpen = false;

  // DOM Elements
  const heroSection = document.querySelector('.home-hero-section');
  const crosshairV = document.querySelector('.crosshair-v');
  const crosshairH = document.querySelector('.crosshair-h');
  const crosshairText = document.querySelector('.crosshair-text');
  const pointerImage = document.querySelector('.pointer-image');
  const pointerImgTag = pointerImage ? pointerImage.querySelector('img') : null;
  const pointerText = pointerImage ? pointerImage.querySelector('.pointer-text') : null;

  const navbar = document.querySelector('.navbar');
  const navToggle = navbar ? navbar.querySelector('.right') : null;
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];
  const drawerPreviewImg = document.getElementById('drawer-preview-img');

  const workWrappers = document.querySelectorAll('.work-wrapper');
  const playgroundItems = document.querySelectorAll('.playground-grid-item');

  const workModal = document.querySelector('.work-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalRole = document.getElementById('modal-role');
  const modalTech = document.getElementById('modal-tech');
  const modalLink = document.getElementById('modal-link');
  const modalImageContainer = document.getElementById('modal-image-container');
  const modalBgImage = document.getElementById('modal-bg-image');
  const modalBtnPrev = document.getElementById('modal-btn-prev');
  const modalBtnNext = document.getElementById('modal-btn-next');
  const modalCloseBtns = document.querySelectorAll('.work-modal .close-btn');

  const heroClock = document.querySelector('.live-clock');
  const footerClock = document.querySelector('.live-footer-clock');
  const backToTopBtns = document.querySelectorAll('.back-to-top, .back-to-top-btn');

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===========================================================================
  // 1. Synchronize Card Titles & Content with portfolioData
  // ===========================================================================
  function syncCardsWithData() {
    // Sync project cards
    workWrappers.forEach((wrapper, idx) => {
      const proj = projects[idx];
      if (!proj) return;
      const titleEl = wrapper.querySelector('.title');
      if (titleEl) titleEl.textContent = proj.title;
      const tagEl = wrapper.querySelector('.tag');
      if (tagEl) tagEl.textContent = proj.category;
      const roleEl = wrapper.querySelector('.role');
      if (roleEl) roleEl.textContent = `Role: ${proj.role}`;
    });

    // Sync playground cards
    playgroundItems.forEach((item, idx) => {
      const exp = playground[idx];
      if (!exp) return;
      const titleEl = item.querySelector('.title');
      if (titleEl) titleEl.textContent = exp.title;
      const typeEl = item.querySelector('.type');
      if (typeEl) typeEl.textContent = exp.description;
    });
  }
  syncCardsWithData();

  // ===========================================================================
  // 2. Live Clocks (Hero & Footer)
  // ===========================================================================
  function updateClocks() {
    try {
      const now = new Date();
      // CET Timezone
      const formatterCET = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const parts = formatterCET.format(now);
      const timeShort = parts.slice(0, 5); // HH:MM

      if (heroClock) {
        heroClock.textContent = `Current time: ${timeShort} CET`;
      }
      if (footerClock) {
        footerClock.textContent = `CET - ${parts}`;
      }
    } catch (e) {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      if (heroClock) heroClock.textContent = `Current time: ${timeStr} CET`;
      if (footerClock) footerClock.textContent = `CET - ${timeStr}:${pad(d.getSeconds())}`;
    }
  }

  setInterval(updateClocks, 1000);
  updateClocks();

  // ===========================================================================
  // 3. Hero Section Crosshairs & Cursor Tracker
  // ===========================================================================
  if (heroSection && !prefersReducedMotion && window.innerWidth > 1024) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;
    let isInsideHero = false;

    const heroPreviews = [
      { img: './assets/images/hero-preview-1.svg', text: '[ Embedded Systems ]' },
      { img: './assets/images/hero-preview-2.svg', text: '[ Robotics & AI ]' },
      { img: './assets/images/hero-preview-3.svg', text: '[ Computer Vision ]' },
      { img: './assets/images/hero-preview-4.svg', text: '[ Creative Engineering ]' },
    ];
    let previewIndex = 0;

    heroSection.addEventListener('mouseenter', () => {
      isInsideHero = true;
      if (crosshairV) crosshairV.style.opacity = '0.85';
      if (crosshairH) crosshairH.style.opacity = '0.85';
      if (pointerImage) pointerImage.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', () => {
      isInsideHero = false;
      if (crosshairV) crosshairV.style.opacity = '0';
      if (crosshairH) crosshairH.style.opacity = '0';
      if (pointerImage) pointerImage.style.opacity = '0';
    });

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Cycle preview card based on horizontal position
      const sector = Math.floor((targetX / rect.width) * heroPreviews.length);
      const safeSector = Math.max(0, Math.min(heroPreviews.length - 1, sector));
      if (safeSector !== previewIndex) {
        previewIndex = safeSector;
        if (pointerImgTag) pointerImgTag.src = heroPreviews[previewIndex].img;
        if (pointerText) pointerText.textContent = heroPreviews[previewIndex].text;
      }
    });

    function renderHeroCursor() {
      if (isInsideHero) {
        // Smooth lerp
        mouseX += (targetX - mouseX) * 0.15;
        mouseY += (targetY - mouseY) * 0.15;

        if (crosshairV) {
          crosshairV.style.transform = `translate(-50%, 0) translate3d(${mouseX}px, 0, 0)`;
        }
        if (crosshairH) {
          crosshairH.style.transform = `translate(0, -50%) translate3d(0, ${mouseY}px, 0)`;
        }
        if (pointerImage) {
          pointerImage.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
      }
      requestAnimationFrame(renderHeroCursor);
    }
    renderHeroCursor();
  }

  // ===========================================================================
  // 4. Navigation Drawer (Hamburger Menu & Overlay)
  // ===========================================================================
  function toggleDrawer(open) {
    isDrawerOpen = typeof open === 'boolean' ? open : !isDrawerOpen;
    if (drawer) {
      drawer.classList.toggle('open', isDrawerOpen);
      drawer.setAttribute('aria-hidden', String(!isDrawerOpen));
    }
    if (navToggle) {
      navToggle.classList.toggle('open', isDrawerOpen);
      navToggle.setAttribute('aria-expanded', String(isDrawerOpen));
    }
    if (drawerOverlay) {
      drawerOverlay.classList.toggle('open', isDrawerOpen);
    }
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
    navToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDrawer();
      }
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const previewSrc = link.getAttribute('data-preview');
      if (previewSrc && drawerPreviewImg) {
        drawerPreviewImg.src = previewSrc;
      }
      drawerLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });

    link.addEventListener('click', (e) => {
      toggleDrawer(false);
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  // ===========================================================================
  // 5. Selected Work Cards — Hover Image Carousel
  // ===========================================================================
  workWrappers.forEach((wrapper, index) => {
    const images = wrapper.querySelectorAll('.work-image');
    let hoverInterval = null;
    let currentIdx = 0;

    wrapper.addEventListener('mouseenter', () => {
      if (images.length <= 1 || prefersReducedMotion) return;
      hoverInterval = setInterval(() => {
        images[currentIdx].style.opacity = '0';
        currentIdx = (currentIdx + 1) % images.length;
        images[currentIdx].style.opacity = '1';
      }, 750);
    });

    wrapper.addEventListener('mouseleave', () => {
      if (hoverInterval) clearInterval(hoverInterval);
      images.forEach((img, i) => {
        img.style.opacity = i === 0 ? '1' : '0';
      });
      currentIdx = 0;
    });

    // Click to open project modal
    wrapper.addEventListener('click', () => {
      openModal('project', index);
    });

    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('project', index);
      }
    });
  });

  // ===========================================================================
  // 6. Playground Grid Items — Click to Open Experiment Modal
  // ===========================================================================
  playgroundItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openModal('playground', index);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('playground', index);
      }
    });
  });

  // ===========================================================================
  // 7. Work & Experiment Modal Engine
  // ===========================================================================
  function openModal(type, index) {
    currentModalType = type;
    const list = type === 'project' ? projects : playground;
    if (!list || !list[index]) return;

    currentModalIndex = index;
    renderModalContent();

    if (workModal) {
      workModal.classList.add('active');
      workModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus close button for accessibility
      const closeBtn = workModal.querySelector('.close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal() {
    if (modalImageInterval) {
      clearInterval(modalImageInterval);
      modalImageInterval = null;
    }
    if (workModal) {
      workModal.classList.remove('active');
      workModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function renderModalContent() {
    if (modalImageInterval) {
      clearInterval(modalImageInterval);
      modalImageInterval = null;
    }

    const isProject = currentModalType === 'project';
    const list = isProject ? projects : playground;
    const item = list[currentModalIndex];
    if (!item) return;

    // Header & Description
    if (modalTitle) modalTitle.textContent = item.title;
    
    if (modalDesc) {
      if (isProject) {
        modalDesc.innerHTML = `
          <p style="margin-bottom: 14px; font-weight: 400; font-size: 1.6rem;">${item.summary}</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p><strong>Problem:</strong> ${item.problem}</p>
            <p><strong>Contribution:</strong> ${item.contribution}</p>
            <p><strong>Implementation:</strong> ${item.implementation}</p>
          </div>
        `;
      } else {
        modalDesc.innerHTML = `
          <p style="margin-bottom: 14px; font-weight: 400; font-size: 1.6rem;">${item.description}</p>
          <p><strong>Technical Scope:</strong> ${item.details}</p>
        `;
      }
    }

    // Role & Tech
    if (modalRole) {
      modalRole.textContent = isProject ? `Role: ${item.role}` : `Type: ${item.type}`;
    }

    if (modalTech) {
      const techList = isProject ? item.technologies : item.tags;
      if (Array.isArray(techList)) {
        modalTech.innerHTML = techList
          .map((t) => `<span class="modal-tech-badge">${t}</span>`)
          .join(' ');
      } else {
        modalTech.textContent = techList || '';
      }
    }

    // Project Link
    if (modalLink) {
      const href = item.link || '#';
      modalLink.href = href;
      modalLink.setAttribute('aria-label', `Visit ${item.title}`);
      const visitLabel = modalLink.querySelector('.visit-site');
      if (visitLabel) {
        visitLabel.textContent = href.includes('TODO') ? 'Visit / Repo (TODO)' : 'Visit Project';
      }

      modalLink.onclick = (e) => {
        if (href.includes('TODO')) {
          e.preventDefault();
          alert(`Placeholder Link Notice:\n${href}\n\nYou can set your actual repository or project URL in src/data/portfolio.js under projects[${currentModalIndex}].link`);
        }
      };
    }

    // Images & Carousel
    const imageList = isProject ? (item.images || [item.bgImage]) : [item.thumbnail];
    currentModalFrameIndex = 0;

    if (modalImageContainer) {
      modalImageContainer.innerHTML = '';
      imageList.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${item.title} preview frame ${idx + 1}`;
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.opacity = idx === 0 ? '1' : '0';
        img.style.transition = 'opacity 0.4s ease';
        modalImageContainer.appendChild(img);
      });

      if (imageList.length > 1 && !prefersReducedMotion) {
        modalImageInterval = setInterval(() => {
          const imgs = modalImageContainer.querySelectorAll('img');
          if (imgs.length > 0) {
            imgs[currentModalFrameIndex].style.opacity = '0';
            currentModalFrameIndex = (currentModalFrameIndex + 1) % imgs.length;
            imgs[currentModalFrameIndex].style.opacity = '1';
          }
        }, 2200);
      }
    }

    if (modalBgImage) {
      modalBgImage.src = isProject ? item.bgImage : item.thumbnail;
    }

    // Prev / Next button states
    if (modalBtnPrev) {
      modalBtnPrev.disabled = currentModalIndex === 0;
      modalBtnPrev.classList.toggle('disabled', currentModalIndex === 0);
    }
    if (modalBtnNext) {
      const maxIdx = list.length - 1;
      modalBtnNext.disabled = currentModalIndex === maxIdx;
      modalBtnNext.classList.toggle('disabled', currentModalIndex === maxIdx);
    }
  }

  // Prev / Next Button Listeners
  if (modalBtnPrev) {
    modalBtnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentModalIndex > 0) {
        currentModalIndex--;
        renderModalContent();
      }
    });
  }

  if (modalBtnNext) {
    modalBtnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const list = currentModalType === 'project' ? projects : playground;
      if (currentModalIndex < list.length - 1) {
        currentModalIndex++;
        renderModalContent();
      }
    });
  }

  // Modal Close Listeners
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  });

  if (workModal) {
    workModal.addEventListener('click', (e) => {
      if (e.target === workModal) {
        closeModal();
      }
    });
  }

  // Keyboard Navigation: Escape to close, Arrows to paginate
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (workModal && workModal.classList.contains('active')) {
        closeModal();
      }
      if (isDrawerOpen) {
        toggleDrawer(false);
      }
    }

    if (workModal && workModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft' && modalBtnPrev && !modalBtnPrev.disabled) {
        modalBtnPrev.click();
      }
      if (e.key === 'ArrowRight' && modalBtnNext && !modalBtnNext.disabled) {
        modalBtnNext.click();
      }
    }
  });

  // ===========================================================================
  // 8. Back To Top
  // ===========================================================================
  backToTopBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    });
  });

  // ===========================================================================
  // 9. Informative handler for TODO email / links
  // ===========================================================================
  document.querySelectorAll('a[href^="mailto:TODO"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Email link placeholder notice:\n\nPlease update your verified email address in src/data/portfolio.js under contact.email.');
    });
  });

  document.querySelectorAll('a[href^="TODO:"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const rawHref = link.getAttribute('href');
      alert(`Placeholder link notice:\n${rawHref}\n\nPlease update your verified link in src/data/portfolio.js under contact.`);
    });
  });

  console.log('Adam Bahloul Portfolio Client Engine initialized successfully.');
})();
