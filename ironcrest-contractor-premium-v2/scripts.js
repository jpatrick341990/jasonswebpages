
const STORAGE_KEY = "ironcrest-contracting-settings-v2";

function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getSettings() {
  const defaults = cloneData(window.CONTRACTOR_TEMPLATE_DEFAULTS || {});
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return deepMerge(defaults, parsed);
  } catch (error) {
    console.warn("Using default settings.", error);
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function deepMerge(base, patch) {
  const output = Array.isArray(base) ? [...base] : { ...base };
  if (!patch || typeof patch !== "object") return output;
  Object.keys(patch).forEach((key) => {
    if (Array.isArray(patch[key])) {
      output[key] = patch[key];
    } else if (patch[key] && typeof patch[key] === "object") {
      output[key] = deepMerge(base[key] || {}, patch[key]);
    } else {
      output[key] = patch[key];
    }
  });
  return output;
}

function setCssVars(settings) {
  const root = document.documentElement;
  const colors = settings.colors;
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-dark", colors.accentDark);
  root.style.setProperty("--bg", colors.bg);
  root.style.setProperty("--surface", colors.surface);
  root.style.setProperty("--text", colors.text);
  root.style.setProperty("--muted", colors.muted);
}

function socialLabelMap() {
  return {
    instagram: "IG",
    facebook: "FB",
    pinterest: "PI",
    tiktok: "TT",
    youtube: "YT"
  };
}

function renderHeader(settings) {
  const header = document.getElementById("site-header");
  if (!header) return;
  const page = document.body.dataset.page || "home";
  const nav = [
    ["Home", "index.html", "home"],
    ["Services", "services.html", "services"],
    ["About", "about.html", "about"],
    ["Contact", "contact.html", "contact"]
  ].map(([label, href, slug]) => `<a href="${href}" class="${page === slug ? "active" : ""}">${label}</a>`).join("");
  const social = Object.entries(settings.social || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `<a href="${value}" class="social-chip" target="_blank" rel="noopener noreferrer">${socialLabelMap()[key] || key.slice(0,2).toUpperCase()}</a>`)
    .join("");

  header.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand-lockup" aria-label="${settings.businessName}">
          <img src="images/brand-mark.png" alt="${settings.businessName} logo" class="brand-mark">
          <span>
            <strong>${settings.businessName}</strong>
            <small>${settings.tagline}</small>
          </span>
        </a>
        <nav class="site-nav">${nav}</nav>
        <div class="header-right">
          <div class="social-row">${social}</div>
          <a href="tel:${settings.phoneLink}" class="btn btn-primary header-call">${settings.phoneDisplay}</a>
        </div>
      </div>
    </header>
  `;
}

function renderFooter(settings) {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const social = Object.entries(settings.social || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `<a href="${value}" target="_blank" rel="noopener noreferrer">${socialLabelMap()[key] || key.slice(0,2).toUpperCase()}</a>`)
    .join("");
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <div class="footer-brand">
            <img src="images/brand-mark.png" alt="${settings.businessName} logo" class="brand-mark small-mark">
            <div>
              <strong>${settings.businessName}</strong>
              <p>${settings.serviceArea}</p>
            </div>
          </div>
        </div>
        <div class="footer-links">
          <a href="services.html">Services</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="owner.html">Owner</a>
        </div>
        <div class="footer-contact">
          <a href="tel:${settings.phoneLink}">${settings.phoneDisplay}</a>
          <a href="mailto:${settings.email}">${settings.email}</a>
          <span>${settings.location}</span>
          <div class="footer-socials">${social}</div>
        </div>
      </div>
    </footer>
  `;
}

function renderHome(settings) {
  setText("hero-eyebrow", settings.heroEyebrow);
  setText("hero-title", settings.heroTitle);
  setText("hero-text", settings.heroText);
  setText("home-feature-title", settings.homeFeatureTitle);
  setText("home-feature-text", settings.homeFeatureText);
  const hero = document.getElementById("hero");
  if (hero) hero.style.backgroundImage = `linear-gradient(rgba(8, 18, 11, 0.48), rgba(8, 18, 11, 0.60)), url('${settings.images.hero}')`;

  fillSimpleGrid("trust-grid", settings.trustItems.map((item) => `<div class="trust-item">${item}</div>`));
  fillSimpleGrid("home-services", settings.services.map(serviceCardHtml));
  fillSimpleGrid("home-projects", settings.projects.slice(0, 4).map(projectCardHtml));
  fillSimpleGrid("process-grid", settings.process.map((step, index) => `<article class="process-card"><span>${String(index + 1).padStart(2, "0")}</span><h3>${step.title}</h3><p>${step.text}</p></article>`));
  fillSimpleGrid("testimonials-grid", settings.testimonials.map(testimonialHtml));
  fillSelectOptions("quote-service-select", settings.services);
}

function renderServices(settings) {
  fillSimpleGrid("services-page-grid", settings.services.map(serviceCardHtml));
  fillSimpleGrid("service-upgrades-grid", settings.upgrades.map((item) => `<div class="mini-pill">${item}</div>`));
  fillSimpleGrid("faq-list", settings.faqs.map(faqHtml));
}

function renderAbout(settings) {
  setText("about-title", settings.aboutTitle);
  setText("about-text-1", settings.aboutText1);
  setText("about-text-2", settings.aboutText2);
  const aboutImage = document.getElementById("about-page-image");
  if (aboutImage) aboutImage.src = settings.images.about;
  fillSimpleGrid("values-grid", settings.values.map((item) => `<div class="mini-pill">${item}</div>`));
  fillSimpleGrid("about-projects", settings.projects.slice(0, 3).map(projectCardHtml));
}

function renderContact(settings) {
  fillSimpleGrid("contact-list", [
    `<div><strong>Phone</strong><a href="tel:${settings.phoneLink}">${settings.phoneDisplay}</a></div>`,
    `<div><strong>Email</strong><a href="mailto:${settings.email}">${settings.email}</a></div>`,
    `<div><strong>Location</strong><span>${settings.location}</span></div>`,
    `<div><strong>Service area</strong><span>${settings.serviceArea}</span></div>`
  ]);
  fillSelectOptions("contact-service-select", settings.services);
}

function serviceCardHtml(item, index) {
  return `<article class="service-card"><div class="service-top"><span class="service-chip">${item.icon || `Service ${index + 1}`}</span><h3>${item.title}</h3></div><p>${item.description}</p></article>`;
}
function projectCardHtml(item) {
  return `<article class="project-card"><img src="${item.image}" alt="${item.title}"><div class="project-overlay"><span>${item.category}</span><h3>${item.title}</h3><p>${item.description}</p></div></article>`;
}
function testimonialHtml(item) {
  return `<article class="testimonial-card"><p>“${item.quote}”</p><strong>${item.name}</strong><span>${item.role}</span></article>`;
}
function faqHtml(item) {
  return `<article class="faq-card"><h3>${item.q}</h3><p>${item.a}</p></article>`;
}

function fillSimpleGrid(id, parts) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = parts.join("");
}
function fillSelectOptions(id, services) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = `<option value="">Select a service</option>` + services.map(item => `<option>${item.title}</option>`).join("");
}
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function handleOwnerButton() {
  const button = document.getElementById("owner-fab");
  if (!button) return;
  button.addEventListener("click", () => {
    window.location.href = "owner.html";
  });
}

