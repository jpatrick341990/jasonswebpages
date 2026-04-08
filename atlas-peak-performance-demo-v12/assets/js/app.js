
const STORAGE_KEY = 'atlas-peak-performance-demo-preview-v12';

const DEFAULT_SETTINGS = {
  passcode: 'preview',
  monkeyStyle: 'classic',
  siteName: 'Atlas Peak Performance',
  brandMark: 'AP',
  siteTagline: 'Strength, muscle, fat loss, and accountability coaching built for men who want a serious plan.',
  footerTagline: 'Strength coaching, body recomposition, and private accountability for men who want real progress.',
  footerCopy: 'Atlas Peak Performance helps men build muscle, lose fat, and train with more discipline through structured gym-based coaching.',
  heroEyebrow: 'Gym-based coaching for strength, muscle, and fat loss',
  heroHeadline: 'Build strength, add muscle, and get leaner with a plan that actually fits your week.',
  heroText: 'Atlas Peak Performance is built for men who want stronger lifts, better body composition, and direct accountability without wasting months on random programming.',
  heroButtonPrimary: 'Book consultation',
  heroButtonSecondary: 'View programs',
  introCopy: 'Every section is built to make the coaching feel clear: what the programs are, who they are for, how progress is tracked, and what kind of result the client can realistically expect.',
  aboutTeaserHeadline: 'Good coaching sites should feel focused, credible, and serious before the application form ever appears.',
  aboutTeaserText: 'This brand is built around gym-floor results: better lifts, better shape, and better consistency. The coaching is direct, the process is clear, and the standards stay high.',
  breakHeadlineOne: 'More effort is not always the answer. Better structure usually is.',
  breakTextOne: 'The right program balances heavy work, clean execution, recovery, and nutrition so progress can keep building instead of stalling out every few weeks.',
  breakHeadlineTwo: 'The goal is simple: stronger performance and a body that looks trained.',
  breakTextTwo: 'That means the plan has to be practical enough to follow, hard enough to matter, and flexible enough to survive a real schedule.',
  resultsHeadline: 'Real results, clearer structure, and proof that the system works.',
  resultsIntro: 'Filter the results by strength, muscle gain, fat loss, or conditioning to show the kind of progress your coaching actually produces.',
  servicesHeadline: 'Programs built for men who want clear coaching lanes and better gym results.',
  servicesText: 'Choose the lane that fits your goal, your schedule, and the amount of accountability you want around your training and nutrition.',
  aboutHeadline: 'Built for men who want stronger training, better habits, and visible progress they can keep.',
  aboutIntro: 'This page is where the coaching philosophy, standards, and training culture get explained in a way that feels direct and believable.',
  aboutStoryHeadline: 'The best results come from a plan that respects recovery, demands consistency, and keeps the work focused on the goal.',
  aboutStoryTextOne: 'Talk about the training method, the standards you coach by, and the kind of client who does best inside this system.',
  aboutStoryTextTwo: 'This is where you explain why the work stays structured, why technique matters, and why discipline beats random motivation over time.',
  contactHeadline: 'Apply for coaching and let’s build the right plan for your goal.',
  contactIntro: 'Tell us where you are now, what result you want, and what has been getting in the way. We will map out the best next step from there.',
  contactCardText: 'Atlas Peak Performance is best for men who are ready to follow a real plan, train hard with intention, and stop bouncing between random workouts.',
  contactEmail: 'hello@atlaspeakperformance.com',
  contactLocation: 'Online coaching • private gym consults by request',
  contactTurnaround: 'Replies within 1–2 business days',
  instagramUrl: '',
  facebookUrl: '',
  pinterestUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  colors: {
    accent: '#d4a64b',
    accentDeep: '#8f641f',
    bg: '#f3eee7',
    bgSoft: '#e5ddd2',
    text: '#111917',
    dark: '#121110'
  },
  images: {
    brandLogo: '',
    heroPrimary: 'assets/images/atlas-hero-main.jpg',
    heroSecondary: 'assets/images/atlas-hero-alt.jpg',
    sectionPatio: 'assets/images/atlas-break-endurance.jpg',
    sectionPanoramaOne: 'assets/images/atlas-break-recovery.jpg',
    sectionPanoramaTwo: 'assets/images/atlas-banner-programs.jpg',
    sectionSkyline: 'assets/images/atlas-banner-owner.jpg',
    aboutFeature: 'assets/images/atlas-coach-story.jpg',
    aboutSecondary: 'assets/images/atlas-about-panel.jpg',
    contactSide: 'assets/images/atlas-contact-side.jpg',
    pageBannerResults: 'assets/images/atlas-banner-results.jpg',
    pageBannerPrograms: 'assets/images/atlas-banner-programs.jpg',
    pageBannerAbout: 'assets/images/atlas-banner-about.jpg',
    pageBannerApply: 'assets/images/atlas-banner-apply.jpg',
    pageBannerOwner: 'assets/images/atlas-banner-owner.jpg'
  }
};

