
document.addEventListener('DOMContentLoaded', ()=>{
  const {
    DEFAULT_SETTINGS,
    getSettings,
    saveSettings,
    applyTextSettings,
    applyColorSettings,
    applyImageSettings,
    renderSocialLinks,
    DEFAULT_CATALOG,
    getCatalog,
    saveCatalog,
    resetCatalog,
    deepClone
  } = window.AsterVineStudio;

  const loginCard=document.getElementById('ownerLoginCard');
  const panel=document.getElementById('ownerPanel');
  const passInput=document.getElementById('ownerPasscode');
  const loginBtn=document.getElementById('ownerLoginBtn');
  const loginMessage=document.getElementById('ownerLoginMessage');
  const actionMessage=document.getElementById('ownerActionMessage');
  const toggleBtn=document.getElementById('ownerPassToggle');

  const sectionSelect = document.getElementById('catalogSectionSelect');
  const itemList = document.getElementById('catalogItemList');
  const dynamicFields = document.getElementById('catalogDynamicFields');
  const imagePreview = document.getElementById('catalogImagePreview');
  const imageUpload = document.getElementById('catalogImageUpload');
  const imagePathInput = document.getElementById('catalogImagePath');
  const catalogActionMessage = document.getElementById('catalogActionMessage');
  const catalogFormTitle = document.getElementById('catalogFormTitle');
  const catalogFormHelp = document.getElementById('catalogFormHelp');

  const tabs=[...document.querySelectorAll('.owner-tab')];
  const tabPanels=[...document.querySelectorAll('.owner-tab-panel')];
  let settings=getSettings();
  let catalog=getCatalog();
  let activeSection='collections';
  let activeIndex=0;
  let catalogEditorReady=false;

  const sectionConfig = {
    collections: {
      label:'Homepage collections',
      help:'These cards show on the homepage collection section.',
      fields:[
        {key:'active', label:'Show this card', type:'checkbox'},
        {key:'badge', label:'Badge', type:'text'},
        {key:'title', label:'Title', type:'text'},
        {key:'description', label:'Description', type:'textarea'},
        {key:'alt', label:'Image alt text', type:'text'}
      ],
      blank:()=>({active:true,badge:'New collection',title:'New collection',description:'Add a short floral description here.',image:'assets/images/collection-daily.jpg',alt:'Floral card'})
    },
    products: {
      label:'Shop products',
      help:'These cards feed the homepage featured products and the full shop page.',
      fields:[
        {key:'active', label:'Show this product', type:'checkbox'},
        {key:'home', label:'Show on homepage', type:'checkbox'},
        {key:'badge', label:'Badge', type:'text'},
        {key:'title', label:'Title', type:'text'},
        {key:'description', label:'Description', type:'textarea'},
        {key:'price', label:'Price', type:'text'},
        {key:'detail', label:'Detail line', type:'text'},
        {key:'alt', label:'Image alt text', type:'text'},
        {key:'categories', label:'Categories (comma separated)', type:'tags'}
      ],
      blank:()=>({active:true,home:false,badge:'New product',title:'New bouquet',description:'Describe the arrangement.',price:'$95',detail:'Seasonal mix',image:'assets/images/collection-daily.jpg',alt:'Bouquet image',categories:['daily']})
    },
    portfolio: {
      label:'Portfolio cards',
      help:'These cards power the main portfolio grid.',
      fields:[
        {key:'active', label:'Show this portfolio card', type:'checkbox'},
        {key:'badge', label:'Badge', type:'text'},
        {key:'title', label:'Title', type:'text'},
        {key:'description', label:'Description', type:'textarea'},
        {key:'alt', label:'Image alt text', type:'text'},
        {key:'categories', label:'Categories (comma separated)', type:'tags'}
      ],
      blank:()=>({active:true,badge:'Portfolio',title:'New floral story',description:'Describe the work here.',image:'assets/images/portfolio-editorial.jpg',alt:'Portfolio image',categories:['editorial']})
    },
    servicePackages: {
      label:'Service package cards',
      help:'These cards feed the main services pricing section.',
      fields:[
        {key:'active', label:'Show this package', type:'checkbox'},
        {key:'featured', label:'Feature this package', type:'checkbox'},
        {key:'badge', label:'Badge', type:'text'},
        {key:'title', label:'Title', type:'text'},
        {key:'price', label:'Price', type:'text'},
        {key:'buttonLabel', label:'Button text', type:'text'},
        {key:'buttonLink', label:'Button link', type:'text'},
        {key:'items', label:'Included items (one per line)', type:'list'}
      ],
      blank:()=>({active:true,featured:false,badge:'New package',title:'New service package',price:'From $250',buttonLabel:'Learn more',buttonLink:'booking.html',items:['Add package item 1','Add package item 2']})
    },
    serviceExtras: {
      label:'Service extra cards',
      help:'These smaller cards sit under the service package area.',
      fields:[
        {key:'active', label:'Show this extra', type:'checkbox'},
        {key:'icon', label:'Icon / symbol', type:'text'},
        {key:'title', label:'Title', type:'text'},
        {key:'description', label:'Description', type:'textarea'}
      ],
      blank:()=>({active:true,icon:'✿',title:'New service extra',description:'Add the service extra description here.'})
    },
    homeFaqs: {
      label:'Homepage FAQs',
      help:'These FAQ cards appear on the homepage.',
      fields:[
        {key:'active', label:'Show this FAQ', type:'checkbox'},
        {key:'question', label:'Question', type:'text'},
        {key:'answer', label:'Answer', type:'textarea'}
      ],
      blank:()=>({active:true,question:'New question?',answer:'Add the answer here.'})
    },
    serviceFaqs: {
      label:'Service FAQs',
      help:'These FAQ cards appear on the services page.',
      fields:[
        {key:'active', label:'Show this FAQ', type:'checkbox'},
        {key:'question', label:'Question', type:'text'},
        {key:'answer', label:'Answer', type:'textarea'}
      ],
      blank:()=>({active:true,question:'New question?',answer:'Add the answer here.'})
    },
    testimonials: {
      label:'Testimonials',
      help:'These quotes appear on the homepage and portfolio page.',
      fields:[
        {key:'active', label:'Show this quote', type:'checkbox'},
        {key:'quote', label:'Quote', type:'textarea'},
        {key:'cite', label:'Name / cite line', type:'text'}
      ],
      blank:()=>({active:true,quote:'Add a new client quote here.',cite:'Client name · Project'})
    }
  };

  function switchTab(name){
    tabs.forEach(tab=>tab.classList.toggle('active', tab.dataset.tab===name));
    tabPanels.forEach(panelEl=>panelEl.classList.toggle('active', panelEl.dataset.panel===name));
  }
  tabs.forEach(tab=>tab.addEventListener('click', ()=>switchTab(tab.dataset.tab)));

  toggleBtn?.addEventListener('click', ()=>{
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide passcode' : 'Show passcode');
    toggleBtn.textContent = isHidden ? '🐵' : '🙈';
  });

  function fillFields(){
    document.querySelectorAll('[data-owner-field]').forEach(input=>{
      const key=input.dataset.ownerField;
      input.value=settings[key] || '';
    });
    document.querySelectorAll('[data-owner-color]').forEach(input=>{
      const key=input.dataset.ownerColor;
      input.value=settings.colors[key] || '#000000';
    });
    const newPass=document.getElementById('newPasscode');
    if(newPass) newPass.value=settings.passcode || DEFAULT_SETTINGS.passcode;
  }

  function gatherFields(){
    document.querySelectorAll('[data-owner-field]').forEach(input=>{
      settings[input.dataset.ownerField]=input.value;
    });
    document.querySelectorAll('[data-owner-color]').forEach(input=>{
      settings.colors[input.dataset.ownerColor]=input.value;
    });
  }

  function openPanel(){
    loginCard?.classList.add('hidden');
    panel?.classList.remove('hidden');
    fillFields();
    if(!catalogEditorReady){
      initCatalogEditor();
      catalogEditorReady = true;
    }
  }

  loginBtn?.addEventListener('click', ()=>{
    openPanel();
    if(loginMessage) loginMessage.textContent='Demo gate only. No real password is required in this preview.';
  });

  passInput?.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter'){
      event.preventDefault();
      loginBtn?.click();
    }
  });

  document.getElementById('saveOwnerSettings')?.addEventListener('click', ()=>{
    gatherFields();
    saveSettings(settings);
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    actionMessage.textContent='Saved. Open the site pages in this browser to see changes.';
  });

  document.querySelectorAll('[data-owner-image]').forEach(input=>{
    input.addEventListener('change', ()=>{
      const key=input.dataset.ownerImage;
      const file=input.files?.[0];
      if(!file) return;
      const reader=new FileReader();
      reader.onload = e => {
        settings.images[key]=e.target.result;
        actionMessage.textContent=`Loaded a new image for ${key}. Click SAVE ALL CHANGES.`;
      };
      reader.readAsDataURL(file);
    });
  });

  document.getElementById('exportSettings')?.addEventListener('click', ()=>{
    gatherFields();
    const blob=new Blob([JSON.stringify(settings, null, 2)], {type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='aster-vine-settings.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('importSettings')?.addEventListener('change', (e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload = evt => {
      try{
        settings = {...DEFAULT_SETTINGS, ...JSON.parse(evt.target.result)};
        settings.colors={...DEFAULT_SETTINGS.colors, ...(settings.colors||{})};
        settings.images={...DEFAULT_SETTINGS.images, ...(settings.images||{})};
        saveSettings(settings);
        fillFields();
        applyTextSettings(settings);
        applyColorSettings(settings);
        applyImageSettings(settings);
        renderSocialLinks(settings);
        actionMessage.textContent='Imported settings successfully.';
      }catch(err){
        actionMessage.textContent='That settings JSON file could not be imported.';
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetSettings')?.addEventListener('click', ()=>{
    settings = deepClone(DEFAULT_SETTINGS);
    saveSettings(settings);
    fillFields();
    applyTextSettings(settings);
    applyColorSettings(settings);
    applyImageSettings(settings);
    renderSocialLinks(settings);
    actionMessage.textContent='Settings reset to defaults.';
  });

  document.getElementById('savePasscode')?.addEventListener('click', ()=>{
    const val=document.getElementById('newPasscode').value.trim();
    settings.passcode = val || DEFAULT_SETTINGS.passcode;
    saveSettings(settings);
    actionMessage.textContent='Preview passcode saved.';
  });

  function initCatalogEditor(){
    if(!sectionSelect) return;
    sectionSelect.innerHTML = Object.entries(sectionConfig).map(([key, config]) => `<option value="${key}">${config.label}</option>`).join('');
    sectionSelect.value = activeSection;
    sectionSelect.addEventListener('change', ()=>{
      activeSection = sectionSelect.value;
      activeIndex = 0;
      renderCatalogEditor();
    });
    document.getElementById('catalogAddItemBtn')?.addEventListener('click', ()=>{
      const item = sectionConfig[activeSection].blank();
      catalog[activeSection] = catalog[activeSection] || [];
      catalog[activeSection].push(item);
      activeIndex = catalog[activeSection].length - 1;
      persistCatalog('Added a new card.');
      renderCatalogEditor();
    });
    document.getElementById('catalogDuplicateItemBtn')?.addEventListener('click', ()=>{
      const list = catalog[activeSection] || [];
      const item = list[activeIndex];
      if(!item) return;
      const duplicate = deepClone(item);
      if(duplicate.title) duplicate.title = `${duplicate.title} Copy`;
      list.splice(activeIndex + 1, 0, duplicate);
      activeIndex = activeIndex + 1;
      persistCatalog('Duplicated the selected card.');
      renderCatalogEditor();
    });
    document.getElementById('catalogSaveItemBtn')?.addEventListener('click', saveCurrentCatalogItem);
    document.getElementById('catalogDeleteItemBtn')?.addEventListener('click', ()=>{
      const list = catalog[activeSection] || [];
      if(!list.length) return;
      list.splice(activeIndex, 1);
      activeIndex = Math.max(0, activeIndex - 1);
      persistCatalog('Deleted the selected card.');
      renderCatalogEditor();
    });
    imageUpload?.addEventListener('change', handleCatalogImageUpload);
    imagePathInput?.addEventListener('input', ()=>{
      if(imagePreview) imagePreview.src = imagePathInput.value.trim() || '';
    });
    document.getElementById('exportCatalog')?.addEventListener('click', ()=>{
      const blob=new Blob([JSON.stringify(catalog, null, 2)], {type:'application/json'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download='aster-vine-card-data.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    document.getElementById('importCatalog')?.addEventListener('change', (e)=>{
      const file=e.target.files?.[0];
      if(!file) return;
      const reader=new FileReader();
      reader.onload = evt => {
        try{
          const parsed = JSON.parse(evt.target.result);
          catalog = {...deepClone(DEFAULT_CATALOG), ...parsed};
          saveCatalog(catalog);
          activeIndex = 0;
          renderCatalogEditor();
          catalogActionMessage.textContent = 'Imported card data JSON successfully.';
        }catch(err){
          catalogActionMessage.textContent = 'That card data JSON could not be imported.';
        }
      };
      reader.readAsText(file);
    });
    document.getElementById('resetCatalogBtn')?.addEventListener('click', ()=>{
      catalog = deepClone(DEFAULT_CATALOG);
      resetCatalog();
      activeIndex = 0;
      renderCatalogEditor();
      catalogActionMessage.textContent='Card data reset to the default file.';
    });
    renderCatalogEditor();
  }

  function persistCatalog(message){
    saveCatalog(catalog);
    catalogActionMessage.textContent = message + ' Open the site pages in this browser to see the update.';
  }

  function getCurrentList(){
    return catalog[activeSection] || [];
  }

  function renderCatalogEditor(){
    const config = sectionConfig[activeSection];
    const list = getCurrentList();
    if(activeIndex > list.length - 1) activeIndex = Math.max(0, list.length - 1);
    sectionSelect.value = activeSection;
    catalogFormTitle.textContent = config.label;
    catalogFormHelp.textContent = config.help;
    renderCatalogItemList(list);
    renderCatalogFields(list[activeIndex], config);
  }

  function renderCatalogItemList(list){
    if(!itemList) return;
    if(!list.length){
      itemList.innerHTML = '<div class="catalog-empty">No cards in this section yet. Click “Add new card.”</div>';
      return;
    }
    itemList.innerHTML = list.map((item, index) => {
      const title = item.title || item.question || item.quote || `Item ${index + 1}`;
      const sub = item.badge || item.price || item.cite || (item.active === false ? 'Hidden' : 'Visible');
      return `<button class="catalog-list-item${index===activeIndex ? ' active' : ''}" data-index="${index}" type="button">
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(sub)}</span>
      </button>`;
    }).join('');
    itemList.querySelectorAll('.catalog-list-item').forEach(btn=>btn.addEventListener('click', ()=>{
      activeIndex = Number(btn.dataset.index);
      renderCatalogEditor();
    }));
  }

  function renderCatalogFields(item, config){
    const current = item || config.blank();
    dynamicFields.innerHTML = config.fields.map(field => buildFieldMarkup(field, current)).join('');
    if(imagePathInput){
      imagePathInput.value = current.image || '';
      imagePreview.src = current.image || '';
      imagePreview.style.display = current.image ? 'block' : 'none';
    }
  }

  function buildFieldMarkup(field, item){
    const id = `field-${field.key}`;
    if(field.type === 'checkbox'){
      return `<label class="owner-toggle-row owner-inline-toggle"><input id="${id}" data-catalog-field="${field.key}" type="checkbox" ${item[field.key] ? 'checked' : ''}><span>${field.label}</span></label>`;
    }
    if(field.type === 'textarea'){
      return `<label style="grid-column:1/-1"><span>${field.label}</span><textarea id="${id}" data-catalog-field="${field.key}">${escapeHTML(item[field.key] || '')}</textarea></label>`;
    }
    if(field.type === 'tags'){
      return `<label style="grid-column:1/-1"><span>${field.label}</span><input id="${id}" data-catalog-field="${field.key}" type="text" value="${escapeHTML((item[field.key] || []).join(', '))}"></label>`;
    }
    if(field.type === 'list'){
      return `<label style="grid-column:1/-1"><span>${field.label}</span><textarea id="${id}" data-catalog-field="${field.key}">${escapeHTML((item[field.key] || []).join('\n'))}</textarea></label>`;
    }
    return `<label><span>${field.label}</span><input id="${id}" data-catalog-field="${field.key}" type="text" value="${escapeHTML(item[field.key] || '')}"></label>`;
  }

  function handleCatalogImageUpload(){
    const file=imageUpload?.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload = e => {
      imagePathInput.value = e.target.result;
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      catalogActionMessage.textContent='Loaded a new image. Click SAVE SELECTED CARD.';
    };
    reader.readAsDataURL(file);
  }

  function saveCurrentCatalogItem(){
    const config = sectionConfig[activeSection];
    const list = getCurrentList();
    if(!list.length){
      list.push(config.blank());
      activeIndex = 0;
    }
    const item = list[activeIndex] || config.blank();
    config.fields.forEach(field => {
      const input = dynamicFields.querySelector(`[data-catalog-field="${field.key}"]`);
      if(!input) return;
      if(field.type === 'checkbox') item[field.key] = input.checked;
      else if(field.type === 'tags') item[field.key] = input.value.split(',').map(v=>v.trim()).filter(Boolean);
      else if(field.type === 'list') item[field.key] = input.value.split('\n').map(v=>v.trim()).filter(Boolean);
      else item[field.key] = input.value.trim();
    });
    if('image' in item || imagePathInput.value.trim()) item.image = imagePathInput.value.trim();
    list[activeIndex] = item;
    catalog[activeSection] = list;
    persistCatalog('Saved the selected card.');
    renderCatalogEditor();
  }

  function escapeHTML(value){
    return String(value ?? '').replace(/[&<>\"]/g, match => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[match]));
  }
});
