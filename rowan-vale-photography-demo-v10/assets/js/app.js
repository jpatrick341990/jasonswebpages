const DEFAULT_SETTINGS = {
  passcode: 'preview',
  siteName: 'Rowan & Vale Photography',
  brandMark: 'RV',
  siteTagline: 'Elegant wedding, portrait, and brand photography with a warm editorial finish.',
  footerTagline: 'Elegant imagery for weddings, portraits, and intentional brand stories.',
  footerCopy: 'Rowan & Vale Photography captures weddings, portraits, and personal brands with a warm editorial eye and a calm, guided experience.',
  heroEyebrow: 'Editorial wedding, portrait & brand photographer',
  heroHeadline: 'Romantic, polished imagery for weddings, portraits, and personal brands.',
  heroText: 'Based in your city and available for travel, Rowan & Vale creates imagery that feels warm, intentional, and beautifully finished without losing the emotion of the moment.',
  heroButtonPrimary: 'View portfolio',
  heroButtonSecondary: 'Inquire now',
  introCopy: 'Every page is designed to help clients feel your style before they inquire: warm edits, natural direction, and imagery that feels effortless but elevated.',
  breakHeadlineOne: 'Photography is about the feeling you remember long after the day is over.',
  breakTextOne: 'Quiet guidance, thoughtful pacing, and consistent editing keep the experience relaxed while the imagery stays refined.',
  aboutTeaserHeadline: 'A calm, polished experience from inquiry to final gallery.',
  aboutTeaserText: 'The experience is built to feel personal, beautifully paced, and easy to trust whether a client is booking a wedding, a portrait session, or brand coverage.',
  breakHeadlineTwo: 'Beautiful work matters, but a calm process is what gets people to inquire.',
  breakTextTwo: 'Expect timeline guidance, location planning, natural posing help, and galleries delivered with a clean editorial finish.',
  portfolioHeadline: 'A portfolio shaped by connection, light, and the atmosphere of the day.',
  portfolioText: 'Browse weddings, portraits, and brand sessions gathered into one portfolio that still feels cohesive from frame to frame.',
  servicesHeadline: 'Collections built for wedding weekends, portrait sessions, and polished brand stories.',
  servicesText: 'Choose the collection that best fits the way you want the story documented, then reach out for availability and custom details.',
  servicesBreakHeadline: 'A calm process makes the day feel easier and the final gallery feel stronger.',
  servicesBreakText: 'Every collection includes thoughtful planning, easy communication, and guidance that keeps the experience relaxed from first message to final delivery.',
  aboutHeadline: 'A little about the heart, eye, and experience behind the camera.',
  aboutText: 'I am drawn to the gestures people do without thinking: the steadying hand, the quiet look across the room, and the atmosphere that makes a frame feel alive.',
  aboutStory: 'The work is guided with care, plenty of room for genuine moments, and a polished final gallery that still feels deeply personal.',
  contactHeadline: 'Let’s talk about the story you want documented and the way you want it to feel.',
  contactText: 'Share a few details about the date, the session, or the kind of coverage you are looking for, and I will be in touch with next steps and availability.',
  contactIntro: 'Use this section for your response window, travel notes, minimum booking details, or what clients should include when they reach out.',
  contactCardText: 'You can use this card for session availability, wedding booking season, brand-session details, or a short note about the experience you create.',
  contactEmail: 'hello@rowanvalephoto.com',
  contactLocation: 'Based in your city / available for travel',
  contactTurnaround: 'Replies within 1–2 business days',
  instagramUrl: '',
  facebookUrl: '',
  pinterestUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  portfolioItems: window.ROWAN_VALE_DATA ? structuredClone(window.ROWAN_VALE_DATA.portfolioItems) : [],
  colors: {
    accent: '#c99b62', accentDeep: '#8f6836', bg: '#151211', bgSoft: '#211c19', text: '#f4ece4', dark: '#0d0a09'
  },
  images: {
    heroPrimary: 'assets/images/hero-editorial.jpg',
    heroSecondary: 'assets/images/hero-city-arrival.jpg',
    photographerPortrait: 'assets/images/photographer-portrait.jpg',
    sectionBreakOne: 'assets/images/section-break-1.jpg',
    sectionBreakTwo: 'assets/images/section-break-2.jpg',
    aboutImage: 'assets/images/gallery-branding-1.jpg',
    contactImage: 'assets/images/gallery-car-arrival.jpg',
    ownerBanner: 'assets/images/owner-banner.jpg'
  }
};
const STORAGE_KEY = 'rowan-vale-demo-settings-v10';