const MONKEY_STYLES = {
  classic: { hidden: '🙈', shown: '🐵' },
  playful: { hidden: '🙉', shown: '🐒' },
  cheeky: { hidden: '🙊', shown: '🐵' },
  cartoon: { hidden: '🙈', shown: '🐒' }
};

function getMonkeyIcons(style){
  return MONKEY_STYLES[style] || MONKEY_STYLES.classic;
}

function deepClone(value){ return JSON.parse(JSON.stringify(value)); }

function getSettings(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return deepClone(DEFAULT_SETTINGS);
  try{
    const parsed = JSON.parse(raw);
    return {
      ...deepClone(DEFAULT_SETTINGS),
      ...parsed,
      colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
      images: { ...DEFAULT_SETTINGS.images, ...(parsed.images || {}) }
    };
  }catch(error){
    return deepClone(DEFAULT_SETTINGS);
  }
}

function saveSettings(settings){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function applyTextSettings(settings){
  document.querySelectorAll('[data-setting-text]').forEach((element)=>{
    const key = element.dataset.settingText;
    if(settings[key] !== undefined){
      element.textContent = settings[key];
    }
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

function renderSocialLinks(settings){
  const items = [
    { key: 'instagramUrl', short: 'IG', label: 'Instagram' },
    { key: 'facebookUrl', short: 'FB', label: 'Facebook' },
    { key: 'pinterestUrl', short: 'PI', label: 'Pinterest' },
    { key: 'tiktokUrl', short: 'TT', label: 'TikTok' },
    { key: 'youtubeUrl', short: 'YT', label: 'YouTube' }
  ];
  document.querySelectorAll('[data-social-location]').forEach((container)=>{
    const html = items.filter((item)=> (settings[item.key] || '').trim()).map((item)=> `<a class="social-pill" href="${settings[item.key]}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${item.short}</a>`).join('');
    container.innerHTML = html;
    container.classList.toggle('is-empty', !html.trim());
  });
}

function applyImageSettings(settings){
  document.querySelectorAll('[data-setting-image]').forEach((element)=>{
    const key = element.dataset.settingImage;
    const src = settings.images[key];
    if(!src) return;
    if(element.tagName === 'IMG'){
      element.src = src;
    }else{
      element.style.setProperty('--custom-image', `url('${src}')`);
      if(key === 'heroPrimary' && element.classList.contains('hero')){
        element.style.setProperty('--hero-image', `url('${src}')`);
      }else if(key === 'sectionPatio'){
        element.style.setProperty('--section-image', `url('${src}')`);
      }else if(key === 'sectionPanoramaOne'){
        element.style.setProperty('--section-image', `url('${src}')`);
      }else if(key === 'sectionPanoramaTwo'){
        element.style.setProperty('--section-image', `url('${src}')`);
      }else if(key === 'sectionSkyline'){
        element.style.setProperty('--section-image', `url('${src}')`);
      }else if(key === 'pageBannerResults' || key === 'pageBannerPrograms' || key === 'pageBannerAbout' || key === 'pageBannerApply' || key === 'pageBannerOwner'){
        element.style.setProperty('--page-banner-image', `url('${src}')`);
      }else{
        element.style.backgroundImage = `url('${src}')`;
      }
    }
  });

  const heroThumbPrimary = document.querySelector('[data-thumb="heroPrimary"]');
  const heroThumbSecondary = document.querySelector('[data-thumb="heroSecondary"]');
  if(heroThumbPrimary) heroThumbPrimary.style.backgroundImage = `url('${settings.images.heroPrimary}')`;
  if(heroThumbSecondary) heroThumbSecondary.style.backgroundImage = `url('${settings.images.heroSecondary}')`;

  document.querySelectorAll('[data-brand-logo]').forEach((img)=>{
    if(settings.images.brandLogo){
      img.src = settings.images.brandLogo;
      img.classList.add('visible');
    }else{
      img.removeAttribute('src');
      img.classList.remove('visible');
    }
  });
  document.querySelectorAll('[data-brand-mark]').forEach((mark)=>{
    mark.style.display = settings.images.brandLogo ? 'none' : 'grid';
  });
}

function createProgramCard(program){
  return `
    <article class="program-card">
      <img src="${program.image}" alt="${program.title}">
      <div class="program-card-body">
        <span class="pill">${program.badge}</span>
        <h3>${program.title}</h3>
        <p>${program.description}</p>
        <ul class="clean-list">${program.bullets.map((item)=>`<li>${item}</li>`).join('')}</ul>
      </div>
    </article>
  `;
}

function createResultCard(result){
  return `
    <article class="result-card" data-category="${result.category}">
      <img src="${result.image}" alt="${result.title}">
      <div class="result-card-body">
        <span class="pill">${result.tag}</span>
        <h3>${result.title}</h3>
        <p>${result.text}</p>
      </div>
    </article>
  `;
}

function createPricingCard(tier){
  return `
    <article class="pricing-card ${tier.featured ? 'featured' : ''}">
      <span class="pill ${tier.featured ? '' : 'soft'}">${tier.badge}</span>
      <h3>${tier.title}</h3>
      <div class="pricing-price">${tier.price}</div>
      <ul class="pricing-list">${tier.bullets.map((item)=>`<li>${item}</li>`).join('')}</ul>
      <a href="contact.html" class="btn ${tier.featured ? 'btn-dark' : 'btn-soft'}">${tier.cta}</a>
    </article>
  `;
}

function createFaqItem(faq, index){
  return `
    <details class="faq-item" ${index === 0 ? 'open' : ''}>
      <summary>${faq.question}</summary>
      <p>${faq.answer}</p>
    </details>
  `;
}

function createTestimonialCard(item){
  return `
    <article class="testimonial-card">
      <blockquote>“${item.quote}”</blockquote>
      <strong>${item.name}</strong>
      <span>${item.role}</span>
    </article>
  `;
}

function createResultStatCard(item){
  return `
    <article class="result-stat-card">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </article>
  `;
}

function renderAtlasData(){
  const data = window.AtlasPeakData || {};
  const renderMap = {
    programCards: (data.programs || []).map(createProgramCard).join(''),
    resultCards: (data.results || []).map(createResultCard).join(''),
    serviceCards: (data.serviceOffers || []).map(createProgramCard).join(''),
    pricingCards: (data.tiers || []).map(createPricingCard).join(''),
    homeFaq: (data.faqHome || []).map(createFaqItem).join(''),
    programsFaq: (data.faqPrograms || []).map(createFaqItem).join(''),
    testimonialCards: (data.testimonials || []).map(createTestimonialCard).join(''),
    resultStats: (data.resultStats || []).map(createResultStatCard).join('')
  };
  Object.entries(renderMap).forEach(([id, html])=>{
    const target = document.getElementById(id);
    if(target) target.innerHTML = html;
  });
}

function initMobileNav(){
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-links');
  if(toggle && menu){
    toggle.addEventListener('click', ()=> menu.classList.toggle('open'));
  }
}

function initForms(){
  document.querySelectorAll('form').forEach((form)=>{
    form.addEventListener('submit', (event)=>{
      const action = (form.getAttribute('action') || '').trim();
      const hasLiveAction = !!action && action !== '#' && !action.startsWith('javascript:');
      const isLiveForm = form.dataset.liveForm === 'true' || hasLiveAction;
      const message = form.querySelector('.form-message');

      if(isLiveForm){
        if(message){
          message.textContent = 'Sending...';
        }
        return;
      }

      event.preventDefault();
      if(message){
        message.textContent = 'Demo form only: connect your preferred form service before publishing live. See FORM-SETUP-GUIDE.txt for setup steps.';
      }
    });
  });
}

function initFilters(){
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('#resultCards [data-category]')];
  if(!buttons.length || !cards.length) return;
  buttons.forEach((button)=>{
    button.addEventListener('click', ()=>{
      buttons.forEach((item)=> item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      cards.forEach((card)=>{
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

function initHeroSwitcher(settings){
  const hero = document.querySelector('.hero');
  const buttons = [...document.querySelectorAll('.hero-thumb')];
  if(!hero || !buttons.length) return;
  const lookup = {
    heroPrimary: settings.images.heroPrimary,
    heroSecondary: settings.images.heroSecondary
  };
  buttons.forEach((button)=>{
    button.addEventListener('click', ()=>{
      buttons.forEach((item)=> item.classList.remove('active'));
      button.classList.add('active');
      const target = button.dataset.heroTarget;
      hero.style.setProperty('--hero-image', `url('${lookup[target]}')`);
    });
  });
}

function boot(){
  const settings = getSettings();
  renderAtlasData();
  applyTextSettings(settings);
  applyColorSettings(settings);
  applyImageSettings(settings);
  renderSocialLinks(settings);
  initMobileNav();
  initForms();
  initFilters();
  initHeroSwitcher(settings);
}

document.addEventListener('DOMContentLoaded', boot);

window.AtlasPeak = {
  STORAGE_KEY,
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  applyTextSettings,
  applyColorSettings,
  applyImageSettings,
  renderSocialLinks,
  getMonkeyIcons,
  MONKEY_STYLES
};
