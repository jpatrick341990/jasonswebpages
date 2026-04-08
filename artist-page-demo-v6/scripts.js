(function () {
  const config = window.ARTIST_TEMPLATE_CONFIG || {};
  const starterArtworks = Array.isArray(window.ARTIST_STARTER_ARTWORKS) ? window.ARTIST_STARTER_ARTWORKS : [];
  const page = document.body.dataset.page || "";
  const allowedUploadTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  const maxUploadSizeBytes = 8 * 1024 * 1024;
  const storageKey = config.previewStorageKey || "artist-template-demo-artworks-v6";
  const settingsKey = config.settingsStorageKey || "artist-template-demo-settings-v6";
  const demoEmail = String(config.demoLoginEmail || "owner@artistpreview.com").trim().toLowerCase();
  const maxImageDimension = Number(config.maxImageDimension || 1600);
  const previewImageQuality = Number(config.previewImageQuality || 0.82);

  const DEFAULT_SETTINGS = {
    passcode: "preview",
    siteName: "Artist Studio",
    siteTagline: "Pastel art, originals, and commissions",
    headerCta: "Book a Commission",
    footerCopy: "Artist Studio creates warm portfolio pages for originals, prints, and commission-based artwork.",
    homeHeroEyebrow: "Premium artist portfolio template",
    homeHeroHeadline: "Show the work beautifully. Make commissions feel easy. Keep the gallery live.",
    homeHeroText: "This artist template is built for real working creatives who need more than a pretty homepage. It gives you a polished portfolio, a warm brand story, commission-ready contact flow, and a live demo gallery that updates in the browser through the hidden owner page.",
    galleryHeroEyebrow: "Gallery",
    galleryHeroHeadline: "Collections, framed mockups, and portfolio pieces that can stay updated over time.",
    galleryHeroText: "This gallery page is designed to make the art easy to browse while still feeling warm and premium. Search, filter, and updated artwork all work together so the site feels more like a real shop or collection browser.",
    aboutHeroEyebrow: "About the artist",
    aboutHeroHeadline: "Tell the story behind the work without making the page feel heavy or overly formal.",
    aboutHeroText: "A strong artist website needs more than a grid of images. This page gives you room to explain inspiration, process, medium, and why the work matters, all without sounding stiff or overly complicated.",
    contactHeroEyebrow: "Contact",
    contactHeroHeadline: "Make it easy for someone to say, “I think I want to work with you.”",
    contactHeroText: "This page is designed for commission requests, print questions, collaboration leads, and simple collector contact. The form is styled and demo-ready now, and can be connected to a real form service later.",
    contactEmail: "hello@yourartiststudio.com",
    contactInstagram: "@yourartiststudio",
    contactTurnaround: "1–3 business days",
    instagramUrl: "",
    facebookUrl: "",
    pinterestUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    colors: {
      accent: "#bf7b63",
      accentHover: "#ab6b54",
      accentSoft: "#f4d8cd",
      bgMain: "#faf3ed",
      bgPanel: "#fffaf7",
      textMain: "#3d302b",
      textSoft: "#78645d"
    },
    images: {
      homeHero: "images/artist-hero.png",
      galleryHero: "images/gallery-beach-kids.png",
      aboutHero: "images/gallery-beach-boat.png",
      contactHero: "images/about-image.png",
      adminHero: "images/gallery-framed-sunset.png",
      storyImage: "images/about-image.png",
      logoImage: "images/logo.png"
    }
  };

  const publicState = { items: [], filter: "all", search: "" };
  let ownerSettings = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalizeArtwork(item) {
    return {
      id: item.id || `demo-${Math.random().toString(36).slice(2)}`,
      title: item.title || "Untitled Artwork",
      description: item.description || "",
      category: item.category || "Gallery",
      image_url: item.image_url || item.imageUrl || "",
      featured: Boolean(item.featured),
      sort_order: Number.isFinite(Number(item.sort_order)) ? Number(item.sort_order) : 100,
      created_at: item.created_at || new Date().toISOString()
    };
  }

  function compareArtworks(a, b) {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }

  function getUniqueCategories(items) {
    return [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function setCount(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function setStatusMessage(element, text, tone = "neutral") {
    if (!element) return;
    element.textContent = text;
    element.classList.remove("is-success", "is-error");
    if (tone === "success") element.classList.add("is-success");
    if (tone === "error") element.classList.add("is-error");
  }

  function setOwnerAction(text, tone = "neutral") {
    setStatusMessage(document.getElementById("owner-action-message"), text, tone);
  }

  function toggleDisabled(formId, isDisabled) {
    const form = document.getElementById(formId);
    if (!form) return;
    Array.from(form.elements).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      element.disabled = isDisabled;
    });
  }

  function validateUploadFile(file) {
    if (!file) return "Please choose an image file first.";
    if (!allowedUploadTypes.has(file.type)) return "Please upload a PNG, JPG, WEBP, or GIF image.";
    if (file.size > maxUploadSizeBytes) return "Please keep the image under 8 MB so the preview stays fast.";
    return "";
  }

  function loadStoredArtworks() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return starterArtworks.map(normalizeArtwork).sort(compareArtworks);
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return starterArtworks.map(normalizeArtwork).sort(compareArtworks);
      return parsed.map(normalizeArtwork).sort(compareArtworks);
    } catch (error) {
      console.error("Could not read preview artworks:", error);
      return starterArtworks.map(normalizeArtwork).sort(compareArtworks);
    }
  }

  function saveStoredArtworks(items) {
    localStorage.setItem(storageKey, JSON.stringify(items.map(normalizeArtwork)));
  }

  function resetStoredArtworks() {
    localStorage.removeItem(storageKey);
  }

  function getAuthSession() { return { email: demoEmail }; }

  function getSettings() {
    try {
      const raw = localStorage.getItem(settingsKey);
      if (!raw) return clone(DEFAULT_SETTINGS);
      const parsed = JSON.parse(raw);
      return {
        ...clone(DEFAULT_SETTINGS),
        ...parsed,
        colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
        images: { ...DEFAULT_SETTINGS.images, ...(parsed.images || {}) }
      };
    } catch (error) {
      console.error("Could not read preview settings:", error);
      return clone(DEFAULT_SETTINGS);
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }

  function applyTextSettings(settings) {
    document.querySelectorAll("[data-setting-text]").forEach((el) => {
      const key = el.dataset.settingText;
      if (settings[key] !== undefined) el.textContent = settings[key];
    });
  }

  function applyColorSettings(settings) {
    const root = document.documentElement;
    root.style.setProperty("--accent", settings.colors.accent);
    root.style.setProperty("--accent-hover", settings.colors.accentHover);
    root.style.setProperty("--accent-soft", settings.colors.accentSoft);
    root.style.setProperty("--bg-main", settings.colors.bgMain);
    root.style.setProperty("--bg-panel", settings.colors.bgPanel);
    root.style.setProperty("--text-main", settings.colors.textMain);
    root.style.setProperty("--text-soft", settings.colors.textSoft);
  }

  function applyImageSettings(settings) {
    const mapping = {
      ".home-hero": settings.images.homeHero,
      ".services-hero": settings.images.galleryHero,
      ".about-hero": settings.images.aboutHero,
      ".contact-hero": settings.images.contactHero,
      ".admin-hero": settings.images.adminHero
    };
    Object.entries(mapping).forEach(([selector, src]) => {
      const el = document.querySelector(selector);
      if (!el || !src) return;
      const existing = getComputedStyle(el).backgroundImage;
      const overlay = existing.includes("linear-gradient") ? existing.split(", url(")[0] : "linear-gradient(rgba(255,247,240,0.35), rgba(255,247,240,0.58))";
      el.style.backgroundImage = `${overlay}, url('${src}')`;
    });
    document.querySelectorAll("[data-setting-image]").forEach((el) => {
      const key = el.dataset.settingImage;
      const src = settings.images[key];
      if (src && el.tagName === "IMG") el.src = src;
    });
  }

  function renderSocialLinks(settings) {
    const items = [
      { key: "instagramUrl", short: "IG", label: "Instagram" },
      { key: "facebookUrl", short: "FB", label: "Facebook" },
      { key: "pinterestUrl", short: "PI", label: "Pinterest" },
      { key: "tiktokUrl", short: "TT", label: "TikTok" },
      { key: "youtubeUrl", short: "YT", label: "YouTube" }
    ];
    document.querySelectorAll("[data-social-location]").forEach((container) => {
      const markup = items.filter((item) => (settings[item.key] || "").trim()).map((item) =>
        `<a class="social-pill" href="${settings[item.key]}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${item.short}</a>`
      ).join("");
      container.innerHTML = markup;
      container.classList.toggle("is-empty", !markup.trim());
    });
  }

  function updateCollectionStats(items) {
    const featuredItems = items.filter((item) => item.featured);
    const uniqueCategories = getUniqueCategories(items);
    setCount("artwork-count", items.length);
    setCount("featured-count", featuredItems.length || Math.min(items.length, 3));
    setCount("collection-count", uniqueCategories.length);
    setCount("gallery-total-count", items.length);
    setCount("gallery-featured-count", featuredItems.length || Math.min(items.length, 3));
    setCount("gallery-category-count", uniqueCategories.length);
  }

  function renderFeaturedArtworks(items) {
    const target = document.getElementById("featured-art-grid");
    const note = document.getElementById("featured-art-note");
    if (!target) return;
    const featuredItems = items.filter((item) => item.featured).slice(0, 3);
    const output = (featuredItems.length ? featuredItems : items.slice(0, 3)).slice(0, 3);
    if (!output.length) {
      target.innerHTML = `<div class="gallery-empty"><h3>No featured artwork yet.</h3><p>Open the hidden owner link in the footer and upload your first demo piece.</p></div>`;
      if (note) note.textContent = "Demo preview mode is active. Add sample artwork from the owner page to show the upload flow.";
      return;
    }
    target.innerHTML = output.map((item, index) => {
      const largeClass = index === 0 ? " art-card-large" : "";
      return `<article class="art-card${largeClass}"><img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy"><div class="art-card-body"><p class="gallery-tag">${escapeHtml(item.category)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>`;
    }).join("");
    if (note) note.textContent = "Demo preview mode is active. Uploads save in this browser only so visitors can test the owner flow.";
  }

  function renderGalleryFilterButtons(items) {
    const target = document.getElementById("gallery-filter-buttons");
    if (!target) return;
    const categoryButtons = getUniqueCategories(items).map((category) => ({ key: category, label: category }));
    const buttons = [{ key: "all", label: "All" }, { key: "featured", label: "Featured" }, ...categoryButtons];
    target.innerHTML = buttons.map((button) => {
      const isActive = publicState.filter === button.key;
      return `<button type="button" class="filter-chip${isActive ? " is-active" : ""}" data-filter-value="${escapeHtml(button.key)}">${escapeHtml(button.label)}</button>`;
    }).join("");
  }

  function getVisibleGalleryItems() {
    const normalizedSearch = publicState.search.trim().toLowerCase();
    return publicState.items.filter((item) => {
      const matchesFilter = publicState.filter === "all" ? true : publicState.filter === "featured" ? item.featured : item.category === publicState.filter;
      const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase();
      const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true;
      return matchesFilter && matchesSearch;
    });
  }

  function renderGalleryArtworks(items) {
    const target = document.getElementById("gallery-grid");
    const note = document.getElementById("gallery-note");
    if (!target) return;
    const visibleItems = getVisibleGalleryItems();
    if (!items.length) {
      target.innerHTML = `<div class="gallery-empty"><h3>No artwork has been uploaded yet.</h3><p>Open the hidden owner link in the footer and upload your first demo piece.</p></div>`;
      if (note) note.textContent = "Demo preview mode is active. Add sample artwork from the owner page to show the gallery flow.";
      return;
    }
    if (!visibleItems.length) {
      target.innerHTML = `<div class="gallery-empty"><h3>No results match that search yet.</h3><p>Try another category or keyword, or add more artwork from the owner dashboard.</p></div>`;
      if (note) note.textContent = "No artwork matches the current gallery filter in this demo preview.";
      return;
    }
    target.innerHTML = visibleItems.map((item) => `<article class="gallery-item"><img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy"><div class="gallery-copy"><p class="gallery-tag">${escapeHtml(item.category)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>`).join("");
    if (note) note.textContent = visibleItems.length === items.length ? "Demo preview mode is active. Changes made in the owner panel save only in this browser for showcase purposes." : `Showing ${visibleItems.length} of ${items.length} pieces in demo preview mode. Changes save only in this browser.`;
  }

  function updateGalleryView() {
    renderGalleryFilterButtons(publicState.items);
    renderGalleryArtworks(publicState.items);
  }

  function markActiveNav() {
    const activeLink = document.querySelector(`[data-nav="${page}"]`);
    if (!activeLink) return;
    activeLink.classList.add("is-active");
    activeLink.setAttribute("aria-current", "page");
  }

  function initDemoForms() {
    document.querySelectorAll(".js-demo-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const statusId = form.id === "commission-form-home" ? "home-form-status" : "contact-form-status";
        setStatusMessage(document.getElementById(statusId), "Demo form only: connect this form to Formspree, Basin, or another form service before publishing live.", "success");
        form.reset();
      });
    });
  }

  function initGalleryFilters() {
    const filterButtons = document.getElementById("gallery-filter-buttons");
    const searchInput = document.getElementById("gallery-search");
    if (filterButtons) {
      filterButtons.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter-value]");
        if (!button) return;
        publicState.filter = button.dataset.filterValue || "all";
        updateGalleryView();
      });
    }
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        publicState.search = searchInput.value || "";
        updateGalleryView();
      });
    }
  }

  function initPublicPage() {
    const items = loadStoredArtworks();
    publicState.items = items;
    updateCollectionStats(items);
    renderFeaturedArtworks(items);
    updateGalleryView();
    initGalleryFilters();
  }

  function updatePreviewFromFile(file) {
    const preview = document.getElementById("upload-preview");
    if (!preview) return;
    if (!file) {
      preview.hidden = true;
      preview.removeAttribute("src");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function createStoredImageUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = await compressImageDataUrl(reader.result);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not prepare the selected image."));
      image.src = dataUrl;
    });
  }

  async function compressImageDataUrl(dataUrl) {
    const image = await loadImageFromDataUrl(dataUrl);
    const ratio = Math.min(1, maxImageDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * ratio));
    const height = Math.max(1, Math.round(image.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", previewImageQuality);
  }

  function buildAdminEditForm(item, isSignedIn) {
    return `
      <form class="artwork-edit-form" data-artwork-id="${escapeHtml(item.id)}" hidden>
        <div class="admin-form-row">
          <div class="field-group">
            <label>Title</label>
            <input type="text" name="title" value="${escapeHtml(item.title)}" ${!isSignedIn ? "disabled" : ""}>
          </div>
          <div class="field-group">
            <label>Category</label>
            <input type="text" name="category" value="${escapeHtml(item.category)}" ${!isSignedIn ? "disabled" : ""}>
          </div>
        </div>
        <div class="admin-form-row">
          <div class="field-group">
            <label>Description</label>
            <textarea name="description" ${!isSignedIn ? "disabled" : ""}>${escapeHtml(item.description)}</textarea>
          </div>
          <div class="field-group">
            <label>Sort order</label>
            <input type="number" name="sort_order" value="${escapeHtml(item.sort_order)}" ${!isSignedIn ? "disabled" : ""}>
          </div>
        </div>
        <label class="checkbox-row"><input type="checkbox" name="featured" ${item.featured ? "checked" : ""} ${!isSignedIn ? "disabled" : ""}> Show this in the homepage featured section</label>
        <div class="button-row">
          <button type="submit" class="btn btn-primary" ${!isSignedIn ? "disabled" : ""}>Save Changes</button>
          <button type="button" class="btn btn-secondary cancel-edit-btn" ${!isSignedIn ? "disabled" : ""}>Cancel</button>
        </div>
      </form>`;
  }

  function renderAdminArtworkList() {
    const target = document.getElementById("artwork-list");
    if (!target) return;
    const items = loadStoredArtworks();
    if (!items.length) {
      target.innerHTML = `<div class="gallery-empty"><h3>No demo artwork yet.</h3><p>Use the upload form above to add the first piece.</p></div>`;
      return;
    }
    target.innerHTML = items.map((item) => `
      <article class="artwork-row">
        <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" class="artwork-thumb">
        <div class="artwork-row-copy">
          <p class="gallery-tag">${escapeHtml(item.category)}${item.featured ? " • Featured" : ""}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p class="artwork-meta">Sort order: ${escapeHtml(item.sort_order)}</p>
          <div class="artwork-row-actions">
            <button type="button" class="btn btn-secondary toggle-edit-btn" data-role="toggle-edit" data-id="${escapeHtml(item.id)}">Edit Details</button>
            <button type="button" class="btn btn-secondary delete-artwork-btn" data-id="${escapeHtml(item.id)}">Delete</button>
          </div>
          ${buildAdminEditForm(item, true)}
        </div>
      </article>`).join("");
  }

  async function handleArtworkSubmit(event) {
    event.preventDefault();
    const statusText = document.getElementById("auth-status-text");
    const imageInput = document.getElementById("artwork-image");
    const file = imageInput.files && imageInput.files[0];
    const validationMessage = validateUploadFile(file);
    if (validationMessage) {
      setStatusMessage(statusText, validationMessage, "error");
      return;
    }
    const title = document.getElementById("artwork-title").value.trim();
    const description = document.getElementById("artwork-description").value.trim();
    const category = document.getElementById("artwork-category").value.trim() || "Gallery";
    const sortOrder = Number(document.getElementById("artwork-order").value || 100);
    const featured = document.getElementById("artwork-featured").checked;
    setStatusMessage(statusText, "Saving preview artwork...");
    try {
      const imageUrl = await createStoredImageUrl(file);
      const items = loadStoredArtworks();
      items.push(normalizeArtwork({
        id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title, description, category, image_url: imageUrl, featured, sort_order: sortOrder, created_at: new Date().toISOString()
      }));
      saveStoredArtworks(items.sort(compareArtworks));
      event.target.reset();
      updatePreviewFromFile(null);
      setStatusMessage(statusText, "Preview artwork uploaded successfully.", "success");
      renderAdminArtworkList();
      if (page !== "admin") initPublicPage();
      setOwnerAction("Added a new gallery piece. Click save all changes if you also changed settings on another tab.", "success");
    } catch (error) {
      const message = error && error.name === "QuotaExceededError" ? "The browser storage for this preview is full. Delete a few demo pieces or upload a smaller image." : (error && error.message ? error.message : "Could not save this preview image.");
      setStatusMessage(statusText, message, "error");
    }
  }

  function handleDeleteClick(button) {
    const artworkId = button.getAttribute("data-id");
    if (!artworkId) return;
    if (!window.confirm("Delete this artwork from the preview gallery?")) return;
    const items = loadStoredArtworks().filter((item) => item.id !== artworkId);
    saveStoredArtworks(items);
    setStatusMessage(document.getElementById("auth-status-text"), "Preview artwork deleted.", "success");
    renderAdminArtworkList();
    setOwnerAction("Gallery piece removed.", "success");
  }

  function handleEditSubmit(form) {
    const artworkId = form.getAttribute("data-artwork-id");
    if (!artworkId) return;
    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || "Gallery").trim() || "Gallery",
      description: String(formData.get("description") || "").trim(),
      sort_order: Number(formData.get("sort_order") || 100),
      featured: formData.get("featured") === "on"
    };
    const items = loadStoredArtworks().map((item) => item.id !== artworkId ? item : normalizeArtwork({ ...item, ...payload })).sort(compareArtworks);
    saveStoredArtworks(items);
    setStatusMessage(document.getElementById("auth-status-text"), "Preview artwork details updated.", "success");
    renderAdminArtworkList();
    setOwnerAction("Gallery details updated.", "success");
  }

  function toggleEditForm(button) {
    const row = button.closest(".artwork-row");
    if (!row) return;
    const form = row.querySelector(".artwork-edit-form");
    if (!form) return;
    const isHidden = form.hasAttribute("hidden");
    document.querySelectorAll(".artwork-edit-form").forEach((item) => item.setAttribute("hidden", ""));
    document.querySelectorAll('.toggle-edit-btn[data-role="toggle-edit"]').forEach((item) => { item.textContent = "Edit Details"; });
    if (isHidden) {
      form.removeAttribute("hidden");
      button.textContent = "Cancel";
    } else {
      form.setAttribute("hidden", "");
      button.textContent = "Edit Details";
    }
  }

  function handleResetDemo() {
    if (!window.confirm("Reset the preview gallery back to the starter artwork?")) return;
    resetStoredArtworks();
    setStatusMessage(document.getElementById("auth-status-text"), "Preview gallery reset to the starter artwork.", "success");
    renderAdminArtworkList();
    setOwnerAction("Gallery reset to the starter artwork.", "success");
  }

  function switchOwnerTab(name) {
    document.querySelectorAll(".owner-tab").forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === name));
    document.querySelectorAll(".owner-tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name));
  }

  function fillOwnerForm(settings) {
    document.querySelectorAll("[data-owner-field]").forEach((input) => {
      const key = input.dataset.ownerField;
      if (key in settings) input.value = settings[key] || "";
    });
    document.querySelectorAll("[data-owner-color]").forEach((input) => {
      const key = input.dataset.ownerColor;
      input.value = settings.colors[key] || "#000000";
    });
    document.querySelectorAll("[data-owner-image-path]").forEach((input) => {
      const key = input.dataset.ownerImagePath;
      input.value = settings.images[key] || "";
    });
  }

  function bindOwnerInputs(settings) {
    document.querySelectorAll("[data-owner-field]").forEach((input) => {
      input.addEventListener("input", () => {
        settings[input.dataset.ownerField] = input.value;
      });
    });
    document.querySelectorAll("[data-owner-color]").forEach((input) => {
      input.addEventListener("input", () => {
        settings.colors[input.dataset.ownerColor] = input.value;
        applyColorSettings(settings);
      });
    });
    document.querySelectorAll("[data-owner-image-path]").forEach((input) => {
      input.addEventListener("input", () => {
        settings.images[input.dataset.ownerImagePath] = input.value;
        applyImageSettings(settings);
      });
    });
    document.querySelectorAll("[data-owner-image-upload]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const validationMessage = validateUploadFile(file);
        if (validationMessage) {
          setOwnerAction(validationMessage, "error");
          return;
        }
        const key = input.dataset.ownerImageUpload;
        try {
          settings.images[key] = await createStoredImageUrl(file);
          const textInput = document.querySelector(`[data-owner-image-path="${key}"]`);
          if (textInput) textInput.value = settings.images[key];
          applyImageSettings(settings);
          setOwnerAction("Loaded a new image. Click save all changes when you are ready.", "success");
        } catch (error) {
          setOwnerAction(error.message || "Could not load that image.", "error");
        }
      });
    });
  }

  function saveAllOwnerChanges(settings) {
    const pass = document.getElementById("owner-passcode")?.value || settings.passcode;
    const confirm = document.getElementById("owner-passcode-confirm")?.value || pass;
    if (pass !== confirm) {
      setOwnerAction("The password and confirm password fields do not match.", "error");
      switchOwnerTab("security");
      return;
    }
    settings.passcode = pass || "preview";
    saveSettings(settings);
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    setStatusMessage(document.getElementById("auth-status-text"), "Demo owner mode is active. No password is required in this preview.", "success");
    setOwnerAction("Saved all owner settings for this browser preview.", "success");
  }

  function downloadSettings(settings) {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "artist-studio-demo-settings.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setOwnerAction("Downloaded the owner settings file.", "success");
  }

  function uploadSettingsFile(file, settings) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(reader.result);
        ownerSettings = {
          ...clone(DEFAULT_SETTINGS),
          ...incoming,
          colors: { ...DEFAULT_SETTINGS.colors, ...(incoming.colors || {}) },
          images: { ...DEFAULT_SETTINGS.images, ...(incoming.images || {}) }
        };
        settings = ownerSettings;
        saveSettings(settings);
        fillOwnerForm(settings);
        applyTextSettings(settings);
        applyColorSettings(settings);
        applyImageSettings(settings);
        renderSocialLinks(settings);
        document.getElementById("owner-passcode").value = settings.passcode || "preview";
        document.getElementById("owner-passcode-confirm").value = settings.passcode || "preview";
        setOwnerAction("Uploaded the owner settings file successfully.", "success");
      } catch (error) {
        setOwnerAction("That file could not be read as a valid settings file.", "error");
      }
    };
    reader.readAsText(file);
  }

  function initMonkeyToggles() {
    document.querySelectorAll("[data-monkey-toggle]").forEach((btn) => {
      if (btn.dataset.monkeyBound === "true") return;
      btn.dataset.monkeyBound = "true";
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.monkeyToggle);
        if (!target) return;
        const showing = target.type === "text";
        target.type = showing ? "password" : "text";
        btn.textContent = showing ? "🙈" : "🐵";
      });
    });
  }

  function initAdminPage() {
    ownerSettings = getSettings();
    fillOwnerForm(ownerSettings);
    bindOwnerInputs(ownerSettings);
    document.getElementById("owner-passcode").value = ownerSettings.passcode || "preview";
    document.getElementById("owner-passcode-confirm").value = ownerSettings.passcode || "preview";
    setText("auth-status-text", "Demo owner mode is active. No password is required in this preview.");
    document.querySelectorAll(".owner-tab").forEach((btn) => btn.addEventListener("click", () => switchOwnerTab(btn.dataset.tab)));
    document.getElementById("save-all-settings")?.addEventListener("click", () => saveAllOwnerChanges(ownerSettings));
    document.getElementById("download-settings")?.addEventListener("click", () => downloadSettings(ownerSettings));
    document.getElementById("upload-settings-file")?.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (file) uploadSettingsFile(file, ownerSettings);
      event.target.value = "";
    });

    const artworkForm = document.getElementById("artwork-form");
    const refreshBtn = document.getElementById("refresh-artworks-btn");
    const resetBtn = document.getElementById("reset-demo-btn");
    const artworkList = document.getElementById("artwork-list");
    const imageInput = document.getElementById("artwork-image");
    if (artworkForm) artworkForm.addEventListener("submit", handleArtworkSubmit);
    if (refreshBtn) refreshBtn.addEventListener("click", renderAdminArtworkList);
    if (resetBtn) resetBtn.addEventListener("click", handleResetDemo);
    if (imageInput) imageInput.addEventListener("change", () => updatePreviewFromFile(imageInput.files && imageInput.files[0] || null));

    if (artworkList) {
      artworkList.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".delete-artwork-btn");
        if (deleteButton) return void handleDeleteClick(deleteButton);
        const editButton = event.target.closest('.toggle-edit-btn[data-role="toggle-edit"]');
        if (editButton) return void toggleEditForm(editButton);
        const cancelButton = event.target.closest('.cancel-edit-btn');
        if (cancelButton) {
          const row = cancelButton.closest('.artwork-row');
          const form = row && row.querySelector('.artwork-edit-form');
          const toggleButton = row && row.querySelector('.toggle-edit-btn[data-role="toggle-edit"]');
          if (form) form.setAttribute('hidden', '');
          if (toggleButton) toggleButton.textContent = 'Edit Details';
        }
      });
      artworkList.addEventListener("submit", (event) => {
        const form = event.target.closest(".artwork-edit-form");
        if (!form) return;
        event.preventDefault();
        handleEditSubmit(form);
      });
    }

    renderAdminArtworkList();
    initMonkeyToggles();
  }

  function boot() {
    const settings = getSettings();
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    markActiveNav();
    initDemoForms();
    if (page === "admin") {
      initAdminPage();
    } else {
      initPublicPage();
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
