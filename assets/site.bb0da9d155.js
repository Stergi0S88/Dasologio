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
    const mapFrame = modal.querySelector('iframe[data-map-src]');
    if (mapFrame && !mapFrame.getAttribute('src')) mapFrame.src = mapFrame.dataset.mapSrc;
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

const newsletterForm = document.querySelector('[data-mailerlite-newsletter]');
if (newsletterForm) {
  const thanks = newsletterForm.parentElement.querySelector('.newsletter-thanks');
  const error = newsletterForm.parentElement.querySelector('.newsletter-error');
  const submit = newsletterForm.querySelector('button[type="submit"]');
  newsletterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.hidden = true;
    error.textContent = '';
    submit.disabled = true;
    try {
      const response = await fetch(newsletterForm.action, {
        method: 'POST',
        body: new FormData(newsletterForm),
        headers: { Accept: 'application/json' },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success === false) {
        const emailError = payload?.errors?.fields?.email?.[0];
        error.textContent = emailError || (document.documentElement.lang === 'en' ? 'Could not subscribe. Try again.' : 'Η εγγραφή απέτυχε. Δοκιμάστε ξανά.');
        error.hidden = false;
        return;
      }
      newsletterForm.hidden = true;
      thanks.hidden = false;
      newsletterForm.reset();
    } catch {
      error.textContent = document.documentElement.lang === 'en' ? 'Could not subscribe. Try again.' : 'Η εγγραφή απέτυχε. Δοκιμάστε ξανά.';
      error.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
}

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

const booker = document.querySelector('[data-eco-booker]');
if (booker) {
  const locale = booker.dataset.uiLang === 'en' ? 'en-GB' : 'el-GR';
  const peopleInput = booker.querySelector('[name="participants"]');
  const dateInput = booker.querySelector('[name="date"]');
  const peopleLabel = booker.querySelector('[data-people-label]');
  const dateLabel = booker.querySelector('[data-date-label]');
  const peopleCount = booker.querySelector('[data-people-count]');
  const peoplePop = booker.querySelector('[data-people-pop]');
  const details = booker.querySelector('[data-booker-details]');
  const layer = document.querySelector('[data-calendar-layer]');
  const monthsEl = layer?.querySelector('[data-cal-months]');
  const maxPeople = Number(peopleInput?.getAttribute('max') || 10);
  let available = [];
  try { available = JSON.parse(booker.dataset.availableDates || '[]'); } catch { available = []; }
  const openSet = new Set(available);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  const pad = (value) => String(value).padStart(2, '0');
  const iso = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;
  const isOpen = (stamp) => {
    const date = new Date(`${stamp}T00:00:00`);
    if (date < today) return false;
    return openSet.size ? openSet.has(stamp) : true;
  };

  const setPeople = (count) => {
    const next = Math.min(maxPeople, Math.max(1, count));
    peopleInput.value = String(next);
    if (peopleCount) peopleCount.textContent = String(next);
    if (peopleLabel) peopleLabel.textContent = locale.startsWith('en') ? `Adult x ${next}` : `Ενήλικας × ${next}`;
  };

  const weekdayLabels = Array.from({ length: 7 }, (_, index) => new Date(2026, 5, 1 + index).toLocaleDateString(locale, { weekday: 'short' }));

  const renderCalendar = () => {
    if (!monthsEl) return;
    const count = window.matchMedia('(max-width: 720px)').matches ? 1 : 2;
    monthsEl.innerHTML = '';
    for (let offset = 0; offset < count; offset += 1) {
      const monthDate = new Date(view.getFullYear(), view.getMonth() + offset, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const start = (monthDate.getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < start; i += 1) cells.push('<span></span>');
      for (let day = 1; day <= days; day += 1) {
        const stamp = iso(year, month, day);
        const open = isOpen(stamp);
        const selected = dateInput.value === stamp ? ' is-selected' : '';
        cells.push(`<button class="eco-cal-day${selected}" type="button" data-stamp="${stamp}" ${open ? '' : 'disabled'}>${day}</button>`);
      }
      const week = weekdayLabels.map((label) => `<span>${label}</span>`).join('');
      const title = monthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
      monthsEl.insertAdjacentHTML('beforeend', `<section class="eco-cal-month"><h3>${title}</h3><div class="eco-cal-week">${week}</div><div class="eco-cal-grid">${cells.join('')}</div></section>`);
    }
  };

  const openCalendar = () => {
    if (!layer) return;
    layer.hidden = false;
    document.body.classList.add('modal-open');
    renderCalendar();
  };

  const closeCalendar = () => {
    if (!layer) return;
    layer.hidden = true;
    document.body.classList.remove('modal-open');
  };

  booker.querySelector('[data-open-people]')?.addEventListener('click', () => {
    peoplePop.hidden = !peoplePop.hidden;
  });
  peoplePop?.querySelectorAll('[data-people-step]').forEach((button) => {
    button.addEventListener('click', () => setPeople(Number(peopleInput.value) + Number(button.dataset.peopleStep)));
  });
  booker.querySelector('[data-open-calendar]')?.addEventListener('click', openCalendar);
  booker.querySelector('[data-check-availability]')?.addEventListener('click', openCalendar);
  layer?.addEventListener('click', (event) => { if (event.target === layer) closeCalendar(); });
  layer?.querySelector('[data-cal-prev]')?.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); });
  layer?.querySelector('[data-cal-next]')?.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); });
  monthsEl?.addEventListener('click', (event) => {
    const day = event.target.closest('[data-stamp]');
    if (!day || day.disabled) return;
    dateInput.value = day.dataset.stamp;
    const picked = new Date(`${day.dataset.stamp}T00:00:00`);
    dateLabel.textContent = picked.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    details.hidden = false;
    closeCalendar();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && layer && !layer.hidden) closeCalendar(); });
  booker.addEventListener('submit', (event) => {
    if (!dateInput.value || !isOpen(dateInput.value)) {
      event.preventDefault();
      openCalendar();
    }
  });
  setPeople(1);
}


