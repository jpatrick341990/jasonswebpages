const DEFAULT_SETTINGS = {
  brandMark: 'AV',
  siteName: 'Aster & Vine Studio',
  siteTagline: 'Refined floral design for daily bouquets, weddings, events, and subscription deliveries.',
  heroEyebrow: 'Luxury floral studio',
  heroHeadline: 'Seasonal bouquets, wedding flowers, and event florals with a polished ordering and booking flow.',
  heroText: 'Aster & Vine Studio is built for flower businesses that need two things to happen well: daily orders and higher-ticket consultations. The homepage points visitors toward shopping, booking, and browsing the work without making the site feel overloaded.',
  heroButtonPrimary: 'Shop Flowers',
  heroButtonSecondary: 'Book Consultation',
  introCopy: 'From same-week gifting to full-room floral styling, the studio can guide quick orders and higher-touch projects without losing its calm, editorial feel.',
  breakHeadlineOne: 'Use the wide image sections for holiday drops, launch moments, and “dates are filling” booking pushes.',
  breakTextOne: 'This works well for Mother’s Day, Valentine’s preorders, wedding season, workshop announcements, or a limited collection that needs stronger visual focus.',
  breakHeadlineTwo: 'Give the portfolio room to breathe so the work feels curated instead of crowded.',
  breakTextTwo: 'These wider sections help you reset the visual rhythm and can double as seasonal statements, client quotes, or press-style callouts.',
  servicesHeadline: 'Offer structure that works for both quick orders and more custom floral projects.',
  servicesText: 'Use the services page to explain signature offers, starting points, and what clients should expect. It should make the studio feel easier to understand, not more complicated.',
  aboutHeadline: 'A floral brand template that is broad enough to sell, but specific enough to feel intentional.',
  aboutText: 'Use the about page to introduce the studio point of view, delivery approach, service area, and why the business feels distinct. This page matters more than many buyers think because it supports trust for both gifting and higher-ticket event work.',
  bookingHeadline: 'Separate the consultation page from the ordering page so custom work feels premium.',
  bookingText: 'Weddings, installations, dinners, and private events should not get buried inside the same flow as a wrapped bouquet order. This page is built to ask smarter questions up front.',
  contactHeadline: 'A contact page that feels helpful, not like an afterthought.',
  contactText: 'Keep the essentials easy to find: service areas, delivery windows, email, social links, and a simple inquiry route for people who are not ready for a full consultation form yet.',
  footerTagline: 'Seasonal flowers, event florals, and polished service pages that feel established from day one.',
  footerCopy: 'Designed for studios that sell wrapped bouquets, custom event florals, workshop seats, and recurring flower memberships without making the site feel crowded.',
  instagramUrl: '',
  facebookUrl: '',
  pinterestUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  passcode: 'preview',
  colors: {
    accent: '#b76b5c',
    accentDeep: '#5f755d',
    bg: '#f7f2eb',
    bgSoft: '#ede5da',
    text: '#2e3028',
    dark: '#243128'
  },
  images: {
    brandLogo: '',
    heroPrimary: 'assets/images/hero-bouquet.jpg',
    heroSecondary: 'assets/images/hero-installation.jpg',
    sectionPatio: 'assets/images/section-atelier.jpg',
    sectionPanoramaOne: 'assets/images/section-seasonal.jpg',
    sectionPanoramaTwo: 'assets/images/section-delivery.jpg',
    sectionSkyline: 'assets/images/admin-banner.jpg'
  }
};
function deepClone(value){
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
const SETTINGS_STORAGE_KEY = 'aster-vine-demo-settings-v10';
const LEGACY_SETTINGS_STORAGE_KEYS = ['aster-vine-settings', 'aster-vine-settings-v8', 'aster-vine-demo-settings-v9'];
const CATALOG_STORAGE_KEY = 'aster-vine-demo-catalog-v10';
const LEGACY_CATALOG_STORAGE_KEYS = ['aster-vine-catalog', 'aster-vine-catalog-v8', 'aster-vine-demo-catalog-v9'];
function getSettings(){
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if(!raw) return deepClone(DEFAULT_SETTINGS);
  try{
    const parsed = JSON.parse(raw);
    return {
      ...deepClone(DEFAULT_SETTINGS),
      ...parsed,
      colors: {...DEFAULT_SETTINGS.colors, ...(parsed.colors || {})},
      images: {...DEFAULT_SETTINGS.images, ...(parsed.images || {})}
    };
  }catch(e){ return deepClone(DEFAULT_SETTINGS); }
}
function saveSettings(settings){ localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings)); }
function applyTextSettings(settings){
  document.querySelectorAll('[data-setting-text]').forEach(el=>{
    const key = el.dataset.settingText;
    if(settings[key] !== undefined) el.textContent = settings[key];
  });
}
function applyColorSettings(settings){
  const root = document.documentElement;
  root.style.setProperty('--accent', settings.colors.accent);
  root.style.setProperty('--accent-deep', settings.colors.accentDeep);
  root.style.setProperty('--bg', settings.colors.bg);
  root.style.setProperty('--bg-soft', settings.colors.bgSoft);
  root.style.setProperty('--text', settings.colors.text);
  root.style.setProperty('--dark', settings.colors.dark);
}
function applyImageSettings(settings){
  document.querySelectorAll('[data-setting-logo]').forEach(el=>{
    const src = settings.images.brandLogo;
    const shell = el.closest('.brand-mark');
    if(src){
      el.src = src;
      el.alt = settings.siteName || 'Brand logo';
      el.hidden = false;
      shell?.classList.add('has-logo');
    } else {
      el.removeAttribute('src');
      el.alt = '';
      el.hidden = true;
      shell?.classList.remove('has-logo');
    }
  });
  document.querySelectorAll('[data-setting-image]').forEach(el=>{
    const key = el.dataset.settingImage;
    const src = settings.images[key];
    if(!src) return;
    if(el.tagName === 'IMG') el.src = src;
    else {
      if(key === 'heroPrimary' && el.classList.contains('hero')) el.style.setProperty('--hero-image', `url('${src}')`);
      else if(key === 'heroSecondary' && el.classList.contains('page-banner')) el.style.setProperty('--page-banner-image', `url('${src}')`);
      else if(key === 'sectionPatio') el.style.setProperty('--section-image', `url('${src}')`);
      else if(key === 'sectionPanoramaOne') el.style.setProperty('--section-image-panorama', `url('${src}')`);
      else if(key === 'sectionPanoramaTwo') el.style.setProperty('--section-image-panorama', `url('${src}')`);
      else if(key === 'sectionSkyline') el.style.setProperty('--section-image-skyline', `url('${src}')`);
      else el.style.backgroundImage = `url('${src}')`;
    }
  });
}
function renderSocialLinks(settings){
  const socialItems = [
    { key: 'instagramUrl', label: 'Instagram', short: 'IG' },
    { key: 'facebookUrl', label: 'Facebook', short: 'FB' },
    { key: 'pinterestUrl', label: 'Pinterest', short: 'PI' },
    { key: 'tiktokUrl', label: 'TikTok', short: 'TT' },
    { key: 'youtubeUrl', label: 'YouTube', short: 'YT' }
  ];
  document.querySelectorAll('[data-social-location]').forEach(container => {
    const links = socialItems.filter(item => settings[item.key]);
    container.classList.toggle('is-empty', !links.length);
    container.innerHTML = links.map(item => `
      <a class="social-pill" href="${settings[item.key]}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${item.short}</a>`).join('');
  });
}

