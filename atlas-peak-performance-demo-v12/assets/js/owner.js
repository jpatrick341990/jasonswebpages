document.addEventListener('DOMContentLoaded', ()=>{
  const { DEFAULT_SETTINGS, getSettings, saveSettings, applyTextSettings, applyColorSettings, applyImageSettings, renderSocialLinks, getMonkeyIcons } = window.AtlasPeak;
  const loginCard = document.getElementById('ownerLoginCard');
  const panel = document.getElementById('ownerPanel');
  const passInput = document.getElementById('ownerPasscode');
  const loginBtn = document.getElementById('ownerLoginBtn');
  const loginMessage = document.getElementById('ownerLoginMessage');
  const actionMessage = document.getElementById('ownerActionMessage');
  const toggleButtons = document.querySelectorAll('[data-password-toggle]');
  let settings = getSettings();

  function refreshMonkeyButtons(){
    const icons = getMonkeyIcons('classic');
    toggleButtons.forEach((button)=>{
      const target = document.getElementById(button.dataset.passwordToggle);
      if(!target) return;
      button.textContent = target.type === 'password' ? icons.hidden : icons.shown;
      button.setAttribute('aria-label', target.type === 'password' ? 'Show password' : 'Hide password');
      button.title = target.type === 'password' ? 'Show password' : 'Hide password';
    });
  }

  toggleButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
      const target = document.getElementById(button.dataset.passwordToggle);
      if(!target) return;
      target.type = target.type === 'password' ? 'text' : 'password';
      refreshMonkeyButtons();
    });
  });

  const tabs = [...document.querySelectorAll('.owner-tab')];
  const panels = [...document.querySelectorAll('.owner-tab-panel')];

  function switchTab(name){
    tabs.forEach((tab)=> tab.classList.toggle('active', tab.dataset.tab === name));
    panels.forEach((panelItem)=> panelItem.classList.toggle('active', panelItem.dataset.panel === name));
  }
  tabs.forEach((tab)=> tab.addEventListener('click', ()=> switchTab(tab.dataset.tab)));

  function fillFields(){
    document.querySelectorAll('[data-owner-field]').forEach((input)=>{
      const key = input.dataset.ownerField;
      input.value = settings[key] || '';
    });
    document.querySelectorAll('[data-owner-color]').forEach((input)=>{
      const key = input.dataset.ownerColor;
      input.value = settings.colors[key] || '#000000';
    });
    const newPass = document.getElementById('newPasscode');
    if(newPass) newPass.value = settings.passcode || DEFAULT_SETTINGS.passcode;
    document.querySelectorAll('[data-owner-preview]').forEach((preview)=>{
      const key = preview.dataset.ownerPreview;
      preview.src = settings.images[key] || '';
    });
    refreshMonkeyButtons();
  }

  function gatherFields(){
    document.querySelectorAll('[data-owner-field]').forEach((input)=>{
      settings[input.dataset.ownerField] = input.value;
    });
    document.querySelectorAll('[data-owner-color]').forEach((input)=>{
      settings.colors[input.dataset.ownerColor] = input.value;
    });
  }

  function openPanel(){
    loginCard.classList.add('hidden');
    panel.classList.remove('hidden');
    fillFields();
  }

  refreshMonkeyButtons();

  function unlockDemoPanel(){
    settings = getSettings();
    openPanel();
    loginMessage.textContent = '';
  }

  loginBtn?.addEventListener('click', unlockDemoPanel);
  passInput?.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter'){
      event.preventDefault();
      unlockDemoPanel();
    }
  });

  document.getElementById('saveOwnerSettings')?.addEventListener('click', ()=>{
    gatherFields();
    saveSettings(settings);
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    fillFields();
    actionMessage.textContent = 'Saved. Refresh the public pages in this browser to see changes.';
  });

  document.querySelectorAll('[data-owner-image]').forEach((input)=>{
    input.addEventListener('change', ()=>{
      const key = input.dataset.ownerImage;
      const file = input.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (event)=>{
        settings.images[key] = event.target.result;
        fillFields();
        actionMessage.textContent = `Loaded new image for ${key}. Click SAVE ALL CHANGES.`;
      };
      reader.readAsDataURL(file);
    });
  });

  document.getElementById('exportSettings')?.addEventListener('click', ()=>{
    gatherFields();
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'atlas-peak-settings.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.getElementById('importSettings')?.addEventListener('change', (event)=>{
    const file = event.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent)=>{
      try{
        const parsed = JSON.parse(loadEvent.target.result);
        settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          colors: { ...DEFAULT_SETTINGS.colors, ...(parsed.colors || {}) },
          images: { ...DEFAULT_SETTINGS.images, ...(parsed.images || {}) }
        };
        saveSettings(settings);
        applyTextSettings(settings);
        applyColorSettings(settings);
        applyImageSettings(settings);
        renderSocialLinks(settings);
        fillFields();
        actionMessage.textContent = 'Settings file loaded.';
      }catch(error){
        actionMessage.textContent = 'Could not read that settings file.';
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetSettings')?.addEventListener('click', ()=>{
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    saveSettings(settings);
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    fillFields();
    actionMessage.textContent = 'Owner settings reset to default.';
  });

  document.getElementById('savePasscode')?.addEventListener('click', ()=>{
    const newPass = document.getElementById('newPasscode');
    settings.passcode = newPass.value.trim() || DEFAULT_SETTINGS.passcode;
    saveSettings(settings);
    refreshMonkeyButtons();
    actionMessage.textContent = 'Password saved for demo preview mode.';
  });
});
