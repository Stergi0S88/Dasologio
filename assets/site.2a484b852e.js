const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu.toggleAttribute('data-open', !open);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.removeAttribute('data-open');
  }));
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const landingHeader = document.querySelector('[data-landing-header]');
if (landingHeader) {
  const updateHeader = () => landingHeader.classList.toggle('is-scrolled', window.scrollY > 50);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (landingHeader) return;
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

let lastModalTrigger;
function closeModal(modal) {
  if (!modal) return;
  modal.removeAttribute('data-open');
  document.body.classList.remove('modal-open');
  lastModalTrigger?.focus();
}

document.querySelectorAll('[data-modal-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modalOpen);
    if (!modal) return;
    lastModalTrigger = button;
    modal.setAttribute('data-open', '');
    document.body.classList.add('modal-open');
    modal.querySelector('button, input, textarea, a')?.focus();
  });
});

document.querySelectorAll('.landing-modal').forEach((modal) => {
  modal.querySelector('[data-modal-close]')?.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal(document.querySelector('.landing-modal[data-open]'));
});

const planTourModal = document.getElementById('plan-tour-modal');
if (planTourModal) {
  const storageKey = 'dasologio-plan-tour';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const openPlanTour = (trigger) => {
    lastModalTrigger = trigger || lastModalTrigger;
    planTourModal.setAttribute('data-open', '');
    document.body.classList.add('modal-open');
    planTourModal.querySelector('button, input, textarea, select')?.focus();
  };
  planTourModal.addEventListener('click', () => sessionStorage.setItem(storageKey, '1'));
  planTourModal.querySelector('[data-modal-close]')?.addEventListener('click', () => sessionStorage.setItem(storageKey, '1'));
  if (!sessionStorage.getItem(storageKey) && !reducedMotion) {
    window.setTimeout(() => {
      if (!sessionStorage.getItem(storageKey)) openPlanTour();
    }, 700);
  }
}

const readingArticle = document.querySelector('[data-article]');
const readingProgress = document.querySelector('[data-reading-progress]');
if (readingArticle && readingProgress) {
  const updateReadingProgress = () => {
    const articleTop = readingArticle.offsetTop;
    const available = Math.max(1, readingArticle.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, (window.scrollY - articleTop) / available));
    readingProgress.style.width = `${progress * 100}%`;
  };
  updateReadingProgress();
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);
}

const search = document.querySelector('[data-blog-search]');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-post-card]')];
const empty = document.querySelector('[data-empty-state]');
let selectedCategory = 'all';

function updatePosts() {
  if (!cards.length) return;
  const query = (search?.value || '').trim().toLocaleLowerCase('el');
  let visible = 0;

  cards.forEach((card) => {
    const categoryMatch = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const textMatch = !query || card.textContent.toLocaleLowerCase('el').includes(query);
    const show = categoryMatch && textMatch;
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (empty) empty.hidden = visible !== 0;
}

search?.addEventListener('input', updatePosts);
filters.forEach((button) => button.addEventListener('click', () => {
  selectedCategory = button.dataset.filter;
  filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  updatePosts();
}));

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = 'true';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('[data-reveal]').forEach((item) => {
  if (revealObserver) revealObserver.observe(item);
  else item.dataset.visible = 'true';
});

function loadDeferredAnalytics(banner) {
  const provider = banner.dataset.analyticsProvider;
  if (provider === 'plausible' && banner.dataset.plausibleDomain) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = banner.dataset.plausibleDomain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.append(script);
  }
  if (provider === 'ga4' && /^G-[A-Z0-9]{6,20}$/.test(banner.dataset.gaId || '')) {
    const id = banner.dataset.gaId;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
  }
}

const cookieBanner = document.querySelector('[data-cookie-banner]');
if (cookieBanner) {
  const key = 'dasologio-consent';
  if (localStorage.getItem(key) === 'accepted') {
    loadDeferredAnalytics(cookieBanner);
    cookieBanner.remove();
  } else {
    cookieBanner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      localStorage.setItem(key, 'accepted');
      loadDeferredAnalytics(cookieBanner);
      cookieBanner.remove();
    });
  }
}