function showDemoFormMessage(form) {
  form.addEventListener("submit", (event) => {
    if (form.dataset.demoForm !== "true") return;
    event.preventDefault();
    alert("This form is in demo mode. Connect your preferred form service before publishing live.");
  });
}

function setupOwnerPage(settings) {
  if (document.body.dataset.page !== "owner") return;

  document.querySelectorAll(".owner-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".owner-tab").forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".owner-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`.owner-panel[data-panel='${tab.dataset.tab}']`)?.classList.add("active");
    });
  });

  bindSettingFields(settings);
  renderOwnerLists(settings);
  setupUploads(settings);
  setupOwnerActions(settings);
  document.querySelectorAll(".monkey-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const isPassword = target.type === "password";
      target.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "🐵" : "🙈";
    });
  });
}

function bindSettingFields(settings) {
  const map = {
    businessName: "setting-businessName",
    tagline: "setting-tagline",
    phoneDisplay: "setting-phoneDisplay",
    phoneLink: "setting-phoneLink",
    email: "setting-email",
    location: "setting-location",
    serviceArea: "setting-serviceArea",
    heroEyebrow: "setting-heroEyebrow",
    heroTitle: "setting-heroTitle",
    heroText: "setting-heroText",
    homeFeatureTitle: "setting-homeFeatureTitle",
    homeFeatureText: "setting-homeFeatureText",
    aboutTitle: "setting-aboutTitle",
    aboutText1: "setting-aboutText1",
    aboutText2: "setting-aboutText2"
  };
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.value = settings[key] || "";
  });
  document.getElementById("setting-social-instagram").value = settings.social.instagram || "";
  document.getElementById("setting-social-facebook").value = settings.social.facebook || "";
  document.getElementById("setting-social-pinterest").value = settings.social.pinterest || "";
  document.getElementById("setting-social-tiktok").value = settings.social.tiktok || "";
  document.getElementById("setting-social-youtube").value = settings.social.youtube || "";

  document.getElementById("setting-color-accent").value = settings.colors.accent;
  document.getElementById("setting-color-accentDark").value = settings.colors.accentDark;
  document.getElementById("setting-color-bg").value = settings.colors.bg;
  document.getElementById("setting-color-surface").value = settings.colors.surface;
  document.getElementById("setting-color-text").value = settings.colors.text;
  document.getElementById("setting-color-muted").value = settings.colors.muted;

  document.getElementById("setting-image-hero").value = settings.images.hero || "";
  document.getElementById("setting-image-about").value = settings.images.about || "";
  document.getElementById("setting-image-contact").value = settings.images.contact || "";
  document.getElementById("preview-image-hero").src = settings.images.hero;
  document.getElementById("preview-image-about").src = settings.images.about;
  document.getElementById("preview-image-contact").src = settings.images.contact;
  document.getElementById("owner-passcode").value = settings.passcode || "preview";
}

