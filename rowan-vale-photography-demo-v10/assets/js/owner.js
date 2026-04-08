document.addEventListener('DOMContentLoaded', () => {
  const { DEFAULT_SETTINGS, getSettings, saveSettings, applyTextSettings, applyColorSettings, applyImageSettings, renderSocialLinks, STORAGE_KEY } = window.RowanVale;
  const loginCard = document.getElementById('ownerLoginCard');
  const panel = document.getElementById('ownerPanel');
  const passInput = document.getElementById('ownerPasscode');
  const loginBtn = document.getElementById('ownerLoginBtn');
  const loginMessage = document.getElementById('ownerLoginMessage');
  const actionMessage = document.getElementById('ownerActionMessage');
  const tabs = [...document.querySelectorAll('.owner-tab')];
  const panels = [...document.querySelectorAll('.owner-tab-panel')];
  let settings = getSettings();

  function switchTab(name) {
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
    panels.forEach((panelEl) => panelEl.classList.toggle('active', panelEl.dataset.panel === name));
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));


  function ensurePortfolioItems() {
    if (!Array.isArray(settings.portfolioItems) || !settings.portfolioItems.length) {
      settings.portfolioItems = structuredClone(DEFAULT_SETTINGS.portfolioItems || []);
    }
  }

  function bindPortfolioInputs() {
    document.querySelectorAll('[data-portfolio-field]').forEach((input) => {
      input.addEventListener('input', () => {
        const index = Number(input.dataset.index);
        const field = input.dataset.portfolioField;
        if (!settings.portfolioItems[index]) return;
        settings.portfolioItems[index][field] = input.value;
      });
    });
    document.querySelectorAll('[data-portfolio-upload]').forEach((input) => {
      input.addEventListener('change', () => {
        const index = Number(input.dataset.index);
        const file = input.files?.[0];
        if (!file || !settings.portfolioItems[index]) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          settings.portfolioItems[index].image = e.target.result;
          renderPortfolioManager();
          actionMessage.textContent = 'Loaded a new portfolio image. Click save all changes.';
        };
        reader.readAsDataURL(file);
      });
    });
    document.querySelectorAll('[data-remove-portfolio]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.removePortfolio);
        settings.portfolioItems.splice(index, 1);
        renderPortfolioManager();
        actionMessage.textContent = 'Portfolio photo removed. Click save all changes.';
      });
    });
  }

  function renderPortfolioManager() {
    const list = document.getElementById('portfolioOwnerList');
    if (!list) return;
    ensurePortfolioItems();
    list.innerHTML = settings.portfolioItems.map((item, index) => `
      <article class="portfolio-owner-card">
        <div class="portfolio-owner-card-header">
          <strong>Portfolio photo ${index + 1}</strong>
          <button class="btn btn-secondary" type="button" data-remove-portfolio="${index}">Remove</button>
        </div>
        <div class="owner-form-grid">
          <label>Title<input type="text" data-portfolio-field="title" data-index="${index}" value="${item.title || ''}"></label>
          <label>Category
            <select data-portfolio-field="category" data-index="${index}">
              <option value="wedding" ${item.category === 'wedding' ? 'selected' : ''}>Wedding</option>
              <option value="portrait" ${item.category === 'portrait' ? 'selected' : ''}>Portrait</option>
              <option value="branding" ${item.category === 'branding' ? 'selected' : ''}>Branding</option>
            </select>
          </label>
          <label>Card size
            <select data-portfolio-field="size" data-index="${index}">
              <option value="standard" ${item.size === 'standard' ? 'selected' : ''}>Standard</option>
              <option value="wide" ${item.size === 'wide' ? 'selected' : ''}>Wide</option>
              <option value="tall" ${item.size === 'tall' ? 'selected' : ''}>Tall</option>
            </select>
          </label>
          <label>Image path or saved image
            <input type="text" data-portfolio-field="image" data-index="${index}" value="${item.image || ''}">
          </label>
          <label>Upload replacement photo<input type="file" accept="image/*" data-portfolio-upload data-index="${index}"></label>
        </div>
        <div class="portfolio-owner-preview">
          <img src="${item.image || ''}" alt="${item.title || 'Portfolio photo preview'}">
          <p class="portfolio-owner-note">Use image paths from assets/images or upload a replacement photo here.</p>
        </div>
      </article>
    `).join('');
    bindPortfolioInputs();
  }

  function fillFields() {
    document.querySelectorAll('[data-owner-field]').forEach((input) => {
      const key = input.dataset.ownerField;
      input.value = settings[key] || '';
    });
    document.querySelectorAll('[data-owner-color]').forEach((input) => {
      const key = input.dataset.ownerColor;
      input.value = settings.colors[key] || '#000000';
    });
    document.getElementById('newPasscode').value = settings.passcode || DEFAULT_SETTINGS.passcode;
    renderPortfolioManager();
  }
  function gatherFields() {
    document.querySelectorAll('[data-owner-field]').forEach((input) => {
      settings[input.dataset.ownerField] = input.value;
    });
    document.querySelectorAll('[data-owner-color]').forEach((input) => {
      settings.colors[input.dataset.ownerColor] = input.value;
    });
  }
  function openPanel() {
    loginCard.classList.add('hidden');
    panel.classList.remove('hidden');
    fillFields();
  }
  function unlockDemoPanel() {
    settings = getSettings();
    openPanel();
    loginMessage.textContent = 'Demo preview unlocked. The real version can require the password.';
  }

  loginBtn?.addEventListener('click', unlockDemoPanel);
  passInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      unlockDemoPanel();
    }
  });

  document.querySelectorAll('[data-owner-image]').forEach((input) => {
    input.addEventListener('change', () => {
      const key = input.dataset.ownerImage;
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        settings.images[key] = e.target.result;
        actionMessage.textContent = `Loaded a new image for ${key}. Click save all changes.`;
      };
      reader.readAsDataURL(file);
    });
  });

  document.getElementById('saveOwnerSettings')?.addEventListener('click', () => {
    gatherFields();
    ensurePortfolioItems();
    saveSettings(settings);
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    actionMessage.textContent = 'Saved. Open the public pages in this browser to review the changes.';
  });



  document.getElementById('addPortfolioItem')?.addEventListener('click', () => {
    ensurePortfolioItems();
    settings.portfolioItems.push({
      title: 'New portfolio photo',
      category: 'wedding',
      image: 'assets/images/gallery-wedding-1.jpg',
      size: 'standard'
    });
    renderPortfolioManager();
    actionMessage.textContent = 'Added a new portfolio photo. Update the fields and click save all changes.';
    switchTab('portfolio');
  });

  document.getElementById('resetPortfolioItems')?.addEventListener('click', () => {
    settings.portfolioItems = structuredClone(DEFAULT_SETTINGS.portfolioItems || []);
    renderPortfolioManager();
    actionMessage.textContent = 'Portfolio photos reset to defaults. Click save all changes.';
    switchTab('portfolio');
  });

  document.getElementById('savePasscode')?.addEventListener('click', () => {
    const next = document.getElementById('newPasscode').value.trim();
    settings.passcode = next || DEFAULT_SETTINGS.passcode;
    saveSettings(settings);
    actionMessage.textContent = 'Password saved.';
  });

  document.getElementById('exportSettings')?.addEventListener('click', () => {
    gatherFields();
    ensurePortfolioItems();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rowan-vale-settings.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('importSettings')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(evt.target.result) };
        settings.portfolioItems = Array.isArray(settings.portfolioItems) ? settings.portfolioItems : structuredClone(DEFAULT_SETTINGS.portfolioItems || []);
        settings.colors = { ...DEFAULT_SETTINGS.colors, ...(settings.colors || {}) };
        settings.images = { ...DEFAULT_SETTINGS.images, ...(settings.images || {}) };
        saveSettings(settings);
        fillFields();
        applyTextSettings(settings);
        applyColorSettings(settings);
        applyImageSettings(settings);
        renderSocialLinks(settings);
        actionMessage.textContent = 'Settings file imported.';
      } catch {
        actionMessage.textContent = 'That settings file could not be imported.';
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetSettings')?.addEventListener('click', () => {
    settings = structuredClone(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    saveSettings(settings);
    fillFields();
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    actionMessage.textContent = 'Settings reset to defaults.';
  });
});