function initMobileNav(){
  const toggle=document.querySelector('.mobile-toggle');
  const menu=document.querySelector('.nav-links');
  if(toggle && menu) toggle.addEventListener('click',()=>menu.classList.toggle('open'));
}
function initForms(){
  document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    const msg=form.querySelector('.form-message');
    if(msg) msg.textContent='Demo form only: connect Formspree, Basin, or EmailJS to make this form live.';
  }));
}
function initHeroSwitcher(settings){
  const thumbs=[...document.querySelectorAll('.hero-thumb')];
  const hero=document.querySelector('.hero');
  if(!thumbs.length || !hero) return;
  const imageLookup={heroPrimary:settings.images.heroPrimary, heroSecondary:settings.images.heroSecondary};
  thumbs.forEach(btn=>btn.addEventListener('click',()=>{
    thumbs.forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    const next=imageLookup[btn.dataset.heroTarget];
    if(next) hero.style.setProperty('--hero-image', `url('${next}')`);
  }));
}
function escapeHTML(value){
  return String(value ?? '').replace(/[&<>"]/g, match => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[match]));
}

const DEFAULT_CATALOG = (()=>{
  try{
    return deepClone(window.AsterVineCatalog || {});
  }catch(err){
    return {};
  }
})();
function getCatalog(){
  const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
  if(!raw) return deepClone(DEFAULT_CATALOG);
  try{
    const parsed = JSON.parse(raw);
    return {...deepClone(DEFAULT_CATALOG), ...parsed};
  }catch(err){
    return deepClone(DEFAULT_CATALOG);
  }
}
function saveCatalog(catalog){
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
}
function clearLegacyPreviewMemory(){
  [...LEGACY_SETTINGS_STORAGE_KEYS, ...LEGACY_CATALOG_STORAGE_KEYS].forEach(key => localStorage.removeItem(key));
}
function resetCatalog(){
  localStorage.removeItem(CATALOG_STORAGE_KEY);
}
function activeItems(items){
  return (items || []).filter(item => item && item.active !== false);
}
function renderCollectionCard(item){
  return `
    <article class="gallery-card">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt || item.title)}">
      <div class="kicker-line"><span class="badge">${escapeHTML(item.badge || '')}</span></div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
    </article>`;
}
function renderProductCard(item){
  const tags = (item.categories || []).join(' ');
  return `
    <article class="product-card" data-category="${escapeHTML(tags)}">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt || item.title)}">
      <div class="badge">${escapeHTML(item.badge || '')}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <div class="price-line"><strong>${escapeHTML(item.price || '')}</strong><span>${escapeHTML(item.detail || '')}</span></div>
    </article>`;
}
function renderPortfolioCard(item){
  const tags = (item.categories || []).join(' ');
  return `
    <article class="portfolio-card" data-category="${escapeHTML(tags)}">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt || item.title)}">
      <div class="copy">
        <div class="kicker-line"><span class="badge">${escapeHTML(item.badge || '')}</span></div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
      </div>
    </article>`;
}
function renderPackageCard(item){
  const listItems = (item.items || []).map(text => `<li>${escapeHTML(text)}</li>`).join('');
  const buttonClass = item.featured ? 'btn btn-primary' : 'btn btn-secondary';
  const featuredClass = item.featured ? ' featured' : '';
  return `
    <article class="pricing-card${featuredClass}">
      <div class="badge">${escapeHTML(item.badge || '')}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <div class="price">${escapeHTML(item.price || '')}</div>
      <ul>${listItems}</ul>
      <a class="${buttonClass}" href="${escapeHTML(item.buttonLink || 'booking.html')}">${escapeHTML(item.buttonLabel || 'Learn more')}</a>
    </article>`;
}
function renderServiceExtra(item){
  return `
    <article class="service-card">
      <div class="card-icon">${escapeHTML(item.icon || '✿')}</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
    </article>`;
}
function renderFaq(item){
  return `<article class="faq-item"><h3>${escapeHTML(item.question)}</h3><p>${escapeHTML(item.answer)}</p></article>`;
}
function renderTestimonial(item){
  return `<article class="quote-card"><blockquote>“${escapeHTML(item.quote)}”</blockquote><cite>${escapeHTML(item.cite)}</cite></article>`;
}
function renderButtons(container, filters, onClick){
  if(!container || !filters?.length) return;
  container.innerHTML = filters.map((filter, index) => `
    <button class="filter-btn${index === 0 ? ' active' : ''}" data-filter="${escapeHTML(filter.key)}" type="button">${escapeHTML(filter.label)}</button>`).join('');
  container.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => onClick(btn.dataset.filter, btn)));
}
function setActiveButton(container, button){
  container?.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === button));
}
function initCatalogRender(){
  const catalog = getCatalog();

  const collectionsGrid = document.getElementById('homeCollectionsGrid');
  if(collectionsGrid){
    collectionsGrid.innerHTML = activeItems(catalog.collections).map(renderCollectionCard).join('');
  }

  const homeProductsGrid = document.getElementById('homeFeaturedProductsGrid');
  if(homeProductsGrid){
    homeProductsGrid.innerHTML = activeItems(catalog.products).filter(item => item.home).map(renderProductCard).join('');
  }

  const testimonialsGrid = document.getElementById('homeTestimonialsGrid');
  if(testimonialsGrid){
    testimonialsGrid.innerHTML = activeItems(catalog.testimonials).map(renderTestimonial).join('');
  }

  const portfolioTestimonialsGrid = document.getElementById('portfolioTestimonialsGrid');
  if(portfolioTestimonialsGrid){
    portfolioTestimonialsGrid.innerHTML = activeItems(catalog.testimonials).map(renderTestimonial).join('');
  }

  const homeFaqGrid = document.getElementById('homeFaqGrid');
  if(homeFaqGrid){
    homeFaqGrid.innerHTML = activeItems(catalog.homeFaqs).map(renderFaq).join('');
  }

  const servicePackagesGrid = document.getElementById('servicePackagesGrid');
  if(servicePackagesGrid){
    servicePackagesGrid.innerHTML = activeItems(catalog.servicePackages).map(renderPackageCard).join('');
  }

  const serviceExtrasGrid = document.getElementById('serviceExtrasGrid');
  if(serviceExtrasGrid){
    serviceExtrasGrid.innerHTML = activeItems(catalog.serviceExtras).map(renderServiceExtra).join('');
  }

  const serviceFaqGrid = document.getElementById('serviceFaqGrid');
  if(serviceFaqGrid){
    serviceFaqGrid.innerHTML = activeItems(catalog.serviceFaqs).map(renderFaq).join('');
  }

  const shopButtons = document.getElementById('shopFilterButtons');
  const shopGrid = document.getElementById('shopProductGrid');
  if(shopButtons && shopGrid){
    const products = activeItems(catalog.products);
    const drawProducts = filter => {
      const selected = filter === 'all' ? products : products.filter(item => (item.categories || []).includes(filter));
      shopGrid.innerHTML = selected.map(renderProductCard).join('');
    };
    drawProducts('all');
    renderButtons(shopButtons, catalog.shopFilters || [{key:'all', label:'All'}], (filter, btn) => {
      setActiveButton(shopButtons, btn);
      drawProducts(filter);
    });
  }

  const portfolioButtons = document.getElementById('portfolioFilterButtons');
  const portfolioGrid = document.getElementById('portfolioGrid');
  if(portfolioButtons && portfolioGrid){
    const portfolioItems = activeItems(catalog.portfolio);
    const drawPortfolio = filter => {
      const selected = filter === 'all' ? portfolioItems : portfolioItems.filter(item => (item.categories || []).includes(filter));
      portfolioGrid.innerHTML = selected.map(renderPortfolioCard).join('');
    };
    drawPortfolio('all');
    renderButtons(portfolioButtons, catalog.portfolioFilters || [{key:'all', label:'All'}], (filter, btn) => {
      setActiveButton(portfolioButtons, btn);
      drawPortfolio(filter);
    });
  }
}
function boot(){
  clearLegacyPreviewMemory();
  const settings=getSettings();
  applyTextSettings(settings);
  applyColorSettings(settings);
  applyImageSettings(settings);
  renderSocialLinks(settings);
  initCatalogRender();
  initMobileNav();
  initForms();
  initHeroSwitcher(settings);
}
document.addEventListener('DOMContentLoaded', boot);
window.AsterVineStudio = { DEFAULT_SETTINGS, getSettings, saveSettings, applyTextSettings, applyColorSettings, applyImageSettings, renderSocialLinks, DEFAULT_CATALOG, getCatalog, saveCatalog, resetCatalog, clearLegacyPreviewMemory, deepClone, STORAGE_KEY: SETTINGS_STORAGE_KEY };