function setupUploads(settings) {
  ["hero", "about", "contact"].forEach((key) => {
    const input = document.getElementById(`upload-image-${key}`);
    if (!input) return;
    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        settings.images[key] = reader.result;
        document.getElementById(`setting-image-${key}`).value = reader.result;
        document.getElementById(`preview-image-${key}`).src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  });
}

function setupOwnerActions(settings) {
  document.getElementById("save-general").addEventListener("click", () => {
    settings.businessName = valueOf("setting-businessName");
    settings.tagline = valueOf("setting-tagline");
    settings.phoneDisplay = valueOf("setting-phoneDisplay");
    settings.phoneLink = valueOf("setting-phoneLink");
    settings.email = valueOf("setting-email");
    settings.location = valueOf("setting-location");
    settings.serviceArea = valueOf("setting-serviceArea");
    settings.social.instagram = valueOf("setting-social-instagram");
    settings.social.facebook = valueOf("setting-social-facebook");
    settings.social.pinterest = valueOf("setting-social-pinterest");
    settings.social.tiktok = valueOf("setting-social-tiktok");
    settings.social.youtube = valueOf("setting-social-youtube");
    persist(settings, "General settings saved.");
  });
  document.getElementById("save-copy").addEventListener("click", () => {
    ["heroEyebrow","heroTitle","heroText","homeFeatureTitle","homeFeatureText","aboutTitle","aboutText1","aboutText2"].forEach((key) => {
      const el = document.getElementById(`setting-${key.charAt(0).toLowerCase()+key.slice(1)}`) || document.getElementById(`setting-${key}`);
      if (el) settings[key] = el.value;
    });
    settings.heroEyebrow = valueOf("setting-heroEyebrow");
    settings.heroTitle = valueOf("setting-heroTitle");
    settings.heroText = valueOf("setting-heroText");
    settings.homeFeatureTitle = valueOf("setting-homeFeatureTitle");
    settings.homeFeatureText = valueOf("setting-homeFeatureText");
    settings.aboutTitle = valueOf("setting-aboutTitle");
    settings.aboutText1 = valueOf("setting-aboutText1");
    settings.aboutText2 = valueOf("setting-aboutText2");
    persist(settings, "Copy saved.");
  });
  document.getElementById("save-colors").addEventListener("click", () => {
    settings.colors.accent = valueOf("setting-color-accent");
    settings.colors.accentDark = valueOf("setting-color-accentDark");
    settings.colors.bg = valueOf("setting-color-bg");
    settings.colors.surface = valueOf("setting-color-surface");
    settings.colors.text = valueOf("setting-color-text");
    settings.colors.muted = valueOf("setting-color-muted");
    persist(settings, "Colors saved.");
  });
  document.getElementById("save-images").addEventListener("click", () => {
    settings.images.hero = valueOf("setting-image-hero");
    settings.images.about = valueOf("setting-image-about");
    settings.images.contact = valueOf("setting-image-contact");
    persist(settings, "Images saved.");
  });
  document.getElementById("save-content").addEventListener("click", () => {
    settings.services = collectListItems("service");
    settings.projects = collectListItems("project");
    settings.testimonials = collectListItems("testimonial");
    persist(settings, "Content saved.");
  });
  document.getElementById("save-passcode").addEventListener("click", () => {
    settings.passcode = valueOf("owner-passcode") || "preview";
    persist(settings, "Password saved.");
  });
  document.getElementById("download-settings").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summit-ridge-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById("upload-settings").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const uploaded = JSON.parse(reader.result);
        saveSettings(deepMerge(window.CONTRACTOR_TEMPLATE_DEFAULTS, uploaded));
        alert("Settings file loaded. Refresh the page to see the changes.");
      } catch (error) {
        alert("Could not read that settings file.");
      }
    };
    reader.readAsText(file);
  });
  document.getElementById("reset-settings").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    alert("Settings reset. Refresh the page to return to defaults.");
  });
  document.getElementById("add-service").addEventListener("click", () => addListItem("service"));
  document.getElementById("add-project").addEventListener("click", () => addListItem("project"));
  document.getElementById("add-testimonial").addEventListener("click", () => addListItem("testimonial"));
}