function getSettings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(DEFAULT_SETTINGS);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...parsed,
      portfolioItems: Array.isArray(parsed.portfolioItems) ? parsed.portfolioItems : structuredClone(DEFAULT_SETTINGS.portfolioItems),
      colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
      images: { ...DEFAULT_SETTINGS.images, ...(parsed.images || {}) }
    };
  } catch (e) {
    return structuredClone(DEFAULT_SETTINGS);
  }
}
function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
function applyTextSettings(settings) {
  document.querySelectorAll('[data-setting-text]').forEach((el) => {
    const key = el.dataset.settingText;
    if (settings[key] !== undefined) el.textContent = settings[key];
  });
}
function applyColorSettings(settings) {
  const root = document.documentElement;
  root.style.setProperty('--accent', settings.colors.accent);
  root.style.setProperty('--accent-deep', settings.colors.accentDeep);
  root.style.setProperty('--bg', settings.colors.bg);
  root.style.setProperty('--bg-soft', settings.colors.bgSoft);
  root.style.setProperty('--text', settings.colors.text);
  root.style.setProperty('--dark', settings.colors.dark);
}
function setImageVar(target, varName, src) {
  target.style.setProperty(varName, `url('${src}')`);
}
function renderSocialLinks(settings) {
  const items = [
    { key: 'instagramUrl', short: 'IG', label: 'Instagram' },
    { key: 'facebookUrl', short: 'FB', label: 'Facebook' },
    { key: 'pinterestUrl', short: 'PI', label: 'Pinterest' },
    { key: 'tiktokUrl', short: 'TT', label: 'TikTok' },
    { key: 'youtubeUrl', short: 'YT', label: 'YouTube' }
  ];
  document.querySelectorAll('[data-social-location]').forEach((container) => {
    const markup = items.filter((item) => (settings[item.key] || '').trim()).map((item) => `
      <a class="social-pill" href="${settings[item.key]}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${item.short}</a>
    `).join('');
    container.innerHTML = markup;
    container.classList.toggle('is-empty', !markup.trim());
  });
}

