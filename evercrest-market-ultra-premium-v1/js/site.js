document.addEventListener("DOMContentLoaded", () => {
  const catalog = window.NovaCatalog;
  if (!catalog) return;

  const categoryNames = { home: "Home", fashion: "Fashion", tech: "Tech", accessories: "Accessories" };
  const PROFILE_KEY = "evercrestMarketProfile";
  const ADDRESS_KEY = "evercrestMarketAddresses";
  const CONTACT_KEY = "evercrestMarketMessages";
  const NEWSLETTER_KEY = "evercrestMarketNewsletter";
  const SEARCH_RECENTS_KEY = "evercrestMarketSearchRecents";
  const SELLER_PROFILE_KEY = "evercrestMarketSellerProfileV1";
  const BLOG_POSTS = {
    "Launch Better Product Photography in One Afternoon": {
      summary: "Use a window, one backdrop, and a repeatable shot list to make product pages look far more premium.",
      body: "Start with soft daylight near a window, keep the background clean, and capture at least four angles: front, close-up, scale shot, and lifestyle shot. Repeating the same image structure across every listing makes a storefront feel organized and expensive. Replace this paragraph later by opening blog.html and swapping the article text directly inside each card.",
      checklist: ["Front view with balanced spacing", "Close-up of materials or texture", "Lifestyle angle showing scale", "Consistent crop and file naming"]
    },
    "How to Make a Store Feel Trustworthy Fast": {
      summary: "Trust comes from clarity: shipping times, returns, support, and product detail all have to feel obvious.",
      body: "Customers hesitate when a store feels vague. Add shipping expectations, explain returns in plain language, include a visible contact option, and keep product descriptions specific. Those four pieces do more for conversions than flashy effects. Buyers of this template can swap this article by editing one title, one short intro, and one longer paragraph.",
      checklist: ["Clear shipping note", "Visible return policy", "Easy support page", "Specific product descriptions"]
    },
    "A Simple Content Plan for Small Online Shops": {
      summary: "One helpful article per week is enough to make the site feel alive, useful, and worth revisiting.",
      body: "An easy rhythm is: one product spotlight, one how-to, one customer question answer, and one seasonal feature each month. That gives the blog page real purpose instead of looking like filler. This demo article is intentionally written in a simple format so the template buyer can replace it in minutes.",
      checklist: ["Feature one product", "Answer one customer question", "Share one styling or usage tip", "Post one seasonal update"]
    }
  };
  const pageSpots = [
    { title: "Home Hero", description: "Main landing section with the Shop Collection buttons.", url: "index.html#top", keywords: ["home","hero","landing","shop collection"] },
    { title: "Shop Catalog", description: "Full product grid with filtering and sorting.", url: "shop.html", keywords: ["shop","catalog","products","sort","filter"] },
    { title: "Collections", description: "Grouped category browsing for home, fashion, tech, and accessories.", url: "collections.html", keywords: ["collections","categories","home","fashion","tech","accessories"] },
    { title: "Deals", description: "Sale items and promotion blocks.", url: "deals.html", keywords: ["deals","sale","discount","promo"] },
    { title: "Seller Dashboard", description: "Add, edit, delete, and manage products with a simple form.", url: "seller-dashboard.html", keywords: ["seller","dashboard","add product","manage"] },
    { title: "Contact Support", description: "Customer support and contact form page.", url: "contact.html", keywords: ["contact","support","help"] },
    { title: "FAQ", description: "Frequently asked questions about orders, shipping, and returns.", url: "faq.html", keywords: ["faq","questions","returns","shipping"] },
    { title: "Account", description: "Customer account page for profile, orders, and saved items.", url: "account.html", keywords: ["account","profile","orders"] },
    { title: "Tracking", description: "Track an order and view shipping progress.", url: "tracking.html", keywords: ["tracking","track order","shipping"] },
    { title: "Blog", description: "Editorial content, launch notes, and styling articles.", url: "blog.html", keywords: ["blog","articles","news"] },
  ];

  const formatPrice = (v) => `$${Number(v || 0).toFixed(2)}`;
  const normalize = (t) => String(t || "").trim().toLowerCase();
  const escapeHtml = (text) => String(text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  const readJson = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
  const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const readRecents = () => readJson(SEARCH_RECENTS_KEY, []);
  const saveRecentSearch = (value) => {
    const clean = String(value || '').trim();
    if (!clean) return;
    const next = [clean, ...readRecents().filter((item) => normalize(item) !== normalize(clean))].slice(0, 6);
    writeJson(SEARCH_RECENTS_KEY, next);
  };

  function sellerProfileDefaults() {
    return {
      storeName: 'Evercrest Select',
      supportEmail: 'seller@evercrest.demo',
      shipSpeed: 'Ships in 1–2 business days',
      returns: '30-day returns on unused items',
      bio: 'A polished multi-category storefront focused on premium presentation, fast fulfillment, and clean product detail.'
    };
  }

  function getSellerProfile() {
    return { ...sellerProfileDefaults(), ...readJson(SELLER_PROFILE_KEY, {}) };
  }

  function saveSellerProfile(profile) {
    writeJson(SELLER_PROFILE_KEY, { ...sellerProfileDefaults(), ...(profile || {}) });
  }

  function cartMetrics() {
    const lines = catalog.getCartDetailed();
    const subtotal = lines.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = lines.length ? (subtotal >= 100 ? 0 : 12) : 0;
    const tax = subtotal * 0.08;
    return { lines, subtotal, shipping, tax, total: subtotal + shipping + tax };
  }

  function showToast(message) {
    let toast = document.getElementById("siteToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "siteToast";
      toast.className = "site-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function productCard(product, compact = false) {
    const safeProduct = {
      id: product?.id || "product",
      title: product?.title || "Untitled Product",
      category: product?.category || "home",
      price: Number(product?.price || 0),
      image: product?.image || "images/product-1.jpg",
      gallery: Array.isArray(product?.gallery) ? product.gallery : [],
      description: product?.description || "Add a short product description here.",
      rating: Number(product?.rating || 4.8),
      reviews: Number(product?.reviews || 120),
      featured: Boolean(product?.featured),
      onSale: Boolean(product?.onSale),
      badge: product?.badge || "",
      ownerName: product?.ownerName || "Evercrest Select"
    };
    const badge = safeProduct.onSale ? "Sale" : (safeProduct.badge || (safeProduct.featured ? "Featured" : "New"));
    const inWishlist = catalog.getWishlist().includes(safeProduct.id);
    const secondaryImage = safeProduct.gallery.find((src) => src && src !== safeProduct.image) || safeProduct.image;
    const actionButtons = compact
      ? `<div class="button-group wrap-buttons compact-buttons">
            <button class="btn btn-secondary small-btn quick-view-btn" type="button" data-product-id="${safeProduct.id}">Quick View</button>
            <button class="btn btn-primary small-btn add-cart-btn" type="button" data-product-id="${safeProduct.id}">Add</button>
         </div>`
      : `<div class="button-group wrap-buttons">
            <button class="btn btn-secondary small-btn quick-view-btn" type="button" data-product-id="${safeProduct.id}">Quick View</button>
            <a href="product.html?id=${safeProduct.id}" class="btn small-btn">Details</a>
            <button class="btn btn-primary small-btn add-cart-btn" type="button" data-product-id="${safeProduct.id}">Add</button>
            <button class="btn btn-secondary small-btn add-wishlist-btn" type="button" data-product-id="${safeProduct.id}">${inWishlist ? "Saved" : "Save"}</button>
         </div>`;
    return `
      <article class="product-card shop-product ${compact ? 'compact-product-card' : ''}" data-product-id="${safeProduct.id}" data-name="${escapeHtml(safeProduct.title.toLowerCase())}" data-category="${escapeHtml(safeProduct.category)}" data-price="${safeProduct.price}" data-image="${escapeHtml(safeProduct.image)}" data-title="${escapeHtml(safeProduct.title)}" data-price-label="${formatPrice(safeProduct.price)}" data-description="${escapeHtml(safeProduct.description)}">
        <div class="product-badge ${safeProduct.onSale ? "sale-badge" : ""}">${badge}</div>
        <div class="product-image-shell">
          <img src="${safeProduct.image}" alt="${escapeHtml(safeProduct.title)}" class="primary-image" />
          <img src="${secondaryImage}" alt="${escapeHtml(safeProduct.title)} alternate view" class="secondary-image" />
          <div class="product-image-actions">
            <span class="product-category-pill">${escapeHtml(categoryNames[safeProduct.category] || safeProduct.category)}</span>
            <button class="quick-view-btn image-quick-view-btn" type="button" data-product-id="${safeProduct.id}">Quick View</button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-copy-top">
            <p class="product-owner-line">Sold by ${escapeHtml(safeProduct.ownerName)}</p>
            <h4>${escapeHtml(safeProduct.title)}</h4>
            <p>${escapeHtml(safeProduct.description)}</p>
          </div>
          <div class="rating-line">★★★★★ <span>${safeProduct.rating.toFixed(1)} • ${safeProduct.reviews} reviews</span></div>
          <div class="product-meta">
            <span>${formatPrice(safeProduct.price)}</span>
            ${actionButtons}
          </div>
        </div>
      </article>`;
  }

  const pageCard = (page) => `
    <a class="search-page-card" href="${page.url}">
      <p class="section-kicker">Site Spot</p>
      <h4>${escapeHtml(page.title)}</h4>
      <p>${escapeHtml(page.description)}</p>
      <span class="search-page-link">Open page →</span>
    </a>`;

  const matchesProduct = (product, query) => !query || [product.title, product.description, product.category, ...(product.keywords || [])].join(" ").toLowerCase().includes(query);
  const matchesPage = (page, query) => !query || [page.title, page.description, ...(page.keywords || [])].join(" ").toLowerCase().includes(query);
  const getSuggestions = () => [...new Set([...catalog.getAllProducts().slice(0, 10).map((item) => item.title), "Deals", "Collections", "Seller Dashboard", "Track Order", "FAQ", "Contact Support"])];

  function updateHeaderCounts() {
    const cartCount = catalog.getCart().reduce((sum, item) => sum + item.quantity, 0);
    const wishCount = catalog.getWishlist().length;
    const settings = window.NovaBrandSettings?.read?.() || {};
    const cartLabel = settings.copyHeaderCart || 'Cart';
    const wishlistLabel = settings.copyHeaderWishlist || 'Wishlist';
    document.querySelectorAll('a[href="cart.html"].cart-pill').forEach((el) => el.textContent = `🛒 ${cartLabel} (${cartCount})`);
    document.querySelectorAll('.header-wishlist-link').forEach((el) => el.textContent = `❤ ${wishlistLabel} (${wishCount})`);
  }

  function setupHeaderSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("headerSearchForm");
    const ghostPlaceholder = document.getElementById("ghostPlaceholder");
    const ghostWrap = document.querySelector(".ghost-search-wrap");
    const suggestionsBox = document.getElementById("searchSuggestions");
    if (!searchInput || !searchForm) return;
    const queryParams = new URLSearchParams(window.location.search);
    const existingQuery = queryParams.get("q") || queryParams.get("search") || "";
    if (existingQuery) searchInput.value = existingQuery;
    const ghostWords = ["Search all products", "Search collections", "Search deals", "Search seller dashboard", "Search order tracking", "Search support"];
    if (ghostPlaceholder && ghostWrap) {
      ghostPlaceholder.textContent = ghostWords[0];
      let ghostIndex = 0;
      setInterval(() => {
        if (document.activeElement === searchInput || searchInput.value.trim()) return;
        ghostPlaceholder.classList.remove("fade-in");
        ghostPlaceholder.classList.add("fade-out");
        setTimeout(() => {
          ghostIndex = (ghostIndex + 1) % ghostWords.length;
          ghostPlaceholder.textContent = ghostWords[ghostIndex];
          ghostPlaceholder.classList.remove("fade-out");
          ghostPlaceholder.classList.add("fade-in");
        }, 220);
      }, 2200);
      searchInput.addEventListener("focus", () => ghostWrap.classList.add("focused"));
      searchInput.addEventListener("blur", () => ghostWrap.classList.remove("focused"));
      searchInput.addEventListener("input", () => ghostWrap.classList.toggle("typing", Boolean(searchInput.value.trim())));
    }
    if (suggestionsBox) {
      const renderSuggestions = () => {
        const query = normalize(searchInput.value);
        const liveMatches = getSuggestions().filter((item) => item.toLowerCase().includes(query)).slice(0, 6);
        const recent = readRecents();
        const trending = ["gift ideas", "best sellers", "desk setup", "travel essentials", "on sale now"];
        const pageMatches = pageSpots.filter((item) => !query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.keywords.some((kw) => kw.includes(query))).slice(0, 3);
        const productMatches = catalog.getAllProducts().filter((item) => !query || matchesProduct(item, query)).slice(0, 3);
        if (document.activeElement !== searchInput) {
          suggestionsBox.classList.remove("show");
          suggestionsBox.innerHTML = "";
          return;
        }
        const header = !query && recent.length ? `<div class="search-suggestion-block"><p class="search-suggestion-label">Recent</p>${recent.map((item) => `<button type="button" class="search-chip-btn" data-value="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div>` : '';
        const trends = !query ? `<div class="search-suggestion-block"><p class="search-suggestion-label">Trending</p>${trending.map((item) => `<button type="button" class="search-chip-btn" data-value="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div>` : '';
        const suggestions = liveMatches.length ? `<div class="search-suggestion-block"><p class="search-suggestion-label">Suggestions</p>${liveMatches.map((item) => `<button type="button" class="search-suggestion-item" data-value="${escapeHtml(item)}"><span class="search-suggestion-icon">↗</span><span>${escapeHtml(item)}</span></button>`).join("")}</div>` : '';
        const products = productMatches.length ? `<div class="search-suggestion-block"><p class="search-suggestion-label">Products</p>${productMatches.map((item) => `<a class="search-product-item" href="product.html?id=${item.id}"><img src="${item.image}" alt="${escapeHtml(item.title)}"><span><strong>${escapeHtml(item.title)}</strong><small>${formatPrice(item.price)}</small></span></a>`).join("")}</div>` : '';
        const pages = pageMatches.length ? `<div class="search-suggestion-block"><p class="search-suggestion-label">Pages</p>${pageMatches.map((item) => `<a class="search-page-link-item" href="${item.url}">${escapeHtml(item.title)}</a>`).join("")}</div>` : '';
        const markup = header + trends + suggestions + products + pages;
        if (!markup.trim()) {
          suggestionsBox.classList.remove("show");
          suggestionsBox.innerHTML = "";
          return;
        }
        suggestionsBox.innerHTML = markup;
        suggestionsBox.classList.add("show");
        suggestionsBox.querySelectorAll(".search-suggestion-item, .search-chip-btn").forEach((item) => {
          item.addEventListener("click", () => {
            searchInput.value = item.dataset.value || item.textContent || "";
            suggestionsBox.classList.remove("show");
            searchForm.requestSubmit();
          });
        });
      };
      searchInput.addEventListener("focus", renderSuggestions);
      searchInput.addEventListener("input", renderSuggestions);
      document.addEventListener("click", (event) => { if (!searchForm.contains(event.target)) suggestionsBox.classList.remove("show"); });
    }
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const q = searchInput.value.trim();
      saveRecentSearch(q);
      window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    });
  }

  function renderHomeFeatured() {
    const grid = document.getElementById("homeFeaturedGrid");
    if (grid) {
      const items = catalog.getAllProducts().filter((item) => item.featured).slice(0, 8);
      grid.innerHTML = items.map((item) => productCard(item)).join("");
    }

    const featuredTrack = document.getElementById("featuredTrack");
    if (featuredTrack) {
      const arrivals = [...catalog.getAllProducts()]
        .sort((a, b) => String(b.id).localeCompare(String(a.id)))
        .slice(0, 8);
      featuredTrack.innerHTML = arrivals.map((item) => `
        <article class="featured-slide product-card shop-product" data-product-id="${item.id}">
          <div class="product-badge ${item.onSale ? 'sale-badge' : ''}">${item.badge || (item.onSale ? 'Sale' : 'New')}</div>
          <img src="${item.image}" alt="${escapeHtml(item.title)}" />
          <div class="product-info">
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.description)}</p>
            <div class="product-meta">
              <span>${formatPrice(item.price)}</span>
              <a href="product.html?id=${item.id}" class="btn small-btn">View Product</a>
            </div>
          </div>
        </article>`).join("");
    }
  }

  function renderShop() {
    const grid = document.getElementById("shopGrid") || document.getElementById("productGrid");
    if (!grid) return;

    const searchInput = document.getElementById('shopSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortBy') || document.getElementById('sortFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const emptyState = document.getElementById('shopEmptyState');
    const sidebarLinks = document.querySelectorAll('.sidebar-filter-list [data-shop-filter]');
    if (sidebarLinks.length && !document.querySelector('.sidebar-filter-list [data-shop-filter].active')) sidebarLinks[0].classList.add('active');

    const params = new URLSearchParams(window.location.search);
    if (searchInput && !searchInput.value && (params.get('q') || params.get('search'))) {
      searchInput.value = params.get('q') || params.get('search') || '';
    }
    if (categoryFilter && params.get('category')) categoryFilter.value = params.get('category');

    function applySidebarFilter(items, mode) {
      if (!mode || mode === 'all') return items;
      if (mode === 'new') return [...items].sort((a, b) => String(b.id).localeCompare(String(a.id)));
      if (mode === 'top') return items.filter((item) => Number(item.rating || 0) >= 4.8);
      if (mode === 'best') return [...items].sort((a, b) => Number(b.reviews || 0) - Number(a.reviews || 0));
      if (mode === 'sale') return items.filter((item) => item.onSale);
      if (mode === 'gift') return items.filter((item) => Number(item.price || 0) <= 100 || ['home','accessories'].includes(item.category));
      return items;
    }

    function draw() {
      let items = [...catalog.getAllProducts()];
      const searchValue = normalize(searchInput?.value || '');
      const categoryValue = categoryFilter?.value || 'all';
      const sortValue = sortFilter?.value || 'default';
      const availabilityValue = availabilityFilter?.value || 'all';
      const activeSidebar = document.querySelector('.sidebar-filter-list [data-shop-filter].active')?.dataset.shopFilter || 'all';

      if (searchValue) items = items.filter((item) => matchesProduct(item, searchValue));
      if (categoryValue !== 'all') items = items.filter((item) => item.category === categoryValue);
      if (availabilityValue === 'in-stock') items = items.filter((item) => Number(item.stock || 0) > 0);
      if (availabilityValue === 'featured') items = items.filter((item) => item.featured);
      if (availabilityValue === 'on-sale') items = items.filter((item) => item.onSale);

      items = applySidebarFilter(items, activeSidebar);

      if (sortValue === 'low' || sortValue === 'price-low') items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      if (sortValue === 'high' || sortValue === 'price-high') items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      if (sortValue === 'name-az') items.sort((a, b) => a.title.localeCompare(b.title));
      if (sortValue === 'name-za') items.sort((a, b) => b.title.localeCompare(a.title));

      grid.innerHTML = items.map((item) => productCard(item)).join('');
      if (emptyState) emptyState.hidden = items.length !== 0;
    }

    [searchInput, categoryFilter, sortFilter, availabilityFilter].forEach((el) => {
      if (!el || el.dataset.bound === 'true') return;
      el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', draw);
      el.dataset.bound = 'true';
    });

    sidebarLinks.forEach((link) => {
      if (link.dataset.bound === 'true') return;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        sidebarLinks.forEach((other) => other.classList.remove('active'));
        link.classList.add('active');
        draw();
      });
      link.dataset.bound = 'true';
    });

    draw();
  }

  function renderCollections() {
    const wrap = document.getElementById("collectionLiveGrid") || document.querySelector(".collection-live-grid");
    const all = catalog.getAllProducts();
    const targetMap = {
      collectionHomeGrid: 'home',
      collectionFashionGrid: 'fashion',
      collectionTechGrid: 'tech',
      collectionAccessoriesGrid: 'accessories'
    };

    Object.entries(targetMap).forEach(([id, key]) => {
      const target = document.getElementById(id);
      if (!target) return;
      target.innerHTML = all.filter((item) => item.category === key).slice(0, 3).map((item) => productCard(item, true)).join('');
    });

    if (!wrap || Object.keys(targetMap).some((id) => document.getElementById(id))) return;
    const groups = Object.keys(categoryNames).map((key) => ({ key, items: all.filter((item) => item.category === key).slice(0, 3) }));
    wrap.innerHTML = groups.map((group) => `<div class="notice-card category-panel"><p class="section-kicker">${categoryNames[group.key]}</p><h3>${categoryNames[group.key]} Picks</h3><div class="product-grid compact-collection-grid">${group.items.map((item) => productCard(item, true)).join("")}</div></div>`).join("");
  }

  function renderDeals() {
    const grid = document.getElementById("dealsGrid") || document.querySelector('.deals-grid');
    const emptyState = document.getElementById("dealsEmptyState");
    if (!grid) return;
    const items = catalog.getAllProducts().filter((item) => item.onSale);
    grid.innerHTML = items.length ? items.map((item) => productCard(item, true)).join("") : `<div class="empty-dynamic-state"><p>No deal items yet.</p><a href="seller-dashboard.html" class="btn btn-primary small-btn">Add a Sale Product</a></div>`;
    if (emptyState) emptyState.hidden = items.length !== 0;
  }

  function renderFeaturedCarousel() {
    const track = document.querySelector('.brand-slider-track');
    if (!track || track.dataset.looped === 'true') return;
    track.innerHTML += track.innerHTML;
    track.dataset.looped = 'true';
  }

  function renderProductPage() {
    const title = document.getElementById("productTitle");
    if (!title) return;
    const requestedId = new URLSearchParams(window.location.search).get("id") || catalog.getAllProducts()[0]?.id;
    const product = catalog.findProduct(requestedId) || catalog.getAllProducts()[0];
    if (!product) return;
    const mainImage = document.getElementById("productMainImage");
    const thumbRow = document.getElementById("productThumbRow");
    const eyebrow = document.getElementById("productEyebrow");
    const rating = document.getElementById("productRating");
    const price = document.getElementById("productPrice");
    const description = document.getElementById("productDescription");
    const features = document.getElementById("productFeatures");
    const metaBox = document.getElementById("productMetaBox");
    if (eyebrow) eyebrow.textContent = categoryNames[product.category] || "Featured Product";
    title.textContent = product.title;
    document.title = `${product.title} | Evercrest Market`;
    if (rating) rating.innerHTML = `★★★★★ <span>${product.rating || 4.8} rating • ${product.reviews || 120} reviews</span>`;
    if (price) price.textContent = formatPrice(product.price);
    if (description) description.textContent = product.description;
    if (mainImage) { mainImage.src = product.image; mainImage.alt = product.title; }
    if (thumbRow) {
      thumbRow.innerHTML = (product.gallery || [product.image]).map((src) => `<img src="${src}" alt="${escapeHtml(product.title)}" />`).join("");
      thumbRow.querySelectorAll("img").forEach((img) => img.addEventListener("click", () => { if (mainImage) { mainImage.src = img.src; mainImage.alt = product.title; } }));
    }
    const sellerProfile = getSellerProfile();
    if (features) features.innerHTML = `<p>• Category: ${categoryNames[product.category] || product.category}</p><p>• Stock available: ${product.stock}</p><p>• Featured on storefront: ${product.featured ? "Yes" : "No"}</p><p>• Deal status: ${product.onSale ? "Currently on sale" : "Regular pricing"}</p>`;
    if (metaBox) metaBox.innerHTML = `<p><strong>Seller:</strong> ${escapeHtml(product.ownerName || sellerProfile.storeName)}</p><p><strong>Shipping:</strong> ${escapeHtml(sellerProfile.shipSpeed)}</p><p><strong>Returns:</strong> ${escapeHtml(sellerProfile.returns)}</p><p><strong>Support:</strong> <a href="mailto:${escapeHtml(sellerProfile.supportEmail)}">${escapeHtml(sellerProfile.supportEmail)}</a></p>`;
    const actionAnchor = document.querySelector('.product-action-row, .hero-buttons');
    if (actionAnchor && !document.getElementById('productActionButtons')) {
      const wrap = document.createElement('div');
      wrap.id = 'productActionButtons';
      wrap.className = 'hero-buttons product-action-row';
      wrap.innerHTML = `<button class="btn btn-primary add-cart-btn" type="button" data-product-id="${product.id}">Add to Cart</button><button class="btn btn-secondary add-wishlist-btn" type="button" data-product-id="${product.id}">${catalog.getWishlist().includes(product.id) ? 'Saved to Wishlist' : 'Save to Wishlist'}</button>`;
      actionAnchor.parentNode.insertBefore(wrap, actionAnchor.nextSibling);
    }
    const relatedGrid = document.getElementById("relatedProductsGrid");
    if (relatedGrid) relatedGrid.innerHTML = catalog.getAllProducts().filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map((item) => productCard(item, true)).join("");
    const recentGrid = document.getElementById("recentlyViewedGrid");
    if (recentGrid) recentGrid.innerHTML = catalog.getAllProducts().filter((item) => item.id !== product.id).slice(0, 3).map((item) => productCard(item, true)).join("");
  }

  function renderSearchPage() {
    const productResults = document.getElementById("searchProductResults");
    if (!productResults) return;
    const query = normalize(new URLSearchParams(window.location.search).get("q"));
    const title = document.getElementById("searchPageTitle");
    const summary = document.getElementById("searchPageSummary");
    const pageResults = document.getElementById("searchPageResults");
    const emptyProducts = document.getElementById("searchProductEmpty");
    const emptyPages = document.getElementById("searchPageEmpty");
    if (title) title.textContent = query ? `Results for “${query}”` : "Search Results";
    if (summary) summary.textContent = query ? `Showing products and pages that match “${query}”.` : "Type something into the search bar to search the full storefront.";
    const products = catalog.getAllProducts().filter((item) => matchesProduct(item, query));
    const pages = pageSpots.filter((item) => matchesPage(item, query));
    productResults.innerHTML = products.map((item) => productCard(item)).join("");
    if (pageResults) pageResults.innerHTML = pages.map((item) => pageCard(item)).join("");
    if (emptyProducts) emptyProducts.hidden = products.length !== 0;
    if (emptyPages) emptyPages.hidden = pages.length !== 0;
  }

  function renderSellerDashboard() {
    const form = document.getElementById("sellerProductForm");
    if (!form) return;
    const fields = {
      id: document.getElementById("sellerProductId"),
      name: document.getElementById("sellerProductName"),
      category: document.getElementById("sellerCategory"),
      price: document.getElementById("sellerPrice"),
      stock: document.getElementById("sellerStock"),
      image: document.getElementById("sellerImage"),
      imageFile: document.getElementById("sellerImageFile"),
      description: document.getElementById("sellerDescription"),
      featured: document.getElementById("sellerFeatured"),
      onSale: document.getElementById("sellerOnSale"),
      preview: document.getElementById("sellerImagePreview")
    };
    const status = document.getElementById("sellerStatus");
    const preview = document.getElementById("sellerPreviewGrid");
    const table = document.getElementById("sellerProductsTable");
    const submitButton = form.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('sellerFormReset');
    const resetCatalogButton = document.getElementById('sellerCatalogReset');
    const listingCount = document.getElementById('sellerListingCount');
    const imageLibrary = document.getElementById('sellerImageLibrary');

    function setPreview(src) {
      if (!fields.preview) return;
      if (src) {
        fields.preview.innerHTML = `<img src="${src}" alt="Listing preview"><span>Image preview ready</span>`;
      } else {
        fields.preview.innerHTML = `<span>No image selected yet. Use an included image path like images/product-1.jpg or upload a file.</span>`;
      }
    }

    function fillForm(product) {
      fields.id.value = product?.id || "";
      fields.name.value = product?.title || "";
      fields.category.value = product?.category || "";
      fields.price.value = product?.price ?? "";
      fields.stock.value = product?.stock ?? "";
      fields.image.value = product?.image || "";
      fields.description.value = product?.description || "";
      fields.featured.checked = Boolean(product?.featured);
      fields.onSale.checked = Boolean(product?.onSale);
      setPreview(product?.image || "");
      if (submitButton) submitButton.textContent = product ? 'Save Changes' : 'Publish Product';
      if (status) status.textContent = product ? `Editing ${product.title}. Save changes to update it across the store.` : 'Fill out the form and click Publish Product. Your item will appear across the store automatically.';
      fields.imageFile.value = '';
    }

    const currentUser = window.NovaAuth?.getCurrentUser?.() || null;
    const canManage = (item) => window.NovaAuth?.canManageProduct ? window.NovaAuth.canManageProduct(item, currentUser) : true;
    const sellerProfileForm = document.getElementById('sellerProfileForm');
    const sellerProfileStatus = document.getElementById('sellerProfileStatus');
    const sellerSnapshot = document.getElementById('sellerStoreSnapshot');
    function paintSellerProfile() {
      const profile = getSellerProfile();
      if (document.getElementById('sellerStoreName')) document.getElementById('sellerStoreName').value = profile.storeName;
      if (document.getElementById('sellerStoreEmail')) document.getElementById('sellerStoreEmail').value = profile.supportEmail;
      if (document.getElementById('sellerStoreShipSpeed')) document.getElementById('sellerStoreShipSpeed').value = profile.shipSpeed;
      if (document.getElementById('sellerStoreReturns')) document.getElementById('sellerStoreReturns').value = profile.returns;
      if (document.getElementById('sellerStoreBio')) document.getElementById('sellerStoreBio').value = profile.bio;
      if (sellerSnapshot) sellerSnapshot.innerHTML = `<p><strong>${escapeHtml(profile.storeName)}</strong></p><p>${escapeHtml(profile.bio)}</p><p><strong>Shipping:</strong> ${escapeHtml(profile.shipSpeed)}</p><p><strong>Returns:</strong> ${escapeHtml(profile.returns)}</p><p><strong>Support:</strong> <a href="mailto:${escapeHtml(profile.supportEmail)}">${escapeHtml(profile.supportEmail)}</a></p>`;
    }
    sellerProfileForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      saveSellerProfile({
        storeName: document.getElementById('sellerStoreName')?.value?.trim(),
        supportEmail: document.getElementById('sellerStoreEmail')?.value?.trim(),
        shipSpeed: document.getElementById('sellerStoreShipSpeed')?.value?.trim(),
        returns: document.getElementById('sellerStoreReturns')?.value?.trim(),
        bio: document.getElementById('sellerStoreBio')?.value?.trim()
      });
      paintSellerProfile();
      if (sellerProfileStatus) sellerProfileStatus.textContent = 'Store profile saved.';
      showToast('Store profile saved.');
    });
    document.getElementById('sellerProfileReset')?.addEventListener('click', () => { saveSellerProfile(sellerProfileDefaults()); paintSellerProfile(); if (sellerProfileStatus) sellerProfileStatus.textContent = 'Store profile reset.'; });
    function currentProducts() { return catalog.getAllProducts(); }
    const demoOrdersFallback = [
      { id:'NM-482193', createdAt:new Date(Date.now()-86400000*2).toISOString(), status:'Packed', customer:{name:'Maya Carter', email:'maya@shopdemo.com'}, total:186.00 },
      { id:'NM-482118', createdAt:new Date(Date.now()-86400000*3).toISOString(), status:'Shipped', customer:{name:'Ethan Webb', email:'ethan@shopdemo.com'}, total:74.00 },
      { id:'NM-481990', createdAt:new Date(Date.now()-86400000*5).toISOString(), status:'Confirmed', customer:{name:'Lena Scott', email:'lena@shopdemo.com'}, total:242.00 }
    ];
    function sellerScopedOrders() {
      const live = catalog.getOrders();
      return (live.length ? live : demoOrdersFallback).slice(0, 6);
    }
    function sellerMessages() {
      const inbound = readJson(CONTACT_KEY, []);
      if (inbound.length) return inbound.slice(0, 6);
      return [
        { name:'Jordan Price', email:'jordan@example.com', subject:'Bulk order question', message:'Can you tell me how long 20 gift boxes take to ship?', createdAt:new Date(Date.now()-86400000).toISOString() },
        { name:'Harper Lane', email:'harper@example.com', subject:'Restock timing', message:'Will the premium headphones be back this month?', createdAt:new Date(Date.now()-86400000*2).toISOString() }
      ];
    }
    function drawImageLibrary() {
      if (!imageLibrary || !catalog.defaultProducts) return;
      const firstSixteen = catalog.defaultProducts.slice(0, 16);
      imageLibrary.innerHTML = firstSixteen.map((item, index) => `
        <button class="bundled-image-chip seller-image-chip" type="button" data-image="${item.image}">
          <img src="${item.image}" alt="${escapeHtml(item.title)} preview">
          <span>${item.image}</span>
        </button>
      `).join('');
    }


    function draw() {
      const all = currentProducts();
      const managedListings = currentUser?.role === 'seller' ? all.filter((item) => item.isCustom && item.ownerId === currentUser.id) : all;
      const featuredCount = managedListings.filter((item) => item.featured).length;
      const dealsCount = managedListings.filter((item) => item.onSale).length;
      const catCount = new Set(managedListings.map((item) => item.category)).size;
      const total = managedListings.length;
      const orders = sellerScopedOrders();
      const messageList = sellerMessages();
      const lowStock = managedListings.filter((item) => Number(item.stock) <= 8).sort((a,b) => Number(a.stock) - Number(b.stock)).slice(0, 6);
      const gross = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      const pending = gross * 0.22;
      const ready = gross * 0.78;
      paintSellerProfile();
      const storeNameBadge = document.querySelector('.account-welcome-card h2');
      if (storeNameBadge) storeNameBadge.textContent = `${getSellerProfile().storeName} Dashboard`;
      const statMap = { sellerTotalProducts: total, sellerLiveCategories: catCount, sellerDealsCount: dealsCount, sellerFeaturedCount: featuredCount };
      Object.entries(statMap).forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = value; });
      const payoutCards = document.getElementById('sellerPayoutCards');
      if (payoutCards) payoutCards.innerHTML = `<div class="stat-card"><strong>${formatPrice(gross)}</strong><span>Last 30 days</span></div><div class="stat-card"><strong>${formatPrice(ready)}</strong><span>Ready to payout</span></div><div class="stat-card"><strong>${formatPrice(pending)}</strong><span>Pending reserve</span></div><div class="stat-card"><strong>${orders.length}</strong><span>Orders this cycle</span></div>`;
      const ordersTable = document.getElementById('sellerOrdersTable');
      if (ordersTable) ordersTable.innerHTML = `<div class="listing-row listing-head seller-listing-head"><span>Order</span><span>Customer</span><span>Status</span><span>Total</span></div>${orders.map((order) => `<div class="listing-row seller-listing-row"><span><strong>#${order.id}</strong><small>${new Date(order.createdAt).toLocaleDateString()}</small></span><span>${escapeHtml(order.customer?.name || 'Guest')}</span><span><span class="seller-status-pill ${normalize(order.status)}">${escapeHtml(order.status)}</span></span><span>${formatPrice(order.total || 0)}</span></div>`).join('')}`;
      const messagesWrap = document.getElementById('sellerMessagesList');
      if (messagesWrap) messagesWrap.innerHTML = messageList.length ? messageList.map((message) => `<article class="seller-message-card"><div class="seller-message-top"><strong>${escapeHtml(message.subject || 'Customer question')}</strong><span>${new Date(message.createdAt).toLocaleDateString()}</span></div><p>${escapeHtml(message.message || '')}</p><div class="seller-message-meta"><span>${escapeHtml(message.name || 'Guest')}</span><a href="mailto:${escapeHtml(message.email || '')}">${escapeHtml(message.email || '')}</a></div></article>`).join('') : `<div class="empty-dynamic-state"><p>No messages yet.</p><span>Customer questions from the contact page will appear here.</span></div>`;
      const payoutsTable = document.getElementById('sellerPayoutTable');
      if (payoutsTable) payoutsTable.innerHTML = `<div class="listing-row listing-head seller-listing-head"><span>Period</span><span>Gross Sales</span><span>Payout Status</span><span>Transfer</span></div><div class="listing-row seller-listing-row"><span>Current cycle</span><span>${formatPrice(gross)}</span><span><span class="seller-status-pill packed">Scheduled</span></span><span>${new Date(Date.now()+86400000*3).toLocaleDateString()}</span></div><div class="listing-row seller-listing-row"><span>Last cycle</span><span>${formatPrice(gross * 0.86)}</span><span><span class="seller-status-pill shipped">Paid</span></span><span>${new Date(Date.now()-86400000*8).toLocaleDateString()}</span></div>`;
      const inventoryWrap = document.getElementById('sellerInventoryAlerts');
      if (inventoryWrap) inventoryWrap.innerHTML = lowStock.length ? lowStock.map((item) => `<div class="seller-alert-card"><div><strong>${escapeHtml(item.title)}</strong><p>${categoryNames[item.category] || item.category}</p></div><div class="seller-alert-meta"><span class="seller-stock-badge ${Number(item.stock) <= 3 ? 'critical' : ''}">${item.stock} left</span><button class="btn btn-secondary small-btn seller-edit-btn" type="button" data-product-id="${item.id}">Restock</button></div></div>`).join('') : `<div class="empty-dynamic-state"><p>No low-stock alerts right now.</p><span>When stock drops below 8, the listing will appear here.</span></div>`;
      if (listingCount) listingCount.textContent = `${total} live listings`;
      if (preview) preview.innerHTML = (managedListings.length ? managedListings : all.slice(0,8)).slice(0, 8).map((item) => productCard(item, true)).join("");
      if (table) {
        table.innerHTML = `<div class="listing-row listing-head seller-listing-head"><span>Product</span><span>Category</span><span>Price</span><span>Actions</span></div>${all.map((item) => {
          const editable = canManage(item);
          const actionMarkup = editable
            ? `<button class="btn btn-secondary small-btn seller-edit-btn" type="button" data-product-id="${item.id}">Edit</button><button class="btn btn-secondary small-btn seller-delete-btn" type="button" data-product-id="${item.id}">Delete</button>`
            : `<span class="seller-readonly-badge">${item.isCustom ? 'Another seller listing' : 'Starter catalog item'}</span>`;
          return `
          <div class="listing-row seller-listing-row ${editable ? '' : 'seller-row-readonly'}">
            <span class="seller-row-title"><img src="${item.image}" alt="${escapeHtml(item.title)}"><strong>${escapeHtml(item.title)}</strong></span>
            <span>${categoryNames[item.category] || item.category}</span>
            <span>${formatPrice(item.price)}</span>
            <span class="seller-row-actions">
              <a class="btn small-btn" href="product.html?id=${item.id}">View</a>
              ${actionMarkup}
            </span>
          </div>`}).join("")}`;
      }
    }

    fields.image.addEventListener('input', () => setPreview(fields.image.value.trim()));
    fields.imageFile.addEventListener('change', () => {
      const file = fields.imageFile.files?.[0];
      if (!file) return setPreview(fields.image.value.trim());
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = fields.name.value.trim();
      const category = fields.category.value;
      const price = Number(fields.price.value);
      const stock = Number(fields.stock.value);
      const description = fields.description.value.trim();
      if (!title || !category || !description || Number.isNaN(price) || Number.isNaN(stock) || price < 0 || stock < 0) {
        if (status) status.textContent = "Fill out name, category, price, stock, and description first.";
        showToast('Please fill out the product form first.');
        return;
      }
      const finishSave = (resolvedImage) => {
        const fallbackImage = `images/product-${((catalog.getAllProducts().length % 16) || 16)}.jpg`;
        const image = resolvedImage || fields.image.value.trim() || fallbackImage;
        const productData = { title, category, price, stock, image, gallery: [image], description, rating: 4.8, reviews: 12, featured: fields.featured.checked, onSale: fields.onSale.checked, badge: fields.onSale.checked ? "Sale" : fields.featured.checked ? "Featured" : "New", keywords: [title, category, description, "seller", "listing"], ownerId: currentUser?.id || "owner-root", ownerName: getSellerProfile().storeName || currentUser?.name || "Site Owner" };
        const editingId = fields.id.value.trim();
        if (editingId) {
          catalog.updateProduct(editingId, productData);
          if (status) status.innerHTML = `${escapeHtml(title)} was updated across the storefront.`;
          showToast(`${title} updated.`);
        } else {
          const product = { id: `${catalog.slugify(title)}-${Date.now().toString().slice(-5)}`, ...productData, isCustom: true };
          catalog.addProduct(product);
          if (status) status.innerHTML = `${escapeHtml(title)} is now live. <a href="product.html?id=${product.id}">Open its product page</a>`;
          showToast(`${title} is now live.`);
          setTimeout(() => { window.location.href = `product.html?id=${product.id}`; }, 500);
        }
        form.reset();
        fillForm(null);
        draw();
        updateHeaderCounts();
  document.addEventListener('nova-brand-updated', updateHeaderCounts);
        renderHomeFeatured();
        renderFeaturedCarousel();
        renderDeals();
        renderCollections();
        renderShop();
      };
      const file = fields.imageFile?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => finishSave(reader.result);
        reader.readAsDataURL(file);
      } else {
        finishSave(fields.image.value.trim());
      }
    });

    resetButton?.addEventListener('click', () => { form.reset(); fillForm(null); showToast('Form cleared.'); });
    resetCatalogButton?.addEventListener('click', () => {
      const okay = window.confirm('Reset the catalog back to the original 16 demo products? This removes any custom products saved in this browser.');
      if (!okay) return;
      catalog.resetProducts();
      fillForm(null);
      draw();
      updateHeaderCounts();
  document.addEventListener('nova-brand-updated', updateHeaderCounts);
      renderHomeFeatured();
      renderFeaturedCarousel();
      renderDeals();
      renderCollections();
      renderShop();
      showToast('Catalog reset to the original 16 demo products.');
    });

    function beginEditProduct(productId) {
      const product = catalog.findProduct(productId);
      if (product) {
        fillForm(product);
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`Editing ${product.title}.`);
      }
    }
    table?.addEventListener('click', (event) => {
      const edit = event.target.closest('.seller-edit-btn');
      const del = event.target.closest('.seller-delete-btn');
      if (edit) {
        beginEditProduct(edit.dataset.productId);
        return;
      }
      if (del) {
        const product = catalog.findProduct(del.dataset.productId);
        if (!product) return;
        if (!canManage(product)) { showToast("This listing belongs to another account."); return; }
        const okay = window.confirm(`Remove ${product.title} from the storefront?`);
        if (!okay) return;
        catalog.deleteCustomProduct(del.dataset.productId);
        draw();
        updateHeaderCounts();
  document.addEventListener('nova-brand-updated', updateHeaderCounts);
        renderHomeFeatured();
        renderFeaturedCarousel();
        renderDeals();
        renderCollections();
        renderShop();
        if (fields.id.value === del.dataset.productId) fillForm(null);
        showToast(`${product.title} removed from the storefront.`);
      }
    });
    document.getElementById('sellerInventoryAlerts')?.addEventListener('click', (event) => {
      const edit = event.target.closest('.seller-edit-btn');
      if (!edit) return;
      beginEditProduct(edit.dataset.productId);
    });

    imageLibrary?.addEventListener('click', (event) => {
      const chip = event.target.closest('.seller-image-chip');
      if (!chip) return;
      const imagePath = chip.dataset.image || '';
      fields.image.value = imagePath;
      fields.imageFile.value = '';
      setPreview(imagePath);
      if (status) status.textContent = `${imagePath} selected. You can publish now or keep editing the form.`;
      showToast('Image path added to the form.');
    });

    fillForm(null);
    drawImageLibrary();
    draw();
  }

  function renderCartPage() {
    const cartGrid = document.querySelector('.cart-grid'); if (!cartGrid) return;
    const cards = cartGrid.querySelectorAll('.cart-card'); if (cards.length < 2) return;
    const [itemsCard, summaryCard] = cards; const metrics = cartMetrics();
    const recommendations = catalog.getAllProducts().slice(0,3).map((item) => `<a href="product.html?id=${item.id}" class="empty-state-link">${escapeHtml(item.title)}</a>`).join('');
    const itemMarkup = metrics.lines.length ? metrics.lines.map((line) => `<div class="dynamic-cart-item"><div><strong>${escapeHtml(line.product.title)}</strong><p>${formatPrice(line.product.price)} each • ${categoryNames[line.product.category] || line.product.category}</p></div><div class="dynamic-cart-actions"><input type="number" min="1" value="${line.quantity}" data-product-id="${line.id}" class="cart-qty-input" /><button class="btn btn-secondary small-btn remove-cart-btn" type="button" data-product-id="${line.id}">Remove</button></div></div>`).join('') : `<div class="empty-dynamic-state enhanced-empty"><p>Your cart is empty right now.</p><span>Add a few premium picks and they will appear here instantly.</span><div class="button-group wrap-buttons"><a href="shop.html" class="btn btn-primary small-btn">Shop Now</a><a href="deals.html" class="btn btn-secondary small-btn">View Deals</a></div><div class="empty-state-links">${recommendations}</div></div>`;
    itemsCard.innerHTML = `<h3>Cart Items</h3>${itemMarkup}`;
    summaryCard.innerHTML = `<h3>Order Summary</h3><div class="cart-item"><span>Subtotal</span><span>${formatPrice(metrics.subtotal)}</span></div><div class="cart-item"><span>Shipping</span><span>${metrics.shipping ? formatPrice(metrics.shipping) : 'Free'}</span></div><div class="cart-item"><span>Tax</span><span>${formatPrice(metrics.tax)}</span></div><div class="cart-item total-row"><span>Total</span><span>${formatPrice(metrics.total)}</span></div><input type="text" class="coupon-input" placeholder="Coupon Code" /><a href="checkout.html" class="btn btn-primary full-btn">Proceed to Checkout</a>`;
    cartGrid.addEventListener('input', (event) => {
      const qty = event.target.closest('.cart-qty-input');
      if (!qty) return;
      catalog.updateCartQuantity(qty.dataset.productId, Number(qty.value));
      updateHeaderCounts();
  document.addEventListener('nova-brand-updated', updateHeaderCounts);
      renderCartPage();
      renderCheckoutPage();
    }, { once: true });
    cartGrid.addEventListener('click', (event) => {
      const remove = event.target.closest('.remove-cart-btn');
      if (!remove) return;
      catalog.removeFromCart(remove.dataset.productId); updateHeaderCounts(); renderCartPage(); renderCheckoutPage(); showToast('Removed from cart.');
    }, { once: true });
  }

  function renderWishlistPage() {
    const grid = document.querySelector('.wishlist-grid'); if (!grid) return;
    const items = catalog.getWishlistDetailed();
    grid.innerHTML = items.length ? items.map((item) => productCard(item, true)).join('') : `<div class="empty-dynamic-state enhanced-empty"><p>No saved items yet.</p><span>Use the Save button on any product card to keep it here for later.</span><div class="button-group wrap-buttons"><a href="shop.html" class="btn btn-primary small-btn">Browse Products</a><a href="collections.html" class="btn btn-secondary small-btn">Explore Collections</a></div></div>`;
  }

  function renderCheckoutPage() {
    const layout = document.querySelector('.checkout-layout'); if (!layout) return;
    const summaryCard = layout.querySelector('.checkout-summary-card');
    const form = layout.querySelector('.checkout-form');
    const metrics = cartMetrics();
    const profile = readJson(PROFILE_KEY, {});
    if (form && !form.dataset.prefilled) {
      const inputs = Array.from(form.querySelectorAll('input, select'));
      if (inputs[0]) inputs[0].value = profile.name || '';
      if (inputs[1]) inputs[1].value = profile.email || '';
      if (inputs[2]) inputs[2].value = profile.phone || '';
      if (inputs[3]) inputs[3].value = profile.address || '';
      if (inputs[5]) inputs[5].value = profile.city || '';
      if (inputs[6]) inputs[6].value = profile.state || '';
      if (inputs[7]) inputs[7].value = profile.zip || '';
      if (inputs[8]) inputs[8].value = profile.country || '';
      form.dataset.prefilled = 'true';
    }
    if (summaryCard) {
      summaryCard.innerHTML = `<p class="section-kicker">Order Summary</p><h3>Review Before Purchase</h3><p>Review your order before purchase, then place the order to save it in the account area and tracking page.</p><div class="checkout-summary-list">${metrics.lines.length ? metrics.lines.map((line) => `<div class="cart-item"><span>${escapeHtml(line.product.title)} × ${line.quantity}</span><span>${formatPrice(line.product.price * line.quantity)}</span></div>`).join('') : '<div class="cart-item"><span>No items in cart</span><span>$0.00</span></div>'}<div class="cart-item"><span>Subtotal</span><span>${formatPrice(metrics.subtotal)}</span></div><div class="cart-item"><span>Shipping</span><span>${metrics.shipping ? formatPrice(metrics.shipping) : 'Free'}</span></div><div class="cart-item"><span>Tax</span><span>${formatPrice(metrics.tax)}</span></div><div class="cart-item total-row"><span>Total</span><span>${formatPrice(metrics.total)}</span></div></div><div class="notice-card mt-24"><p><strong>Security:</strong> This is still a front-end checkout demo, but it saves billing details and completed demo orders locally.</p></div><button ${metrics.lines.length ? '' : 'disabled'} class="btn btn-primary full-btn" id="placeOrderButton" type="button">${metrics.lines.length ? 'Place Order' : 'Cart Empty'}</button><p class="seller-status" id="checkoutStatus"></p>`;
    }
    document.getElementById('placeOrderButton')?.addEventListener('click', () => {
      const inputs = form ? Array.from(form.querySelectorAll('input, select')) : [];
      const customer = { name: inputs[0]?.value.trim() || 'Guest Customer', email: inputs[1]?.value.trim() || 'guest@example.com', phone: inputs[2]?.value.trim() || '', address: inputs[3]?.value.trim() || '', unit: inputs[4]?.value.trim() || '', city: inputs[5]?.value.trim() || '', state: inputs[6]?.value.trim() || '', zip: inputs[7]?.value.trim() || '', country: inputs[8]?.value || '' };
      writeJson(PROFILE_KEY, customer);
      const order = catalog.placeOrder(customer);
      const status = document.getElementById('checkoutStatus');
      if (!order) { if (status) status.textContent = 'Add products to the cart first.'; return; }
      if (status) status.innerHTML = `Order ${order.id} saved. Track it on the <a href="tracking.html?order=${order.id}">tracking page</a>.`;
      updateHeaderCounts(); renderCheckoutPage(); renderAccountPage(); showToast(`Order ${order.id} placed.`);
    });
  }

  function renderAccountPage() {
    const layout = document.querySelector('.account-layout'); if (!layout) return;
    const orders = catalog.getOrders(); const wishCount = catalog.getWishlist().length; const cartCount = catalog.getCart().reduce((sum, item) => sum + item.quantity, 0); const stats = document.querySelectorAll('.account-stat-grid .stat-card strong');
    if (stats.length >= 4) { stats[0].textContent = orders.length; stats[1].textContent = orders.filter((item) => ["Processing","Shipped","Confirmed"].includes(item.status)).length; stats[2].textContent = wishCount; stats[3].textContent = readJson(ADDRESS_KEY, []).length; }
    const table = document.querySelector('.listing-table');
    if (table) table.innerHTML = `<div class="listing-row listing-head"><span>Order</span><span>Date</span><span>Status</span><span>Total</span></div>${orders.length ? orders.map((order) => `<div class="listing-row"><span>#${order.id}</span><span>${new Date(order.createdAt).toLocaleDateString()}</span><span>${order.status}</span><span>${formatPrice(order.total)}</span></div>`).join('') : `<div class="listing-row"><span>No orders yet</span><span>—</span><span>Waiting</span><span>${cartCount ? 'Cart ready' : 'Start shopping'}</span></div><div class="empty-dynamic-state enhanced-empty"><p>Your order history will appear here after checkout.</p><div class="button-group wrap-buttons"><a href="shop.html" class="btn btn-primary small-btn">Start Shopping</a><a href="tracking.html" class="btn btn-secondary small-btn">Open Tracking</a></div></div>`}`;
    const profile = readJson(PROFILE_KEY, { name: 'Guest Shopper', email: '', phone: '' });
    const addresses = readJson(ADDRESS_KEY, []);
    const welcomeTitle = document.querySelector('.account-welcome-card h2');
    if (welcomeTitle) welcomeTitle.textContent = `Hello, ${profile.name || 'Guest Shopper'}`;
    const addressGrid = document.querySelector('.address-grid');
    if (addressGrid) {
      addressGrid.innerHTML = addresses.length ? addresses.map((item, index) => `<div class="notice-card address-item"><h3>${escapeHtml(item.label)}</h3><p>${escapeHtml(item.line)}</p><p>${escapeHtml(item.city)}</p><button class="btn btn-secondary small-btn address-delete-btn" data-index="${index}" type="button">Delete</button></div>`).join('') : `<div class="notice-card"><h3>No saved addresses yet</h3><p>Add one below to make the account area feel fully set up.</p></div>`;
    }
    if (!document.getElementById('accountProfilePanel')) {
      const section = document.createElement('section');
      section.className = 'section';
      section.innerHTML = `<div class="container account-profile-grid"><div class="account-panel" id="accountProfilePanel"><p class="section-kicker">Profile</p><h3>Account Details</h3><form id="accountProfileForm" class="upload-form"><input type="text" id="accountName" placeholder="Full Name" value="${escapeHtml(profile.name || '')}"><input type="email" id="accountEmail" placeholder="Email Address" value="${escapeHtml(profile.email || '')}"><input type="text" id="accountPhone" placeholder="Phone Number" value="${escapeHtml(profile.phone || '')}"><button type="submit" class="btn btn-primary">Save Profile</button><div class="account-save-status" id="accountSaveStatus"></div></form></div><div class="account-panel"><p class="section-kicker">Address Book</p><h3>Add New Address</h3><form id="accountAddressForm" class="upload-form"><input type="text" id="addressLabel" placeholder="Address Label (Home, Office)"><input type="text" id="addressLine" placeholder="Street Address"><input type="text" id="addressCity" placeholder="City, State ZIP"><button type="submit" class="btn btn-primary">Add Address</button></form></div></div>`;
      const newsletter = document.querySelector('.newsletter-section');
      newsletter?.parentNode.insertBefore(section, newsletter);
    }
    document.getElementById('accountProfileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const next = { ...profile, name: document.getElementById('accountName').value.trim(), email: document.getElementById('accountEmail').value.trim(), phone: document.getElementById('accountPhone').value.trim() };
      writeJson(PROFILE_KEY, next);
      const status = document.getElementById('accountSaveStatus'); if (status) status.textContent = 'Profile saved.'; renderAccountPage(); showToast('Account profile saved.');
    });
    document.getElementById('accountAddressForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const label = document.getElementById('addressLabel').value.trim(); const line = document.getElementById('addressLine').value.trim(); const city = document.getElementById('addressCity').value.trim();
      if (!label || !line || !city) return showToast('Fill out the address form first.');
      const next = [...readJson(ADDRESS_KEY, []), { label, line, city }]; writeJson(ADDRESS_KEY, next); renderAccountPage(); showToast('Address saved.');
    });
    document.querySelectorAll('.address-delete-btn').forEach((btn) => btn.addEventListener('click', () => {
      const next = readJson(ADDRESS_KEY, []).filter((_, i) => i !== Number(btn.dataset.index)); writeJson(ADDRESS_KEY, next); renderAccountPage();
    }));
  }

  function renderContactPage() {
    const form = document.querySelector('.contact-card .upload-form'); if (!form) return;
    if (!document.getElementById('contactStatus')) { const status = document.createElement('div'); status.id = 'contactStatus'; status.className = 'form-status'; form.appendChild(status); }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const [name, email, subject, message] = Array.from(form.querySelectorAll('input, textarea'));
      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) return showToast('Fill out the contact form first.');
      const messages = readJson(CONTACT_KEY, []);
      messages.unshift({ name: name.value.trim(), email: email.value.trim(), subject: subject.value.trim(), message: message.value.trim(), createdAt: new Date().toISOString() });
      writeJson(CONTACT_KEY, messages); form.reset(); document.getElementById('contactStatus').textContent = 'Message sent. Your request has been saved in this demo storefront.'; showToast('Message sent.');
    });
  }

  function renderTrackingPage() {
    const form = document.querySelector('.track-form'); if (!form) return;
    const stepsWrap = document.querySelector('.tracking-steps'); const noteBox = document.querySelector('.tracking-card .trust-note-box');
    if (!document.getElementById('trackingStatus')) { const status = document.createElement('div'); status.id = 'trackingStatus'; status.className = 'track-status'; form.appendChild(status); }
    const statusOrder = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
    function paint(order) {
      if (!stepsWrap || !noteBox) return;
      const currentIndex = Math.max(0, statusOrder.indexOf(order.status || 'Confirmed'));
      stepsWrap.innerHTML = statusOrder.map((label, index) => `<div class="tracking-step ${index < currentIndex ? 'done' : index === currentIndex ? 'current' : ''}">${label}</div>`).join('');
      noteBox.innerHTML = `<p><strong>Order Number:</strong> ${order.id}</p><p><strong>Status:</strong> ${order.status}</p><p><strong>Customer:</strong> ${escapeHtml(order.customer?.name || 'Guest')}</p><p><strong>Email:</strong> ${escapeHtml(order.customer?.email || '')}</p>`;
    }
    const requested = new URLSearchParams(window.location.search).get('order');
    if (requested) {
      const found = catalog.getOrders().find((o) => o.id === requested); if (found) paint(found);
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const [orderInput, emailInput] = form.querySelectorAll('input');
      const orderNo = orderInput.value.trim(); const email = emailInput.value.trim().toLowerCase();
      const found = catalog.getOrders().find((o) => (!orderNo || o.id.toLowerCase() === orderNo.toLowerCase()) && (!email || (o.customer?.email || '').toLowerCase() === email));
      const status = document.getElementById('trackingStatus');
      if (!found) { if (status) status.innerHTML = 'No matching order was found. Double-check the order number and email, then try again.<div class="button-group wrap-buttons mt-24"><a href="account.html" class="btn btn-secondary small-btn">Open Account</a><a href="contact.html" class="btn btn-primary small-btn">Contact Support</a></div>'; return; }
      paint(found); if (status) status.textContent = `Tracking loaded for ${found.id}.`;
    });
  }

  function renderFaqPage() {
    const wrap = document.querySelector('.faq-wrap');
    const sections = document.querySelectorAll('.faq-wrap');
    const officialFaqs = [
      ['What payment methods do you accept?', 'Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay are common options for this template. Change this answer to match the payment methods your store actually offers.'],
      ['When will I receive my order confirmation?', 'Customers usually receive an order confirmation email within a few minutes after checkout. If they do not, they should check spam or contact support through the contact page.'],
      ['Do you ship internationally?', 'Yes, this template is written to support domestic and international shipping copy. Update the countries, timelines, and customs note to fit the real store.'],
      ['What if an item arrives damaged?', 'Customers can contact support with their order number and photos of the damage. The store can then offer a replacement, store credit, or a refund according to policy.'],
      ['How do restocks work?', 'Restocks can be announced through the newsletter, blog, or product page. Limited inventory language helps the site feel more realistic and complete.'],
      ['Can I edit this template after purchase?', 'Yes. Every headline, image, button label, and product section can be edited in the HTML, CSS, and image files. The layout is intentionally simple so buyers can swap content quickly.']
    ];
    if (sections.length) {
      const last = sections[sections.length - 1];
      if (last && !document.getElementById('officialFaqAppendix')) {
        const extra = document.createElement('div');
        extra.id = 'officialFaqAppendix';
        extra.className = 'faq-official-grid';
        extra.innerHTML = officialFaqs.map(([q, a]) => `<div class="faq-item"><button class="faq-question">${escapeHtml(q)}</button><div class="faq-answer"><p>${escapeHtml(a)}</p></div></div>`).join('');
        last.appendChild(extra);
      }
    }
    document.querySelectorAll('.faq-question').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const group = item?.parentElement;
        group?.querySelectorAll('.faq-item').forEach((other) => { if (other !== item) other.classList.remove('active'); });
        item?.classList.toggle('active');
      });
      btn.dataset.bound = 'true';
    });
    document.querySelector('.faq-item')?.classList.add('active');
  }

  function renderBlogPage() {
    const cards = document.querySelectorAll('.blog-card'); if (!cards.length) return;
    const helper = document.querySelector('.blog-edit-helper');
    if (helper) {
      helper.innerHTML = `<p><strong>Easy editing tip:</strong> open <code>blog.html</code>, swap each headline, paragraph, and image source, and the page is updated. No extra code setup is required.</p>`;
    }
    cards.forEach((card) => {
      const title = card.querySelector('h4')?.textContent?.trim();
      const cta = card.querySelector('.btn');
      const data = BLOG_POSTS[title];
      if (!card.querySelector('.blog-extra')) {
        const extra = document.createElement('div');
        extra.className = 'blog-extra';
        extra.innerHTML = data ? `<p>${escapeHtml(data.body)}</p><ul class="blog-checklist">${data.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="blog-action-row"><a href="shop.html" class="btn small-btn">Shop the Collection</a><a href="contact.html" class="btn btn-secondary small-btn">Ask a Question</a></div>` : `<p>Extra article copy goes here to make the page feel more premium and interactive for a buyer.</p>`;
        card.querySelector('.blog-content')?.appendChild(extra);
      }
      const summary = card.querySelector('.blog-summary');
      if (summary && data) summary.textContent = data.summary;
      cta?.addEventListener('click', (e) => { e.preventDefault(); cards.forEach((other) => { if (other !== card) other.classList.remove('expanded'); }); card.classList.toggle('expanded'); });
    });
  }

  function wireNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = form.querySelector('input');
        const email = input?.value?.trim();
        if (!email) return showToast('Enter an email address first.');
        const items = readJson(NEWSLETTER_KEY, []);
        if (!items.includes(email)) items.unshift(email);
        writeJson(NEWSLETTER_KEY, items);
        form.reset();
        showToast('Subscribed.');
      });
    });
  }

  function setupQuickViewModal() {
    let modal = document.getElementById('quickViewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quickViewModal';
      modal.className = 'quick-view-modal';
      modal.hidden = true;
      modal.innerHTML = `<div class="quick-view-backdrop" data-close="true"></div><div class="quick-view-dialog" role="dialog" aria-modal="true" aria-label="Quick view"><button class="quick-view-close" type="button" aria-label="Close">×</button><div class="quick-view-media"><img id="quickViewImage" src="" alt=""></div><div class="quick-view-copy"><p class="section-kicker" id="quickViewCategory">Featured</p><h3 id="quickViewTitle">Product title</h3><p class="rating-line" id="quickViewRating">★★★★★ <span>4.9 • 120 reviews</span></p><p class="product-price-big" id="quickViewPrice">$0.00</p><p class="theme-helper" id="quickViewDescription"></p><div class="button-group wrap-buttons"><button class="btn btn-primary add-cart-btn" type="button" id="quickViewAdd">Add to Cart</button><a class="btn btn-secondary" id="quickViewLink" href="product.html">Open Product Page</a></div></div></div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', (event) => { if (event.target.dataset.close === 'true' || event.target.classList.contains('quick-view-close')) modal.hidden = true; });
      document.addEventListener('keydown', (event) => { if (event.key === 'Escape') modal.hidden = true; });
    }
    return modal;
  }

  function openQuickView(productId) {
    const product = catalog.findProduct(productId);
    if (!product) return;
    const modal = setupQuickViewModal();
    const image = document.getElementById('quickViewImage');
    const category = document.getElementById('quickViewCategory');
    const title = document.getElementById('quickViewTitle');
    const rating = document.getElementById('quickViewRating');
    const price = document.getElementById('quickViewPrice');
    const description = document.getElementById('quickViewDescription');
    const add = document.getElementById('quickViewAdd');
    const link = document.getElementById('quickViewLink');
    if (image) { image.src = product.image; image.alt = product.title; }
    if (category) category.textContent = categoryNames[product.category] || product.category;
    if (title) title.textContent = product.title;
    if (rating) rating.innerHTML = `★★★★★ <span>${Number(product.rating || 4.8).toFixed(1)} • ${Number(product.reviews || 120)} reviews</span>`;
    if (price) price.textContent = formatPrice(product.price);
    if (description) description.textContent = product.description;
    if (add) add.dataset.productId = product.id;
    if (link) link.href = `product.html?id=${product.id}`;
    modal.hidden = false;
  }

  function wireStoreActions() {
    document.addEventListener('click', (event) => {
      const addCart = event.target.closest('.add-cart-btn');
      if (addCart) {
        const productId = addCart.dataset.productId || addCart.closest('.product-card')?.dataset.productId; if (!productId) return;
        catalog.addToCart(productId, 1); updateHeaderCounts(); showToast('Added to cart.'); renderCartPage(); renderCheckoutPage(); return;
      }
      const quickView = event.target.closest('.quick-view-btn');
      if (quickView) {
        const productId = quickView.dataset.productId || quickView.closest('.product-card')?.dataset.productId;
        if (!productId) return;
        openQuickView(productId);
        return;
      }
      const addWishlist = event.target.closest('.add-wishlist-btn');
      if (addWishlist) {
        const productId = addWishlist.dataset.productId || addWishlist.closest('.product-card')?.dataset.productId; if (!productId) return;
        const result = catalog.toggleWishlist(productId); updateHeaderCounts(); addWishlist.textContent = result.saved ? 'Saved' : 'Save'; renderWishlistPage(); renderAccountPage(); showToast(result.saved ? 'Saved to wishlist.' : 'Removed from wishlist.'); return;
      }
      const plainCard = event.target.closest('.product-card');
      const interactive = event.target.closest('a, button, input, select, textarea, label');
      if (plainCard && !interactive) {
        const directId = plainCard.dataset.productId;
        const detailLink = plainCard.querySelector('a[href^="product.html?id="]');
        if (directId) { window.location.href = `product.html?id=${directId}`; return; }
        if (detailLink) { window.location.href = detailLink.getAttribute('href'); }
      }
    });
  }

  setupHeaderSearch();
  updateHeaderCounts();
  document.addEventListener('nova-brand-updated', updateHeaderCounts);
  renderHomeFeatured();
  renderShop();
  renderCollections();
  renderDeals();
  renderFeaturedCarousel();
  renderProductPage();
  renderSearchPage();
  renderSellerDashboard();
  renderCartPage();
  renderWishlistPage();
  renderCheckoutPage();
  renderAccountPage();
  renderContactPage();
  renderTrackingPage();
  renderFaqPage();
  renderBlogPage();
  wireNewsletterForms();
  setupQuickViewModal();
  wireStoreActions();
});