function persist(settings, message) {
  saveSettings(settings);
  alert(message + " Refresh the public pages to see the update.");
}
function valueOf(id) {
  return document.getElementById(id)?.value || "";
}

function renderOwnerLists(settings) {
  renderList("owner-services-list", "service", settings.services);
  renderList("owner-projects-list", "project", settings.projects);
  renderList("owner-testimonials-list", "testimonial", settings.testimonials);
}

function renderList(id, type, items) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  wrap.innerHTML = items.map((item, index) => ownerCardHtml(type, item, index)).join("");
  wrap.querySelectorAll(".remove-row").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".owner-item-card")?.remove();
    });
  });
}

function ownerCardHtml(type, item, index) {
  if (type === "service") {
    return `<article class="owner-item-card" data-type="service"><div class="owner-item-head"><strong>Service ${index + 1}</strong><button type="button" class="remove-row">Remove</button></div><label>Title<input data-field="title" value="${escapeHtml(item.title)}"></label><label>Description<textarea data-field="description">${escapeHtml(item.description)}</textarea></label><label>Small label<input data-field="icon" value="${escapeHtml(item.icon || "")}"></label></article>`;
  }
  if (type === "project") {
    return `<article class="owner-item-card" data-type="project"><div class="owner-item-head"><strong>Project ${index + 1}</strong><button type="button" class="remove-row">Remove</button></div><label>Title<input data-field="title" value="${escapeHtml(item.title)}"></label><label>Category<input data-field="category" value="${escapeHtml(item.category)}"></label><label>Description<textarea data-field="description">${escapeHtml(item.description)}</textarea></label><label>Image path<input data-field="image" value="${escapeHtml(item.image)}"></label></article>`;
  }
  return `<article class="owner-item-card" data-type="testimonial"><div class="owner-item-head"><strong>Testimonial ${index + 1}</strong><button type="button" class="remove-row">Remove</button></div><label>Name<input data-field="name" value="${escapeHtml(item.name)}"></label><label>Role<input data-field="role" value="${escapeHtml(item.role)}"></label><label>Quote<textarea data-field="quote">${escapeHtml(item.quote)}</textarea></label></article>`;
}

function addListItem(type) {
  const wrapId = type === "service" ? "owner-services-list" : type === "project" ? "owner-projects-list" : "owner-testimonials-list";
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const blank = type === "service"
    ? { title: "New service", description: "Describe the service.", icon: "New" }
    : type === "project"
    ? { title: "New project", category: "Category", description: "Describe the project.", image: "images/project-lawn.jpg" }
    : { name: "Client name", role: "Client", quote: "Add a testimonial here." };
  wrap.insertAdjacentHTML("beforeend", ownerCardHtml(type, blank, wrap.children.length));
  wrap.lastElementChild.querySelector(".remove-row").addEventListener("click", (e) => e.currentTarget.closest(".owner-item-card").remove());
}

function collectListItems(type) {
  const wrapId = type === "service" ? "owner-services-list" : type === "project" ? "owner-projects-list" : "owner-testimonials-list";
  return [...document.getElementById(wrapId).querySelectorAll(".owner-item-card")].map((card) => {
    const data = {};
    card.querySelectorAll("[data-field]").forEach((field) => {
      data[field.dataset.field] = field.value;
    });
    return data;
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', '&quot;')
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  const settings = getSettings();
  setCssVars(settings);
  renderHeader(settings);
  renderFooter(settings);
  renderHome(settings);
  renderServices(settings);
  renderAbout(settings);
  renderContact(settings);
  setupOwnerPage(settings);
  handleOwnerButton();
  document.querySelectorAll("form[data-demo-form='true']").forEach(showDemoFormMessage);
});
