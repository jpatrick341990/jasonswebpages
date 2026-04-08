(function(){
  const DEFAULT_CONTENT = JSON.parse(JSON.stringify(window.VELORA_CONTENT || {}));
  const STORAGE_KEY = "veloraSalonDemoPreviewV6";
  let previewContent = loadPreviewContent();
  let workingContent = clone(previewContent);

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function loadPreviewContent(){
    try{
      const saved = localStorage.getItem(STORAGE_KEY);
      if(saved){
        const parsed = JSON.parse(saved);
        return deepMerge(clone(DEFAULT_CONTENT), parsed);
      }
    }catch(error){}
    return clone(DEFAULT_CONTENT);
  }

  function deepMerge(target, source){
    for(const key in source){
      const value = source[key];
      if(value && typeof value === "object" && !Array.isArray(value)){
        target[key] = deepMerge(target[key] || {}, value);
      }else{
        target[key] = value;
      }
    }
    return target;
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value || "";
  }

  function setHTML(id, value){
    const el = document.getElementById(id);
    if(el) el.innerHTML = value || "";
  }

  function setImage(id, value, alt){
    const el = document.getElementById(id);
    if(el){
      el.src = value || "";
      if(alt) el.alt = alt;
    }
  }

  function setLink(id, href, label){
    const el = document.getElementById(id);
    if(el){
      el.href = href || "#";
      if(typeof label === "string"){
        el.textContent = label;
      }
    }
  }

  function renderSocialLinks(content){
    const branding = content.branding || {};
    const socialItems = [
      { key: "instagram", label: "Instagram", short: "IG" },
      { key: "facebook", label: "Facebook", short: "FB" },
      { key: "pinterest", label: "Pinterest", short: "PT" },
      { key: "tiktok", label: "TikTok", short: "TT" },
      { key: "youtube", label: "YouTube", short: "YT" }
    ];

    document.querySelectorAll("[data-social-location]").forEach(container => {
      const markup = socialItems
        .filter(item => (branding[item.key] || "").trim())
        .map(item => `<a class="social-pill" href="${escapeHtml(branding[item.key])}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${item.short}</a>`)
        .join("");
      container.innerHTML = markup;
      container.classList.toggle("is-empty", !markup);
    });
  }

  function applyTheme(content){
    const r = document.documentElement;
    const t = content.theme || {};
    r.style.setProperty("--accent", t.accent || "#c47f8e");
    r.style.setProperty("--accent-dark", t.accentDark || "#8f5966");
    r.style.setProperty("--accent-soft", t.accentSoft || "#f6e8ec");
    r.style.setProperty("--bg", t.bg || "#fffaf8");
    r.style.setProperty("--bg-soft", t.bgSoft || "#fff2f4");
    r.style.setProperty("--text", t.text || "#261d21");
    r.style.setProperty("--muted", t.muted || "#6f6067");
    r.style.setProperty("--card", t.card || "#ffffff");
    r.style.setProperty("--border", t.border || "#ecd8de");
  }

  function pageName(){
    const name = location.pathname.split("/").pop() || "index.html";
    if(name === "index.html") return "index";
    if(name === "about.html") return "about";
    if(name === "services.html") return "services";
    if(name === "gallery.html") return "gallery";
    if(name === "contact.html") return "contact";
    if(name === "owner.html") return "owner";
    return "index";
  }

  function applyCommon(content){
    const b = content.branding || {};
    setText("announcementBar", b.announcementText);
    setText("siteName", b.siteName);
    setText("siteTagline", b.siteTagline);
    setText("footerBrand", b.siteName);
    setText("footerBlurb", b.footerBlurb);

    setImage("siteLogo", b.logo, `${b.siteName || "Site"} logo`);
    setLink("bookingButton", b.bookingLink, b.bookingButtonText);
    setLink("mobileBookingButton", b.bookingLink, b.bookingButtonText);

    const phoneHref = `tel:${(b.phone || "").replace(/[^\d+]/g, "")}`;
    const emailHref = `mailto:${b.email || ""}`;
    setLink("footerPhone", phoneHref, b.phone || "");
    setLink("footerEmail", emailHref, b.email || "");
    setText("footerAddress", b.address);
    setText("footerHours", b.hours);
    setText("copyrightText", `© ${new Date().getFullYear()} ${b.siteName || "Velora Salon"}. All rights reserved.`);

    setLink("contactPhone", phoneHref, b.phone || "");
    setLink("contactEmail", emailHref, b.email || "");
    setText("contactAddress", b.address);
    setText("contactHours", b.hours);

    document.body.classList.toggle("demo-mode", !!content.demoMode);
    renderSocialLinks(content);

    document.querySelectorAll(`[data-nav="${pageName()}"]`).forEach(link => link.classList.add("active"));

    setupMobileMenu();
  }

  function renderServices(content, targetId){
    const target = document.getElementById(targetId);
    if(!target) return;
    target.innerHTML = (content.services || []).map(item => `
      <article class="service-card reveal">
        <div class="service-image">
          <img src="${item.image}" alt="${escapeHtml(item.title)}">
        </div>
        <div class="service-content">
          <div class="service-tag">${escapeHtml(item.tag || "")}</div>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p class="muted">${escapeHtml(item.text || "")}</p>
          <div class="price-hint">${escapeHtml(item.priceHint || "")}</div>
        </div>
      </article>
    `).join("");
  }

  function renderValues(content, targetId){
    const target = document.getElementById(targetId);
    if(!target) return;
    target.innerHTML = (content.values || []).map(item => `
      <article class="value-card reveal">
        <h3>${escapeHtml(item.title || "")}</h3>
        <p class="muted">${escapeHtml(item.text || "")}</p>
      </article>
    `).join("");
  }

  function galleryClass(size, index){
    if(size === "wide") return index === 0 ? "mosaic-card wide" : "mosaic-card wide-short";
    if(size === "tall") return "mosaic-card tall";
    return "mosaic-card square";
  }

  function renderGallery(content, targetId, limit){
    const target = document.getElementById(targetId);
    if(!target) return;
    const items = (content.gallery || []).slice(0, limit || content.gallery.length);
    target.innerHTML = items.map((item, index) => `
      <article class="${galleryClass(item.size, index)} gallery-card reveal">
        <img src="${item.image}" alt="${escapeHtml(item.title || "Gallery image")}" data-lightbox="${item.image}">
        <div class="mosaic-meta">
          <strong>${escapeHtml(item.title || "")}</strong>
        </div>
      </article>
    `).join("");
  }

  function renderProcess(content){
    const target = document.getElementById("processGrid");
    if(!target) return;
    target.innerHTML = (content.process || []).map(item => `
      <article class="process-card reveal">
        <h3>${escapeHtml(item.title || "")}</h3>
        <p class="muted">${escapeHtml(item.text || "")}</p>
      </article>
    `).join("");
  }

  function applyHomepage(content){
    const h = content.home || {};
    setText("heroBadge", h.heroBadge);
    setText("heroTitle", h.heroTitle);
    setText("heroText", h.heroText);
    setLink("heroPrimary", h.heroPrimaryLink, h.heroPrimaryText);
    setLink("heroSecondary", h.heroSecondaryLink, h.heroSecondaryText);
    setImage("heroMainImage", h.heroMainImage, "Salon interior");
    setImage("heroSideImage", h.heroSideImage, "Salon service");
    setText("introEyebrow", h.introEyebrow);
    setText("introTitle", h.introTitle);
    setText("introText", h.introText);
    setImage("introImage", h.introImage, "Salon treatment");
    setText("atmosphereTitle", h.atmosphereTitle);
    setText("atmosphereText", h.atmosphereText);
    setImage("atmosphereImage", h.atmosphereImage, "Beauty products on shelf");
    setText("galleryTitleHome", h.galleryTitle);
    setText("galleryTextHome", h.galleryText);
    setText("ctaTitle", h.ctaTitle);
    setText("ctaText", h.ctaText);
    setLink("ctaButton", h.ctaButtonLink, h.ctaButtonText);

    renderServices(content, "servicesGrid");
    renderGallery(content, "galleryPreview", 3);
    renderValues(content, "valuesGrid");
  }

  function applyAbout(content){
    const a = content.about || {};
    setText("aboutPageTitle", a.pageTitle);
    setText("aboutPageIntro", a.pageIntro);
    setText("aboutStoryTitle", a.storyTitle);
    setText("aboutStoryText1", a.storyText1);
    setText("aboutStoryText2", a.storyText2);
    setImage("aboutStoryImage", a.storyImage, "About salon");
    setText("promiseTitle", a.promiseTitle);
    setText("promiseText", a.promiseText);
    renderValues(content, "aboutValuesGrid");
    const promiseList = document.getElementById("promiseList");
    if(promiseList){
      promiseList.innerHTML = (a.promiseList || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
    }
  }

  function applyServicesPage(content){
    const s = content.servicesPage || {};
    setText("servicesPageTitle", s.title);
    setText("servicesPageIntro", s.intro);
    setText("servicesNoteTitle", s.noteTitle);
    setText("servicesNoteText", s.noteText);
    setText("processTitle", s.processTitle);
    setText("processIntro", s.processIntro);
    renderServices(content, "servicesPageGrid");
    renderProcess(content);
  }

  function applyGalleryPage(content){
    const g = content.galleryPage || {};
    setText("galleryPageTitle", g.title);
    setText("galleryPageIntro", g.intro);
    renderGallery(content, "galleryPageGrid");
  }

  function applyContactPage(content){
    const c = content.contactPage || {};
    setText("contactPageTitle", c.title);
    setText("contactPageIntro", c.intro);
    setText("contactCardTitle", c.cardTitle);
    setText("contactCardText", c.cardText);
    const form = document.getElementById("booking-form");
    if(form){
      form.addEventListener("submit", event => {
        event.preventDefault();
        const note = document.getElementById("formNote");
        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const email = (data.get("email") || "").toString().trim();
        const phone = (data.get("phone") || "").toString().trim();
        const service = (data.get("service") || "").toString().trim();
        const message = (data.get("message") || "").toString().trim();

        if(!name || !email){
          if(note) note.textContent = "Please enter at least a name and email before sending.";
          return;
        }

        const mode = (content.form && content.form.mode) || "mailto";
        const siteEmail = (content.branding && content.branding.email) || "";
        if(mode === "endpoint" && content.form && content.form.endpoint){
          form.action = content.form.endpoint;
          form.method = "POST";

          let redirect = form.querySelector('input[name="_next"]');
          if(!redirect){
            redirect = document.createElement("input");
            redirect.type = "hidden";
            redirect.name = "_next";
            form.appendChild(redirect);
          }
          redirect.value = (content.form.successRedirect || location.href);

          let subject = form.querySelector('input[name="_subject"]');
          if(!subject){
            subject = document.createElement("input");
            subject.type = "hidden";
            subject.name = "_subject";
            form.appendChild(subject);
          }
          subject.value = `${content.form.subjectPrefix || "New booking request from"} ${name}`;

          form.submit();
          return;
        }

        const bodyLines = [
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : "",
          service ? `Service: ${service}` : "",
          "",
          "Message:",
          message || "(No message provided)"
        ].filter(Boolean);

        const subjectLine = `${(content.form && content.form.subjectPrefix) || "New booking request from"} ${name}`;
        const href = `mailto:${encodeURIComponent(siteEmail)}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
        window.location.href = href;
        if(note){
          note.textContent = "Opening your email app now so you can send the appointment request.";
        }
      });
    }
  }

  function setupMobileMenu(){
    const toggle = document.getElementById("mobileToggle");
    if(!toggle) return;
    const menu = document.getElementById("mobileMenu");
    toggle.addEventListener("click", () => {
      const willOpen = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", willOpen);
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if(menu) menu.hidden = !willOpen;
    });
    document.querySelectorAll("#mobileMenu a").forEach(link => {
      link.addEventListener("click", () => {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupLightbox(){
    const box = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImage");
    const close = document.getElementById("lightboxClose");
    if(!box || !img || !close) return;

    document.addEventListener("click", event => {
      const target = event.target;
      if(target && target.matches("[data-lightbox]")){
        img.src = target.getAttribute("data-lightbox");
        img.alt = target.alt || "Gallery image";
        box.classList.add("open");
        box.setAttribute("aria-hidden", "false");
      }
    });

    function closeBox(){
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      img.src = "";
    }

    close.addEventListener("click", closeBox);
    box.addEventListener("click", event => {
      if(event.target === box) closeBox();
    });
    document.addEventListener("keydown", event => {
      if(event.key === "Escape") closeBox();
    });
  }

  function setupReveal(){
    const items = document.querySelectorAll(".reveal");
    if(!items.length) return;
    if(!("IntersectionObserver" in window)){
      items.forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  function escapeHtml(value){
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getValueByPath(obj, path){
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }

  function setValueByPath(obj, path, value){
    const keys = path.split(".");
    let ref = obj;
    while(keys.length > 1){
      const key = keys.shift();
      if(!ref[key] || typeof ref[key] !== "object") ref[key] = {};
      ref = ref[key];
    }
    ref[keys[0]] = value;
  }

    const OWNER_IMAGE_FIELDS = [
    { label: "Site logo", path: "branding.logo", alt: "Site logo" },
    { label: "Hero main image", path: "home.heroMainImage", alt: "Salon hero image" },
    { label: "Hero side image", path: "home.heroSideImage", alt: "Salon hero supporting image" },
    { label: "Intro section image", path: "home.introImage", alt: "Intro section image" },
    { label: "Atmosphere section image", path: "home.atmosphereImage", alt: "Atmosphere section image" },
    { label: "About page image", path: "about.storyImage", alt: "About page image" }
  ];

  function triggerDownload(filename, contents, mimeType){
    const blob = new Blob([contents], { type: mimeType || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Image could not be read."));
      reader.readAsDataURL(file);
    });
  }

  function setupOwnerPanel(){
    const ownerPasscode = document.getElementById("ownerPasscode");
    if(!ownerPasscode) return;

    const loginCard = document.getElementById("ownerLoginCard");
    const ownerPanel = document.getElementById("ownerPanel");
    const loginButton = document.getElementById("ownerLoginBtn");
    const loginMessage = document.getElementById("ownerLoginMessage");
    const actionMessage = document.getElementById("ownerActionMessage");
    const exportBox = document.getElementById("ownerExportBox");
    const tabs = Array.from(document.querySelectorAll(".owner-tab"));
    const panels = Array.from(document.querySelectorAll(".owner-tab-panel"));
    let unlocked = false;

    function setOwnerMessage(message, type){
      const target = type === "login" ? loginMessage : actionMessage;
      if(target) target.textContent = message || "";
    }

    function openTab(name){
      tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === name));
      panels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === name));
    }

    function saveWorkingContent(message){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workingContent));
      previewContent = loadPreviewContent();
      if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
      if(message) setOwnerMessage(message, "action");
    }

    function currentPasscode(){
      return (previewContent.owner && previewContent.owner.passcode) || (DEFAULT_CONTENT.owner && DEFAULT_CONTENT.owner.passcode) || "preview";
    }

    function populateOwnerFields(){
      document.querySelectorAll("[data-owner-field]").forEach(input => {
        const value = getValueByPath(workingContent, input.dataset.ownerField);
        input.value = typeof value === "undefined" ? "" : value;
      });
      document.querySelectorAll("[data-owner-color]").forEach(input => {
        const value = (workingContent.theme || {})[input.dataset.ownerColor];
        input.value = value || "#ffffff";
      });
      renderOwnerImages();
      renderServicesOwnerList();
      renderGalleryOwnerList();
      if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
    }

    function bindSimpleFields(){
      document.querySelectorAll("[data-owner-field]").forEach(input => {
        input.addEventListener("input", () => {
          setValueByPath(workingContent, input.dataset.ownerField, input.value);
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });
      document.querySelectorAll("[data-owner-color]").forEach(input => {
        input.addEventListener("input", () => {
          if(!workingContent.theme) workingContent.theme = {};
          workingContent.theme[input.dataset.ownerColor] = input.value;
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });
    }

    function renderOwnerImages(){
      const target = document.getElementById("ownerImageList");
      if(!target) return;
      target.innerHTML = OWNER_IMAGE_FIELDS.map((item, index) => {
        const value = getValueByPath(workingContent, item.path) || "";
        return `
          <article class="owner-image-card">
            <div class="owner-image-card-header">
              <strong>${escapeHtml(item.label)}</strong>
              <span class="muted">${escapeHtml(item.path)}</span>
            </div>
            <div class="owner-form-grid">
              <label class="full">Image path or data URL
                <input type="text" data-owner-image-text="${escapeHtml(item.path)}" value="${escapeHtml(value)}">
              </label>
              <label class="full">Upload replacement image
                <input type="file" accept="image/*" data-owner-image-upload="${escapeHtml(item.path)}">
              </label>
            </div>
            <div class="portfolio-owner-preview">
              <img class="owner-image-preview" src="${escapeHtml(value)}" alt="${escapeHtml(item.alt)}" id="owner-image-preview-${index}">
            </div>
          </article>
        `;
      }).join("");

      target.querySelectorAll("[data-owner-image-text]").forEach(input => {
        input.addEventListener("input", () => {
          setValueByPath(workingContent, input.dataset.ownerImageText, input.value);
          const card = input.closest(".owner-image-card");
          const preview = card && card.querySelector(".owner-image-preview");
          if(preview) preview.src = input.value || "";
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });

      target.querySelectorAll("[data-owner-image-upload]").forEach(input => {
        input.addEventListener("change", async () => {
          const file = input.files && input.files[0];
          if(!file) return;
          try{
            const dataUrl = await fileToDataUrl(file);
            setValueByPath(workingContent, input.dataset.ownerImageUpload, dataUrl);
            const card = input.closest(".owner-image-card");
            if(card){
              const textInput = card.querySelector("[data-owner-image-text]");
              const preview = card.querySelector(".owner-image-preview");
              if(textInput) textInput.value = dataUrl;
              if(preview) preview.src = dataUrl;
            }
            if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
            setOwnerMessage("Image uploaded into the current preview settings.", "action");
          }catch(error){
            setOwnerMessage("That image could not be loaded.", "action");
          }
        });
      });
    }

    function serviceTemplate(){
      const fallback = (DEFAULT_CONTENT.services && DEFAULT_CONTENT.services[0]) || {};
      return {
        title: fallback.title || "New service",
        tag: fallback.tag || "Service tag",
        text: fallback.text || "Describe the service here.",
        priceHint: fallback.priceHint || "From $0",
        image: fallback.image || "assets/images/hair-service.jpg"
      };
    }

    function galleryTemplate(){
      const fallback = (DEFAULT_CONTENT.gallery && DEFAULT_CONTENT.gallery[0]) || {};
      return {
        title: fallback.title || "New gallery image",
        image: fallback.image || "assets/images/gallery-1.jpg",
        size: fallback.size || "square"
      };
    }

    function moveItem(arrayName, index, direction){
      const list = workingContent[arrayName];
      const nextIndex = index + direction;
      if(!Array.isArray(list) || nextIndex < 0 || nextIndex >= list.length) return;
      const temp = list[index];
      list[index] = list[nextIndex];
      list[nextIndex] = temp;
    }

    function renderServicesOwnerList(){
      const target = document.getElementById("servicesOwnerList");
      if(!target) return;
      target.innerHTML = (workingContent.services || []).map((item, index) => `
        <article class="portfolio-owner-card">
          <div class="portfolio-owner-card-header">
            <strong>Service card ${index + 1}</strong>
            <div class="owner-mini-actions">
              <button class="btn btn-ghost" type="button" data-service-move="up" data-index="${index}">Move up</button>
              <button class="btn btn-ghost" type="button" data-service-move="down" data-index="${index}">Move down</button>
              <button class="btn btn-secondary" type="button" data-service-remove="${index}">Remove</button>
            </div>
          </div>
          <div class="owner-form-grid">
            <label>Title<input type="text" data-service-field="title" data-index="${index}" value="${escapeHtml(item.title || "")}"></label>
            <label>Tag<input type="text" data-service-field="tag" data-index="${index}" value="${escapeHtml(item.tag || "")}"></label>
            <label>Price hint<input type="text" data-service-field="priceHint" data-index="${index}" value="${escapeHtml(item.priceHint || "")}"></label>
            <label class="full">Description<textarea data-service-field="text" data-index="${index}">${escapeHtml(item.text || "")}</textarea></label>
            <label class="full">Image path or data URL<input type="text" data-service-field="image" data-index="${index}" value="${escapeHtml(item.image || "")}"></label>
            <label class="full">Upload replacement image<input type="file" accept="image/*" data-service-image-upload="${index}"></label>
          </div>
          <div class="portfolio-owner-preview">
            <img src="${escapeHtml(item.image || "")}" alt="${escapeHtml(item.title || "Service image")}" data-service-preview="${index}">
          </div>
        </article>
      `).join("");

      target.querySelectorAll("[data-service-field]").forEach(input => {
        input.addEventListener("input", () => {
          const index = Number(input.dataset.index);
          const key = input.dataset.serviceField;
          if(workingContent.services[index]){
            workingContent.services[index][key] = input.value;
            if(key === "image"){
              const preview = target.querySelector(`[data-service-preview="${index}"]`);
              if(preview) preview.src = input.value || "";
            }
            if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
          }
        });
      });

      target.querySelectorAll("[data-service-image-upload]").forEach(input => {
        input.addEventListener("change", async () => {
          const file = input.files && input.files[0];
          if(!file) return;
          const index = Number(input.dataset.serviceImageUpload);
          try{
            const dataUrl = await fileToDataUrl(file);
            if(workingContent.services[index]){
              workingContent.services[index].image = dataUrl;
              renderServicesOwnerList();
              if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
              setOwnerMessage("Service image updated in the preview settings.", "action");
            }
          }catch(error){
            setOwnerMessage("That service image could not be loaded.", "action");
          }
        });
      });

      target.querySelectorAll("[data-service-remove]").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.serviceRemove);
          workingContent.services.splice(index, 1);
          renderServicesOwnerList();
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });

      target.querySelectorAll("[data-service-move]").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index);
          moveItem("services", index, button.dataset.serviceMove === "up" ? -1 : 1);
          renderServicesOwnerList();
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });
    }

    function renderGalleryOwnerList(){
      const target = document.getElementById("galleryOwnerList");
      if(!target) return;
      target.innerHTML = (workingContent.gallery || []).map((item, index) => `
        <article class="portfolio-owner-card">
          <div class="portfolio-owner-card-header">
            <strong>Gallery image ${index + 1}</strong>
            <div class="owner-mini-actions">
              <button class="btn btn-ghost" type="button" data-gallery-move="up" data-index="${index}">Move up</button>
              <button class="btn btn-ghost" type="button" data-gallery-move="down" data-index="${index}">Move down</button>
              <button class="btn btn-secondary" type="button" data-gallery-remove="${index}">Remove</button>
            </div>
          </div>
          <div class="owner-form-grid">
            <label>Title<input type="text" data-gallery-field="title" data-index="${index}" value="${escapeHtml(item.title || "")}"></label>
            <label>Card size
              <select data-gallery-field="size" data-index="${index}">
                <option value="wide" ${item.size === "wide" ? "selected" : ""}>wide</option>
                <option value="tall" ${item.size === "tall" ? "selected" : ""}>tall</option>
                <option value="square" ${item.size === "square" ? "selected" : ""}>square</option>
              </select>
            </label>
            <label class="full">Image path or data URL<input type="text" data-gallery-field="image" data-index="${index}" value="${escapeHtml(item.image || "")}"></label>
            <label class="full">Upload replacement image<input type="file" accept="image/*" data-gallery-image-upload="${index}"></label>
          </div>
          <div class="portfolio-owner-preview">
            <img src="${escapeHtml(item.image || "")}" alt="${escapeHtml(item.title || "Gallery image")}" data-gallery-preview="${index}">
          </div>
        </article>
      `).join("");

      target.querySelectorAll("[data-gallery-field]").forEach(input => {
        input.addEventListener("input", () => {
          const index = Number(input.dataset.index);
          const key = input.dataset.galleryField;
          if(workingContent.gallery[index]){
            workingContent.gallery[index][key] = input.value;
            if(key === "image"){
              const preview = target.querySelector(`[data-gallery-preview="${index}"]`);
              if(preview) preview.src = input.value || "";
            }
            if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
          }
        });
      });

      target.querySelectorAll("[data-gallery-image-upload]").forEach(input => {
        input.addEventListener("change", async () => {
          const file = input.files && input.files[0];
          if(!file) return;
          const index = Number(input.dataset.galleryImageUpload);
          try{
            const dataUrl = await fileToDataUrl(file);
            if(workingContent.gallery[index]){
              workingContent.gallery[index].image = dataUrl;
              renderGalleryOwnerList();
              if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
              setOwnerMessage("Gallery image updated in the preview settings.", "action");
            }
          }catch(error){
            setOwnerMessage("That gallery image could not be loaded.", "action");
          }
        });
      });

      target.querySelectorAll("[data-gallery-remove]").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.galleryRemove);
          workingContent.gallery.splice(index, 1);
          renderGalleryOwnerList();
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });

      target.querySelectorAll("[data-gallery-move]").forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index);
          moveItem("gallery", index, button.dataset.galleryMove === "up" ? -1 : 1);
          renderGalleryOwnerList();
          if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        });
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        if(!unlocked) return;
        openTab(tab.dataset.tab);
      });
    });

    document.querySelectorAll("[data-monkey-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.monkeyToggle);
        if(!target) return;
        const showing = target.type === "password";
        target.type = showing ? "text" : "password";
        button.textContent = showing ? "🐵" : "🙈";
      });
    });

    function unlockPanel(){
      if(workingContent.demoMode){
        unlocked = true;
        if(loginCard) loginCard.classList.add("hidden");
        if(ownerPanel) ownerPanel.classList.remove("hidden");
        populateOwnerFields();
        openTab("general");
        setOwnerMessage("Demo owner panel opened.", "login");
        return;
      }
      if(ownerPasscode.value !== currentPasscode()){
        setOwnerMessage("Password did not match. Try preview unless you already changed it.", "login");
        return;
      }
      unlocked = true;
      if(loginCard) loginCard.classList.add("hidden");
      if(ownerPanel) ownerPanel.classList.remove("hidden");
      populateOwnerFields();
      openTab("general");
      setOwnerMessage("Owner panel unlocked.", "login");
    }

    loginButton.addEventListener("click", unlockPanel);
    ownerPasscode.addEventListener("keydown", event => {
      if(event.key === "Enter") unlockPanel();
    });

    bindSimpleFields();

    const addServiceItem = document.getElementById("addServiceItem");
    if(addServiceItem){
      addServiceItem.addEventListener("click", () => {
        if(!Array.isArray(workingContent.services)) workingContent.services = [];
        workingContent.services.push(serviceTemplate());
        renderServicesOwnerList();
        if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
      });
    }

    const resetServiceItems = document.getElementById("resetServiceItems");
    if(resetServiceItems){
      resetServiceItems.addEventListener("click", () => {
        workingContent.services = clone(DEFAULT_CONTENT.services || []);
        renderServicesOwnerList();
        if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        setOwnerMessage("Service cards reset to default.", "action");
      });
    }

    const addGalleryItem = document.getElementById("addGalleryItem");
    if(addGalleryItem){
      addGalleryItem.addEventListener("click", () => {
        if(!Array.isArray(workingContent.gallery)) workingContent.gallery = [];
        workingContent.gallery.push(galleryTemplate());
        renderGalleryOwnerList();
        if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
      });
    }

    const resetGalleryItems = document.getElementById("resetGalleryItems");
    if(resetGalleryItems){
      resetGalleryItems.addEventListener("click", () => {
        workingContent.gallery = clone(DEFAULT_CONTENT.gallery || []);
        renderGalleryOwnerList();
        if(exportBox) exportBox.value = JSON.stringify(workingContent, null, 2);
        setOwnerMessage("Gallery images reset to default.", "action");
      });
    }

    const saveOwnerChanges = document.getElementById("saveOwnerChanges");
    if(saveOwnerChanges){
      saveOwnerChanges.addEventListener("click", () => {
        saveWorkingContent("Preview changes saved in this browser.");
      });
    }

    const exportSettings = document.getElementById("exportSettings");
    if(exportSettings){
      exportSettings.addEventListener("click", () => {
        const json = JSON.stringify(workingContent, null, 2);
        if(exportBox) exportBox.value = json;
        triggerDownload("velora-salon-settings.json", json, "application/json");
        setOwnerMessage("Settings file downloaded.", "action");
      });
    }

    const applyPastedJson = document.getElementById("applyPastedJson");
    if(applyPastedJson){
      applyPastedJson.addEventListener("click", () => {
        if(!exportBox || !exportBox.value.trim()){
          setOwnerMessage("Paste JSON into the box first.", "action");
          return;
        }
        try{
          const parsed = JSON.parse(exportBox.value);
          workingContent = deepMerge(clone(DEFAULT_CONTENT), parsed);
          populateOwnerFields();
          saveWorkingContent("Pasted JSON loaded into the preview settings.");
        }catch(error){
          setOwnerMessage("That JSON could not be parsed. Check the formatting and try again.", "action");
        }
      });
    }

    const importSettings = document.getElementById("importSettings");
    if(importSettings){
      importSettings.addEventListener("change", async () => {
        const file = importSettings.files && importSettings.files[0];
        if(!file) return;
        try{
          const text = await file.text();
          const parsed = JSON.parse(text);
          workingContent = deepMerge(clone(DEFAULT_CONTENT), parsed);
          populateOwnerFields();
          saveWorkingContent("Settings file loaded and saved into the preview.");
        }catch(error){
          setOwnerMessage("That settings file could not be imported.", "action");
        }
        importSettings.value = "";
      });
    }

    const resetSettings = document.getElementById("resetSettings");
    if(resetSettings){
      resetSettings.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        previewContent = clone(DEFAULT_CONTENT);
        workingContent = clone(DEFAULT_CONTENT);
        populateOwnerFields();
        setOwnerMessage("Settings reset to the default site content.", "action");
      });
    }

    const savePasscode = document.getElementById("savePasscode");
    if(savePasscode){
      savePasscode.addEventListener("click", () => {
        const input = document.getElementById("newPasscode");
        const value = (input && input.value || "").trim();
        if(value.length < 3){
          setOwnerMessage("Use a password with at least 3 characters.", "action");
          return;
        }
        if(!workingContent.owner || typeof workingContent.owner !== "object") workingContent.owner = {};
        workingContent.owner.passcode = value;
        saveWorkingContent("Owner password saved into the preview settings.");
        if(input) input.value = "";
      });
    }
  }

  function init(){
    applyTheme(previewContent);
    applyCommon(previewContent);
    applyHomepage(previewContent);
    applyAbout(previewContent);
    applyServicesPage(previewContent);
    applyGalleryPage(previewContent);
    applyContactPage(previewContent);
    setupLightbox();
    setupOwnerPanel();
    setupReveal();
  }

  document.addEventListener("DOMContentLoaded", init);
})();