const learningLightbox = document.querySelector('[data-learning-lightbox]');
if (learningLightbox) {
  const lightboxImage = learningLightbox.querySelector('[data-learning-lightbox-image]');
  const lightboxCaption = learningLightbox.querySelector('[data-learning-lightbox-caption]');
  document.querySelectorAll('[data-learning-media-open]').forEach((button) => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.src || '';
      lightboxImage.alt = button.dataset.alt || '';
      lightboxCaption.textContent = button.dataset.caption || '';
      if (typeof learningLightbox.showModal === 'function') learningLightbox.showModal();
    });
  });
  learningLightbox.querySelector('[data-learning-lightbox-close]')?.addEventListener('click', () => learningLightbox.close());
  learningLightbox.addEventListener('click', (event) => {
    if (event.target === learningLightbox) learningLightbox.close();
  });
}

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

const quoteRoot = document.querySelector('[data-quote-calculator]');
if (quoteRoot) {
  const catalogNode = document.getElementById('quote-catalog');
  const catalog = JSON.parse(catalogNode?.textContent || '{}');
  const form = quoteRoot.querySelector('[data-quote-form]');
  const money = (value) => `${Number(value).toLocaleString(document.documentElement.lang === 'en' ? 'en-GB' : 'el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  const itemBySlug = (slug) => (catalog.items || []).find((item) => item.slug === slug);
  const complexityBySlug = (slug) => (catalog.complexities || []).find((item) => item.slug === slug);
  const updateEstimate = () => {
    const item = itemBySlug(form.elements.namedItem('itemSlug').value);
    const complexity = complexityBySlug(form.elements.namedItem('complexity').value);
    const unitsInput = form.elements.namedItem('units');
    if (item) unitsInput.max = String(item.maxUnits);
    const units = Number(unitsInput.value);
    if (!item || !complexity || !Number.isFinite(units) || units < 0 || units > item.maxUnits) return;
    const net = Math.round((item.baseEur + units * item.perUnitEur) * complexity.multiplier * 100) / 100;
    const includeVat = form.elements.namedItem('includeVat').checked;
    const vat = includeVat ? Math.round(net * Number(catalog.vatRate || 0) * 100) / 100 : 0;
    quoteRoot.querySelector('[data-quote-net]').textContent = money(net);
    quoteRoot.querySelector('[data-quote-vat-amount]').textContent = money(vat);
    quoteRoot.querySelector('[data-quote-total]').textContent = money(net + vat);
  };
  form.addEventListener('input', updateEstimate);
  form.addEventListener('change', updateEstimate);
  updateEstimate();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const success = quoteRoot.querySelector('[data-quote-success]');
    const error = quoteRoot.querySelector('[data-quote-error]');
    const submit = quoteRoot.querySelector('[data-quote-submit]');
    const english = document.documentElement.lang === 'en';
    success.hidden = true;
    error.hidden = true;
    submit.disabled = true;
    try {
      const response = await fetch('/api/quote.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          itemSlug: form.elements.namedItem('itemSlug').value,
          units: Number(form.elements.namedItem('units').value),
          complexity: form.elements.namedItem('complexity').value,
          includeVat: form.elements.namedItem('includeVat').checked,
          name: form.elements.namedItem('name').value.trim(),
          email: form.elements.namedItem('email').value.trim(),
          phone: form.elements.namedItem('phone').value.trim(),
          taxId: form.elements.namedItem('taxId').value.trim(),
          notes: form.elements.namedItem('notes').value.trim(),
          website: form.elements.namedItem('website').value.trim(),
          lang: english ? 'en' : 'el',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) {
        error.textContent = english ? 'Sending failed. Try again or email contact@dasologio.com.' : 'Η αποστολή απέτυχε. Δοκιμάστε ξανά ή γράψτε μας στο contact@dasologio.com.';
        error.hidden = false;
        return;
      }
      success.hidden = false;
      form.reset();
      form.elements.namedItem('includeVat').checked = true;
      updateEstimate();
    } catch {
      error.textContent = english ? 'Sending failed. Try again or email contact@dasologio.com.' : 'Η αποστολή απέτυχε. Δοκιμάστε ξανά ή γράψτε μας στο contact@dasologio.com.';
      error.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
}