function applyImageSettings(settings) {
  const hero = document.querySelector('.hero-home');
  if (hero) setImageVar(hero, '--hero-image', settings.images.heroPrimary);
  const pageBanner = document.querySelector('.page-banner');
  if (pageBanner) setImageVar(pageBanner, '--page-banner-image', settings.images.heroSecondary);
  const breakOne = document.querySelector('[data-break-one]');
  if (breakOne) setImageVar(breakOne, '--section-break-image', settings.images.sectionBreakOne);
  const breakTwo = document.querySelector('[data-break-two]');
  if (breakTwo) setImageVar(breakTwo, '--section-break-image', settings.images.sectionBreakTwo);
  const ownerBanner = document.querySelector('[data-owner-banner]');
  if (ownerBanner) setImageVar(ownerBanner, '--page-banner-image', settings.images.ownerBanner);
  document.querySelectorAll('[data-setting-image]').forEach((el) => {
    const key = el.dataset.settingImage;
    const src = settings.images[key];
    if (src && el.tagName === 'IMG') el.src = src;
  });
}
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-links');
  if (toggle && menu) toggle.addEventListener('click', () => menu.classList.toggle('open'));
}
function initForms() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action');
      const isDemo = !action || action.trim() === '' || action.trim() === '#';
      if (!isDemo) return;
      e.preventDefault();
      const msg = form.querySelector('.form-message');
      if (msg) msg.textContent = 'Demo form only: connect this form to Formspree, Basin, or another form service before publishing live.';
    });
  });
}
function initFilters() {
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('.portfolio-grid [data-category]')];
  if (!buttons.length || !cards.length) return;
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  }));
}
function initMonkeyToggles() {
  document.querySelectorAll('[data-monkey-toggle]').forEach((btn) => {
    if (btn.dataset.monkeyBound === 'true') return;
    btn.dataset.monkeyBound = 'true';
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.monkeyToggle);
      if (!target) return;
      const showing = target.type === 'text';
      target.type = showing ? 'password' : 'text';
      btn.textContent = showing ? '🙈' : '🐵';
    });
  });
}
function renderCollections() {
  const target = document.getElementById('featuredCollections');
  if (!target || !window.ROWAN_VALE_DATA) return;
  target.innerHTML = window.ROWAN_VALE_DATA.featuredCollections.map((item) => `
    <article class="feature-card feature-photo-card">
      <img src="${item.image}" alt="${item.title}">
      <div class="feature-photo-copy">
        <span class="pill">${item.badge}</span>
        <h3>${item.title}</h3>
        <p>${item.subtitle}</p>
        <a class="text-link" href="${item.link}">Explore</a>
      </div>
    </article>
  `).join('');
}
function renderPackages() {
  const target = document.getElementById('packageCards');
  if (!target || !window.ROWAN_VALE_DATA) return;
  target.innerHTML = window.ROWAN_VALE_DATA.packages.map((item) => `
    <article class="package-card">
      <img src="${item.image}" alt="${item.title}">
      <div class="package-body">
        <span class="pill">${item.badge}</span>
        <h3>${item.title}</h3>
        <strong>${item.price}</strong>
        <ul>
          ${item.points.map((point) => `<li>${point}</li>`).join('')}
        </ul>
      </div>
    </article>
  `).join('');
}
function renderPortfolio() {
  const target = document.getElementById('portfolioGrid');
  if (!target) return;
  const settings = getSettings();
  const items = Array.isArray(settings.portfolioItems) && settings.portfolioItems.length ? settings.portfolioItems : (window.ROWAN_VALE_DATA?.portfolioItems || []);
  target.innerHTML = items.map((item) => `
    <article class="portfolio-card ${item.size || 'standard'}" data-category="${item.category || 'portrait'}">
      <img src="${item.image}" alt="${item.title}">
      <div class="portfolio-card-copy"><strong>${item.title}</strong><span>${item.category || 'portrait'}</span></div>
    </article>
  `).join('');
}
function renderTestimonials() {
  const target = document.getElementById('testimonialCards');
  if (!target || !window.ROWAN_VALE_DATA) return;
  target.innerHTML = window.ROWAN_VALE_DATA.testimonials.map((item) => `
    <article class="testimonial-card">
      <p>“${item.quote}”</p>
      <strong>${item.name}</strong>
      <span>${item.detail}</span>
    </article>
  `).join('');
}
function renderFaq() {
  const target = document.getElementById('faqList');
  if (!target || !window.ROWAN_VALE_DATA) return;
  target.innerHTML = window.ROWAN_VALE_DATA.faq.map((item) => `
    <article class="faq-card">
      <h3>${item.question}</h3>
      <p>${item.answer}</p>
    </article>
  `).join('');
}
function boot() {
  const settings = getSettings();
  applyTextSettings(settings);
  applyColorSettings(settings);
  applyImageSettings(settings);
  renderSocialLinks(settings);
  renderCollections();
  renderPackages();
  renderPortfolio();
  renderTestimonials();
  renderFaq();
  initMobileNav();
  initForms();
  initFilters();
  initMonkeyToggles();
}

document.addEventListener('DOMContentLoaded', boot);
window.RowanVale = { DEFAULT_SETTINGS, STORAGE_KEY, getSettings, saveSettings, applyTextSettings, applyColorSettings, applyImageSettings, renderSocialLinks };
