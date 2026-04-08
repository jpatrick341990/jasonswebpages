(function(){
  const STORAGE_KEY = 'evercrestBrandSettingsV1';
  const copyDefaults = {
    copyNavHome: 'Home',
    copyNavShop: 'Shop',
    copyNavCollections: 'Collections',
    copyNavDeals: 'Deals',
    copyNavCheckout: 'Checkout',
    copyNavSeller: 'Seller',
    copyNavBlog: 'Blog',
    copyNavAbout: 'About',
    copyNavFaq: 'FAQ',
    copyNavContact: 'Contact',
    copyUtilityTrack: 'Track Order',
    copyUtilityAccount: 'My Account',
    copyUtilitySupport: 'Support',
    copySearchButton: 'Search',
    copyHeaderWishlist: 'Wishlist',
    copyHeaderAccount: 'Account',
    copyHeaderCart: 'Cart',
    copyFooterOwnerButton: 'Store Settings',
    copyHeroEyebrow: 'Elevated Living • New Edit',
    copyHeroTitle: 'Curate A Better Everyday',
    copyHeroBody: 'Shop refined finds for home, style, travel, and tech. This version leans calmer, richer, and more boutique while staying easy to manage after launch.',
    copyHeroButton1: 'Start Here',
    copyHeroButton2: 'Shop Collection',
    copyHeroButton3: 'Browse Categories',
    copyHeroButton4: 'View Deals',
    copyHeroStat1Title: '4.9★',
    copyHeroStat1Text: 'Customer Rating',
    copyHeroStat2Title: 'Fast',
    copyHeroStat2Text: 'Order Processing',
    copyHeroStat3Title: '30-Day',
    copyHeroStat3Text: 'Easy Returns',
    copyHeroStat4Title: 'Curated',
    copyHeroStat4Text: 'Premium Picks',
    copyPromoKicker: 'House Edit',
    copyPromoTitle: 'Seasonal Picks Worth Saving For',
    copyPromoButton: 'Shop Deals',
    copyTrust1Title: 'Fast Shipping',
    copyTrust1Text: 'Quick delivery on qualifying orders',
    copyTrust2Title: 'Secure Checkout',
    copyTrust2Text: 'Protected payments and smooth ordering',
    copyTrust3Title: 'Easy Returns',
    copyTrust3Text: 'Simple 30-day return process',
    copyTrust4Title: 'Friendly Support',
    copyTrust4Text: 'Help when you need it most',
    copyCategoriesKicker: 'Featured Categories',
    copyCategoriesTitle: 'Browse the categories that shape the store',
    copyCategory1Title: 'Home & Living',
    copyCategory1Text: 'Décor, lighting, kitchen accents, and premium everyday upgrades',
    copyCategory2Title: 'Style & Apparel',
    copyCategory2Text: 'Modern fashion pieces, clean layers, and wearable essentials',
    copyCategory3Title: 'Tech Essentials',
    copyCategory3Text: 'Smart gear, desk accessories, and elevated daily carry items',
    copyBestKicker: 'Best Sellers',
    copyBestTitle: 'Best-performing products customers keep coming back for',
    copyBrandsKicker: 'Featured Brands',
    copyBrandsTitle: 'Brands and collections that anchor the storefront',
    copySellerKicker: 'Limited-Time Offer',
    copySellerTitle: 'Editor Picks',
    copySellerBody: 'Save on handpicked favorites before they’re gone. Fresh markdowns, clean picks, and easy gifting ideas all in one place.',
    copySellerButton: 'See The Edit',
    copySpotlight2Title: 'Handmade Favorites',
    copySpotlight2Text: 'Warm home pieces and thoughtful finds with boutique appeal.',
    copySpotlight3Title: 'Top Tech Picks',
    copySpotlight3Text: 'Modern gadgets and desk upgrades built for everyday use.',
    copyReviewsKicker: 'Customer Reviews',
    copyReviewsTitle: 'What customers are saying',
    copyJournalKicker: 'From the Journal',
    copyJournalTitle: 'Shopping inspiration, styling notes, and store updates',
    copyFeaturedKicker: 'Featured Picks',
    copyFeaturedTitle: 'Fresh arrivals added to the latest collection',
    copyNewsletterKicker: 'Join The List',
    copyNewsletterTitle: 'Get first access to fresh collections, limited edits, and special offers',
    copyNewsletterBody: 'Subscribe for product launches, special offers, and seasonal inspiration delivered straight to your inbox.',
    copyNewsletterButton: 'Subscribe',
    copyFooterShopHeading: 'Shop',
    copyFooterCustomerHeading: 'Customer',
    copyFooterInfoHeading: 'Info',
    copyFooterWhyHeading: 'Why Shop Here',
    copyFooterWhyText: 'Refined design, trusted checkout, premium products, and a calmer shopping experience from top to bottom.',
    copyGlobalReplacements: ''
  };
  const defaults = {
    storeName: 'Evercrest Market',
    tagLine: 'Curated Goods & Daily Living',
    announcement: 'Free Shipping On Orders Over $75 • Fresh Weekly Picks • New Home, Style, And Tech Arrivals',
    utility: 'Free Shipping | Secure Checkout | Curated Daily Goods',
    footerNote: 'A polished multi-page storefront with a built-in seller dashboard, customer account area, and a more boutique visual direction.',
    supportEmail: 'support@evercrest.demo',
    supportPhone: '(555) 555-0142',
    instagram: '',
    facebook: '',
    pinterest: '',
    tiktok: '',
    youtube: '',
    logoData: '',
    logoPath: 'images/logo.png',
    showTrust: true,
    showCategories: true,
    showBestsellers: true,
    showBrands: true,
    showSellercta: true,
    showReviews: true,
    showJournal: true,
    showFeaturedpicks: true,
    showNewsletter: true,
    ...copyDefaults
  };
  const socialMap = [['instagram','IG'],['facebook','FB'],['pinterest','PI'],['tiktok','TT'],['youtube','YT']];
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const read = () => { try { return { ...defaults, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; } catch { return { ...defaults }; } };
  const save = (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  const escapeHtml = (text) => String(text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  const nodeFilter = (typeof NodeFilter !== 'undefined') ? NodeFilter : { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };

  function socialMarkup(settings){
    return socialMap.map(([key, label]) => settings[key] ? `<a href="${escapeHtml(settings[key])}" target="_blank" rel="noopener noreferrer" aria-label="${label}" class="social-chip">${label}</a>` : '').join('');
  }
  function setText(selector, value){ $$ (selector).forEach(el => { el.textContent = value; }); }
  function setFirst(selector, value){ const el = $(selector); if (el) el.textContent = value; }
  function setNth(baseSelector, index, childSelector, value){ const items = $$(baseSelector); const item = items[index]; const el = item?.querySelector(childSelector); if (el) el.textContent = value; }
  function setIndexText(selector, index, value){ const el = $$(selector)[index]; if (el) el.textContent = value; }

  function applyCopy(settings){
    setText('.utility-links a[href="tracking.html"]', settings.copyUtilityTrack);
    setText('.utility-links a[href="account.html"]', settings.copyUtilityAccount);
    setText('.utility-links a[href="contact.html"]', settings.copyUtilitySupport);
    setText('.nav a[href="index.html"]', settings.copyNavHome);
    setText('.nav a[href="shop.html"]', settings.copyNavShop);
    setText('.nav a[href="collections.html"]', settings.copyNavCollections);
    setText('.nav a[href="deals.html"]', settings.copyNavDeals);
    setText('.nav a[href="checkout.html"]', settings.copyNavCheckout);
    setText('.nav a[href="seller-dashboard.html"]', settings.copyNavSeller);
    setText('.nav a[href="blog.html"]', settings.copyNavBlog);
    setText('.nav a[href="about.html"]', settings.copyNavAbout);
    setText('.nav a[href="faq.html"]', settings.copyNavFaq);
    setText('.nav a[href="contact.html"]', settings.copyNavContact);
    setText('.header-search button[type="submit"]', settings.copySearchButton);
    $$('.header-wishlist-link').forEach(el => { const count = (el.textContent.match(/\((.*?)\)/) || [])[0]; el.textContent = `❤ ${settings.copyHeaderWishlist}${count ? ` ${count}` : ''}`; });
    $$('a[href="account.html"]').forEach(link => {
      if (link.closest('.utility-links')) return;
      if (link.classList.contains('cart-pill') || link.classList.contains('header-wishlist-link')) return;
      if (link.textContent.includes('👤')) link.textContent = `👤 ${settings.copyHeaderAccount}`;
    });
    $$('.cart-pill').forEach(el => { const count = (el.textContent.match(/\((.*?)\)/) || [])[0]; el.textContent = `🛒 ${settings.copyHeaderCart}${count ? ` ${count}` : ''}`; });

    if ($('.hero-ultra')) {
      setFirst('.hero .eyebrow', settings.copyHeroEyebrow);
      setFirst('.hero .hero-text h2', settings.copyHeroTitle);
      const heroBody = $('.hero .hero-text > p:not(.eyebrow)');
      if (heroBody) heroBody.textContent = settings.copyHeroBody;
      setIndexText('.hero-buttons a', 0, settings.copyHeroButton1);
      setIndexText('.hero-buttons a', 1, settings.copyHeroButton2);
      setIndexText('.hero-buttons a', 2, settings.copyHeroButton3);
      setIndexText('.hero-buttons a', 3, settings.copyHeroButton4);
      setNth('.hero-stats .stat-card', 0, 'strong', settings.copyHeroStat1Title);
      setNth('.hero-stats .stat-card', 0, 'span', settings.copyHeroStat1Text);
      setNth('.hero-stats .stat-card', 1, 'strong', settings.copyHeroStat2Title);
      setNth('.hero-stats .stat-card', 1, 'span', settings.copyHeroStat2Text);
      setNth('.hero-stats .stat-card', 2, 'strong', settings.copyHeroStat3Title);
      setNth('.hero-stats .stat-card', 2, 'span', settings.copyHeroStat3Text);
      setNth('.hero-stats .stat-card', 3, 'strong', settings.copyHeroStat4Title);
      setNth('.hero-stats .stat-card', 3, 'span', settings.copyHeroStat4Text);
      setFirst('.mini-promo-content .section-kicker', settings.copyPromoKicker);
      setFirst('.mini-promo-content h3', settings.copyPromoTitle);
      setFirst('.mini-promo-content .btn', settings.copyPromoButton);
      setNth('.trust-strip .trust-item', 0, 'strong', settings.copyTrust1Title);
      setNth('.trust-strip .trust-item', 0, 'span', settings.copyTrust1Text);
      setNth('.trust-strip .trust-item', 1, 'strong', settings.copyTrust2Title);
      setNth('.trust-strip .trust-item', 1, 'span', settings.copyTrust2Text);
      setNth('.trust-strip .trust-item', 2, 'strong', settings.copyTrust3Title);
      setNth('.trust-strip .trust-item', 2, 'span', settings.copyTrust3Text);
      setNth('.trust-strip .trust-item', 3, 'strong', settings.copyTrust4Title);
      setNth('.trust-strip .trust-item', 3, 'span', settings.copyTrust4Text);
      setFirst('[data-home-section="categories"] .section-kicker', settings.copyCategoriesKicker);
      setFirst('[data-home-section="categories"] .section-heading h3', settings.copyCategoriesTitle);
      setNth('.marketplace-categories .collection-card', 0, 'h4', settings.copyCategory1Title);
      setNth('.marketplace-categories .collection-card', 0, 'p', settings.copyCategory1Text);
      setNth('.marketplace-categories .collection-card', 1, 'h4', settings.copyCategory2Title);
      setNth('.marketplace-categories .collection-card', 1, 'p', settings.copyCategory2Text);
      setNth('.marketplace-categories .collection-card', 2, 'h4', settings.copyCategory3Title);
      setNth('.marketplace-categories .collection-card', 2, 'p', settings.copyCategory3Text);
      setFirst('[data-home-section="bestsellers"] .section-kicker', settings.copyBestKicker);
      setFirst('[data-home-section="bestsellers"] .section-heading h3', settings.copyBestTitle);
      setFirst('[data-home-section="brands"] .section-kicker', settings.copyBrandsKicker);
      setFirst('[data-home-section="brands"] .section-heading h3', settings.copyBrandsTitle);
      setFirst('[data-home-section="sellercta"] .wide-card .section-kicker', settings.copySellerKicker);
      setFirst('[data-home-section="sellercta"] .wide-card h3', settings.copySellerTitle);
      setFirst('[data-home-section="sellercta"] .wide-card p:not(.section-kicker)', settings.copySellerBody);
      setFirst('[data-home-section="sellercta"] .wide-card .btn', settings.copySellerButton);
      setNth('[data-home-section="sellercta"] .spotlight-card', 1, 'h4', settings.copySpotlight2Title);
      setNth('[data-home-section="sellercta"] .spotlight-card', 1, 'p', settings.copySpotlight2Text);
      setNth('[data-home-section="sellercta"] .spotlight-card', 2, 'h4', settings.copySpotlight3Title);
      setNth('[data-home-section="sellercta"] .spotlight-card', 2, 'p', settings.copySpotlight3Text);
      setFirst('[data-home-section="reviews"] .section-kicker', settings.copyReviewsKicker);
      setFirst('[data-home-section="reviews"] .section-heading h3', settings.copyReviewsTitle);
      setFirst('[data-home-section="journal"] .section-kicker', settings.copyJournalKicker);
      setFirst('[data-home-section="journal"] .section-heading h3', settings.copyJournalTitle);
      setFirst('[data-home-section="featuredpicks"] .section-kicker', settings.copyFeaturedKicker);
      setFirst('[data-home-section="featuredpicks"] .section-heading h3', settings.copyFeaturedTitle);
      setFirst('[data-home-section="newsletter"] .section-kicker', settings.copyNewsletterKicker);
      setFirst('[data-home-section="newsletter"] h3', settings.copyNewsletterTitle);
      setFirst('[data-home-section="newsletter"] .newsletter-wrap > div > p:not(.section-kicker)', settings.copyNewsletterBody);
      setFirst('[data-home-section="newsletter"] .newsletter-form button', settings.copyNewsletterButton);
    }
    setNth('.site-footer .footer-grid > div', 1, 'h4', settings.copyFooterShopHeading);
    setNth('.site-footer .footer-grid > div', 2, 'h4', settings.copyFooterCustomerHeading);
    setNth('.site-footer .footer-grid > div', 3, 'h4', settings.copyFooterInfoHeading);
    setNth('.site-footer .footer-grid > div', 4, 'h4', settings.copyFooterWhyHeading);
    setNth('.site-footer .footer-grid > div', 4, 'p', settings.copyFooterWhyText);
  }

  function parseReplacementLines(raw){
    return String(raw || '').split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => {
      const parts = line.includes('=>') ? line.split('=>') : line.split('=');
      if (parts.length < 2) return null;
      return { from: parts.shift().trim(), to: parts.join('=>').trim() };
    }).filter(item => item && item.from);
  }

  function applyGlobalReplacements(settings){
    if (document.body.classList.contains('site-settings-page')) return;
    const pairs = parseReplacementLines(settings.copyGlobalReplacements);
    if (!pairs.length) return;
    const walker = document.createTreeWalker(document.body, nodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if (!node.nodeValue || !node.nodeValue.trim()) return nodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return nodeFilter.FILTER_REJECT;
        if (['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(parent.tagName)) return nodeFilter.FILTER_REJECT;
        if (parent.closest('.site-settings-page, #quickViewModal')) return nodeFilter.FILTER_REJECT;
        return nodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      pairs.forEach(({from,to}) => {
        if (from) text = text.split(from).join(to);
      });
      node.nodeValue = text;
    });
  }

  function apply(settings = read()){
    document.querySelectorAll('.announcement-bar p').forEach(el => el.textContent = settings.announcement);
    document.querySelectorAll('.utility-wrap > p').forEach(el => el.textContent = settings.utility);
    document.querySelectorAll('.brand-name').forEach(el => el.textContent = settings.storeName);
    document.querySelectorAll('.brand-tag').forEach(el => el.textContent = settings.tagLine);
    document.querySelectorAll('.logo-wrap img.logo').forEach(img => {
      img.src = settings.logoData || settings.logoPath || defaults.logoPath;
      img.alt = `${settings.storeName} logo`;
    });
    document.querySelectorAll('.site-footer .footer-grid > div:first-child h4').forEach(el => el.textContent = settings.storeName);
    document.querySelectorAll('.site-footer .footer-grid > div:first-child p').forEach((el, index) => { if (index === 0) el.textContent = settings.footerNote; });
    const supportCards = document.querySelectorAll('.contact-card .trust-note-box, .trust-note-box.support-box');
    supportCards.forEach(box => {
      box.querySelector('.support-mini-stack')?.remove();
      const wrap = document.createElement('div');
      wrap.className = 'support-mini-stack';
      wrap.innerHTML = `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(settings.supportEmail)}">${escapeHtml(settings.supportEmail)}</a></p><p><strong>Phone:</strong> <a href="tel:${escapeHtml(settings.supportPhone.replace(/[^\d+]/g,''))}">${escapeHtml(settings.supportPhone)}</a></p>`;
      box.appendChild(wrap);
    });
    document.querySelectorAll('.header-socials, .footer-socials').forEach(el => el.remove());
    const headerActions = document.querySelector('.header-actions-bottom');
    if (headerActions) {
      const wrap = document.createElement('div');
      wrap.className = 'header-socials';
      wrap.innerHTML = socialMarkup(settings);
      if (wrap.innerHTML.trim()) headerActions.prepend(wrap);
    }
    document.querySelectorAll('[data-home-section]').forEach((section) => {
      const key = 'show' + section.dataset.homeSection.charAt(0).toUpperCase() + section.dataset.homeSection.slice(1);
      section.hidden = settings[key] === false;
    });
    const footerIntro = document.querySelector('.site-footer .footer-grid > div:first-child');
    if (footerIntro) {
      const wrap = document.createElement('div');
      wrap.className = 'footer-socials';
      wrap.innerHTML = socialMarkup(settings);
      if (wrap.innerHTML.trim()) footerIntro.appendChild(wrap);
    }
    applyCopy(settings);
    applyGlobalReplacements(settings);
    document.dispatchEvent(new CustomEvent('nova-brand-updated'));
  }

  function exportSettings(){
    const blob = new Blob([JSON.stringify(read(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nova-market-brand-settings.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 400);
  }

  function bindSettingsPage(){
    const page = document.getElementById('brandSettingsForm');
    if (!page) return;
    const fields = {
      storeName: $('#brandStoreName'), tagLine: $('#brandTagLine'), announcement: $('#brandAnnouncement'), utility: $('#brandUtility'), footerNote: $('#brandFooterNote'),
      supportEmail: $('#brandSupportEmail'), supportPhone: $('#brandSupportPhone'), instagram: $('#brandInstagram'), facebook: $('#brandFacebook'), pinterest: $('#brandPinterest'), tiktok: $('#brandTikTok'), youtube: $('#brandYouTube'), logoPath: $('#brandLogoPath'),
      showTrust: $('#brandShowTrust'), showCategories: $('#brandShowCategories'), showBestsellers: $('#brandShowBestsellers'), showBrands: $('#brandShowBrands'), showSellercta: $('#brandShowSellercta'), showReviews: $('#brandShowReviews'), showJournal: $('#brandShowJournal'), showFeaturedpicks: $('#brandShowFeaturedpicks'), showNewsletter: $('#brandShowNewsletter'),
      logoFile: $('#brandLogoFile'), logoPreview: $('#brandLogoPreview'), status: $('#brandSettingsStatus')
    };
    const settings = read();
    Object.entries(fields).forEach(([key, input]) => {
      if (!input || ['logoFile','logoPreview','status'].includes(key)) return;
      if (input.type === 'checkbox') input.checked = settings[key] !== false;
      else input.value = settings[key] || '';
    });
    if (fields.logoPreview) fields.logoPreview.src = settings.logoData || settings.logoPath || defaults.logoPath;
    page.addEventListener('submit', (event) => {
      event.preventDefault();
      const next = { ...read() };
      ['storeName','tagLine','announcement','utility','footerNote','supportEmail','supportPhone','instagram','facebook','pinterest','tiktok','youtube','logoPath'].forEach(key => {
        if (fields[key]) next[key] = fields[key].value.trim();
      });
      ['showTrust','showCategories','showBestsellers','showBrands','showSellercta','showReviews','showJournal','showFeaturedpicks','showNewsletter'].forEach(key => {
        if (fields[key]) next[key] = Boolean(fields[key].checked);
      });
      const finish = () => {
        save(next); apply(next);
        if (fields.status) fields.status.textContent = 'Brand settings saved.';
      };
      const file = fields.logoFile?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => { next.logoData = reader.result; finish(); if (fields.logoPreview) fields.logoPreview.src = reader.result; };
        reader.readAsDataURL(file);
      } else {
        finish();
        if (fields.logoPreview) fields.logoPreview.src = next.logoData || next.logoPath || defaults.logoPath;
      }
    });
    $('#brandSettingsReset')?.addEventListener('click', () => {
      const merged = { ...read(), ...Object.fromEntries(Object.keys(defaults).filter(k => !k.startsWith('copy')).map(k => [k, defaults[k]])) };
      save(merged);
      Object.entries(fields).forEach(([key, input]) => {
        if (!input || ['logoFile','logoPreview','status'].includes(key)) return;
        if (input.type === 'checkbox') input.checked = defaults[key] !== false;
        else input.value = defaults[key] || '';
      });
      if (fields.logoPreview) fields.logoPreview.src = defaults.logoPath;
      if (fields.status) fields.status.textContent = 'Brand settings reset to defaults.';
      apply(merged);
    });
    $('#brandSettingsExport')?.addEventListener('click', exportSettings);
    $('#brandSettingsImport')?.addEventListener('click', () => $('#brandSettingsImportFile')?.click());
    $('#brandSettingsImportFile')?.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = { ...defaults, ...(JSON.parse(reader.result) || {}) };
          save(imported); apply(imported); window.location.reload();
        } catch {
          if (fields.status) fields.status.textContent = 'That settings file could not be read.';
        }
      };
      reader.readAsText(file);
    });
  }

  function bindCopySettingsPage(){
    const page = document.getElementById('copySettingsForm');
    if (!page) return;
    const ids = Object.keys(copyDefaults);
    const settings = read();
    ids.forEach(key => { const input = document.getElementById(key); if (input) input.value = settings[key] || ''; });
    page.addEventListener('submit', (event) => {
      event.preventDefault();
      const next = { ...read() };
      ids.forEach(key => {
        const input = document.getElementById(key);
        if (input) next[key] = input.value;
      });
      save(next);
      apply(next);
      const status = document.getElementById('copySettingsStatus');
      if (status) status.textContent = 'Copy settings saved.';
    });
    document.getElementById('copySettingsReset')?.addEventListener('click', () => {
      const next = { ...read(), ...copyDefaults };
      save(next);
      ids.forEach(key => { const input = document.getElementById(key); if (input) input.value = copyDefaults[key] || ''; });
      apply(next);
      const status = document.getElementById('copySettingsStatus');
      if (status) status.textContent = 'Copy settings reset to defaults.';
    });
  }

  document.addEventListener('DOMContentLoaded', () => { apply(read()); bindSettingsPage(); bindCopySettingsPage(); });
  window.NovaBrandSettings = { read, save, apply };
})();