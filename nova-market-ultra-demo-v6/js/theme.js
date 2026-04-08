(function(){
  const STORAGE_KEY = 'novaOwnerThemeDemoV1';
  const defaults = {
    preset: 'nova-original',
    mode: 'dark',
    accent: '#f59e0b',
    accentAlt: '#38bdf8',
    radius: 22,
    surface: 0.09,
    textScale: 1,
    layoutWidth: 1200,
    spacing: 1,
    headerScale: 1,
    fontBody: 'Arial, sans-serif',
    fontHeading: 'Arial, sans-serif',
    headingColor: '#ffffff',
    bodyColor: '#ffffff',
    mutedColor: 'rgba(255,255,255,0.78)',
    headerColor: '#263d63',
    headerOpacity: 0.92,
    headerBorderColor: '#f18408',
    headerLinkColor: '#ffffff',
    cardTint: '#ffffff',
    cardStyle: 'soft',
    buttonStyle: 'rounded',
    buttonGlow: 1,
    buttonText: '#08101f',
    lineHeight: 1.6,
  };

  const presets = {
    'nova-original': { label:'Nova Original', values:{'--bg-main':'#0b1120','--bg-panel':'#111827','--bg-soft':'#1e2d45','--text-main':'#ffffff','--text-soft':'rgba(255,255,255,0.78)','--text-muted':'rgba(255,255,255,0.62)','--text-faint':'rgba(255,255,255,0.48)','--accent':'#f59e0b','--accent-hover':'#fb923c','--accent-alt':'#38bdf8','--border':'rgba(255,255,255,0.1)','--border-light':'rgba(255,255,255,0.06)','--bg-gradient-start':'#435065','--bg-gradient-end':'#1a2c44','--announcement-start':'#f59e0b','--announcement-end':'#fb923c'}},
    'sunset-luxe': { label:'Sunset Luxe', values:{'--bg-main':'#0b1120','--bg-panel':'#111827','--bg-soft':'#1e2d45','--text-main':'#ffffff','--text-soft':'rgba(255,255,255,0.78)','--text-muted':'rgba(255,255,255,0.62)','--text-faint':'rgba(255,255,255,0.48)','--accent':'#f59e0b','--accent-hover':'#fb923c','--accent-alt':'#38bdf8','--border':'rgba(255,255,255,0.1)','--border-light':'rgba(255,255,255,0.06)','--bg-gradient-start':'#435065','--bg-gradient-end':'#1a2c44','--announcement-start':'#f59e0b','--announcement-end':'#fb923c'}},
    'ocean-glow': { label:'Ocean Glow', values:{'--bg-main':'#081a24','--bg-panel':'#0f2430','--bg-soft':'#153948','--text-main':'#effcff','--text-soft':'rgba(239,252,255,0.8)','--text-muted':'rgba(239,252,255,0.62)','--text-faint':'rgba(239,252,255,0.46)','--accent':'#22d3ee','--accent-hover':'#67e8f9','--accent-alt':'#60a5fa','--border':'rgba(125,211,252,0.18)','--border-light':'rgba(125,211,252,0.08)','--bg-gradient-start':'#274e5f','--bg-gradient-end':'#102534','--announcement-start':'#22d3ee','--announcement-end':'#60a5fa'}},
    'rose-boutique': { label:'Rose Boutique', values:{'--bg-main':'#1b1220','--bg-panel':'#24152d','--bg-soft':'#38203f','--text-main':'#fff6fb','--text-soft':'rgba(255,246,251,0.82)','--text-muted':'rgba(255,246,251,0.64)','--text-faint':'rgba(255,246,251,0.48)','--accent':'#f472b6','--accent-hover':'#fb7185','--accent-alt':'#c084fc','--border':'rgba(244,114,182,0.16)','--border-light':'rgba(244,114,182,0.08)','--bg-gradient-start':'#5b335a','--bg-gradient-end':'#24142b','--announcement-start':'#f472b6','--announcement-end':'#fb7185'}},
    'forest-studio': { label:'Forest Studio', values:{'--bg-main':'#0f1714','--bg-panel':'#17231d','--bg-soft':'#21342b','--text-main':'#f3fbf5','--text-soft':'rgba(243,251,245,0.8)','--text-muted':'rgba(243,251,245,0.64)','--text-faint':'rgba(243,251,245,0.48)','--accent':'#34d399','--accent-hover':'#6ee7b7','--accent-alt':'#fbbf24','--border':'rgba(110,231,183,0.16)','--border-light':'rgba(110,231,183,0.08)','--bg-gradient-start':'#30493a','--bg-gradient-end':'#18281f','--announcement-start':'#34d399','--announcement-end':'#84cc16'}},
    'light-editorial': { label:'Light Editorial', values:{'--bg-main':'#f5f7fb','--bg-panel':'#ffffff','--bg-soft':'#e8edf7','--text-main':'#111827','--text-soft':'rgba(17,24,39,0.82)','--text-muted':'rgba(17,24,39,0.64)','--text-faint':'rgba(17,24,39,0.48)','--accent':'#2563eb','--accent-hover':'#1d4ed8','--accent-alt':'#7c3aed','--border':'rgba(17,24,39,0.12)','--border-light':'rgba(17,24,39,0.06)','--bg-gradient-start':'#f5f7fb','--bg-gradient-end':'#dde7f4','--announcement-start':'#2563eb','--announcement-end':'#7c3aed'}},
  };

  const fontOptions = {
    'Arial, sans-serif': 'Clean Sans',
    'Georgia, serif': 'Editorial Serif',
    'Trebuchet MS, sans-serif': 'Friendly Sans',
    'Verdana, sans-serif': 'Modern Utility',
    'Tahoma, sans-serif': 'Compact UI',
    'Gill Sans, sans-serif': 'Studio Sans',
    'Helvetica, Arial, sans-serif': 'Swiss Modern',
    'Times New Roman, serif': 'Classic Print',
  };

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (v,min,max) => Math.min(max, Math.max(min, v));

  const read = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return { ...defaults, ...raw };
    } catch {
      return { ...defaults };
    }
  };
  const save = (s) => localStorage.setItem(STORAGE_KEY, JSON.stringify(s));

  function hexToRgb(hex) {
    const raw = (hex || '#f59e0b').replace('#','').trim();
    const full = raw.length === 3 ? raw.split('').map(ch => ch+ch).join('') : raw.padEnd(6,'0').slice(0,6);
    const int = parseInt(full, 16) || 0;
    return { r:(int>>16)&255, g:(int>>8)&255, b:int&255 };
  }
  const rgba = (hex, a) => { const {r,g,b}=hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; };
  const adjust = (hex, amt) => {
    const {r,g,b}=hexToRgb(hex);
    const fix = (v) => Math.max(0, Math.min(255, v + amt));
    return '#' + [fix(r),fix(g),fix(b)].map(v => v.toString(16).padStart(2,'0')).join('');
  };

  function apply(settings){
    const root = document.documentElement;
    const preset = presets[settings.preset] || presets[defaults.preset];
    Object.entries(preset.values).forEach(([key, value]) => root.style.setProperty(key, value));

    const mode = settings.mode || defaults.mode;
    const accent = settings.accent || preset.values['--accent'];
    const accentAlt = settings.accentAlt || preset.values['--accent-alt'];
    const cardTint = settings.cardTint || defaults.cardTint;
    const surface = clamp(Number(settings.surface) || defaults.surface, 0.04, 0.2);
    const buttonGlow = clamp(Number(settings.buttonGlow) || defaults.buttonGlow, 0.4, 1.8);
    const headerOpacity = clamp(Number(settings.headerOpacity) || defaults.headerOpacity, 0.4, 1);
    const headerColor = settings.headerColor || defaults.headerColor;
    const headerBorderColor = settings.headerBorderColor || accent;

    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-hover', adjust(accent, mode === 'light' ? -24 : 18));
    root.style.setProperty('--accent-alt', accentAlt);
    root.style.setProperty('--accent-border', rgba(accent, 0.28));
    root.style.setProperty('--accent-soft', rgba(accent, 0.10));
    root.style.setProperty('--radius-lg', `${clamp(Number(settings.radius)||defaults.radius, 8, 36)}px`);
    root.style.setProperty('--radius-md', `${Math.max(12, (Number(settings.radius)||defaults.radius)-4)}px`);
    root.style.setProperty('--radius-sm', `${Math.max(8, (Number(settings.radius)||defaults.radius)-10)}px`);
    root.style.setProperty('--site-max-width', `${clamp(Number(settings.layoutWidth)||defaults.layoutWidth, 1080, 1360)}px`);
    root.style.setProperty('--section-space', `${Math.round(80 * (Number(settings.spacing)||defaults.spacing))}px`);
    root.style.setProperty('--header-scale', `${clamp(Number(settings.headerScale)||defaults.headerScale, 0.82, 1.08)}`);
    root.style.setProperty('--text-scale', `${clamp(Number(settings.textScale)||defaults.textScale, 0.92, 1.14)}`);
    root.style.setProperty('--font-body', settings.fontBody || defaults.fontBody);
    root.style.setProperty('--font-heading', settings.fontHeading || defaults.fontHeading);
    root.style.setProperty('--heading-color', settings.headingColor || preset.values['--text-main']);
    root.style.setProperty('--body-color', settings.bodyColor || preset.values['--text-main']);
    root.style.setProperty('--text-soft', settings.mutedColor || preset.values['--text-soft']);
    root.style.setProperty('--header-bg', rgba(headerColor, headerOpacity));
    root.style.setProperty('--header-border', headerBorderColor);
    root.style.setProperty('--header-link-color', settings.headerLinkColor || defaults.headerLinkColor);
    root.style.setProperty('--body-line-height', `${clamp(Number(settings.lineHeight)||defaults.lineHeight, 1.35, 1.9)}`);
    root.style.setProperty('--button-shadow', `0 12px 28px ${rgba(accent, 0.16 * buttonGlow)}`);
    root.style.setProperty('--button-text', settings.buttonText || defaults.buttonText);
    root.dataset.cardStyle = settings.cardStyle || defaults.cardStyle;
    root.dataset.buttonStyle = settings.buttonStyle || defaults.buttonStyle;
    root.dataset.themeMode = mode;
    root.style.colorScheme = mode;

    root.style.setProperty('--bg-card', rgba(cardTint, mode === 'light' ? surface * 0.75 : surface));
    root.style.setProperty('--bg-card-hover', rgba(cardTint, clamp(surface + 0.035, 0.08, 0.24)));
    root.style.setProperty('--card-border-color', rgba(cardTint, mode === 'light' ? 0.18 : 0.12));
  }

  function presetBtn(key, klass='theme-preset-btn'){
    const p = presets[key];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = klass;
    btn.dataset.themePreset = key;
    btn.innerHTML = `<span class="theme-swatch-row"><span style="background:${p.values['--bg-main']}"></span><span style="background:${p.values['--bg-panel']}"></span><span style="background:${p.values['--accent']}"></span></span><strong>${p.label}</strong>`;
    return btn;
  }

  function fillPresets(root=document){
    ['#themePagePresets','#themePresetGrid'].forEach(sel => {
      const wrap = $(sel, root) || $(sel);
      if (wrap && !wrap.dataset.ready) {
        Object.keys(presets).forEach(key => wrap.appendChild(presetBtn(key, wrap.id === 'themePresetGrid' ? 'owner-preset-btn' : 'theme-preset-btn')));
        wrap.dataset.ready = '1';
      }
    });
  }

  function fillFontSelect(select, value){
    if (!select) return;
    if (!select.dataset.ready) {
      Object.entries(fontOptions).forEach(([stack,label]) => {
        const option = document.createElement('option');
        option.value = stack;
        option.textContent = label;
        select.appendChild(option);
      });
      select.dataset.ready='1';
    }
    select.value = value;
  }

  function sync(root=document){
    const s = read();
    $$('[data-theme-preset]', root).forEach(btn => btn.classList.toggle('active', btn.dataset.themePreset === s.preset));
    const map = {
      themePageMode:s.mode,
      themePageAccent:s.accent,
      themePageAccentAlt:s.accentAlt,
      themePageRadius:s.radius,
      themePageSurface:s.surface,
      themePageTextScale:s.textScale,
      themePageLayoutWidth:s.layoutWidth,
      themePageSpacing:s.spacing,
      themePageHeaderScale:s.headerScale,
      themePageHeadingColor:s.headingColor,
      themePageBodyColor:s.bodyColor,
      themePageMutedColor:s.mutedColor,
      themePageHeaderColor:s.headerColor,
      themePageHeaderOpacity:s.headerOpacity,
      themePageHeaderBorderColor:s.headerBorderColor,
      themePageHeaderText:s.headerLinkColor,
      themePageCardTint:s.cardTint,
      themePageCardStyle:s.cardStyle,
      themePageButtonStyle:s.buttonStyle,
      themePageButtonGlow:s.buttonGlow,
      themePageButtonText:s.buttonText,
      themePageLineHeight:s.lineHeight,
    };
    Object.entries(map).forEach(([id,val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    fillFontSelect(document.getElementById('themePageFontBody'), s.fontBody);
    fillFontSelect(document.getElementById('themePageFontHeading'), s.fontHeading);
    const badge = document.getElementById('themePreviewBadge');
    if (badge) badge.textContent = `${presets[s.preset].label} • ${s.mode === 'light' ? 'Light' : 'Dark'} • ${fontOptions[s.fontHeading] || 'Custom headings'}`;
    const headerSwatch = document.getElementById('themeHeaderSwatch');
    if (headerSwatch) headerSwatch.style.background = rgba(s.headerColor, s.headerOpacity);
  }

  function commit(next){
    const merged = { ...read(), ...next };
    save(merged);
    apply(merged);
    sync(document);
  }

  function ensureHeaderSettingsLink(){
    const currentUser = window.NovaAuth?.getCurrentUser?.() || null;
    const settingsAllowed = currentUser && (currentUser.role === 'owner' || currentUser.role === 'seller');
    document.querySelectorAll('.nav a[href="site-settings.html"], .utility-links a[href="site-settings.html"], .site-footer a[href="site-settings.html"]').forEach(link => link.remove());
    document.querySelectorAll('.header-actions a, .utility-links a').forEach(a => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text === 'theme settings' || text === 'owner settings' || text === 'site settings') a.remove();
    });
    document.querySelectorAll('.footer-owner-button-wrap').forEach(el => el.remove());
    if (!settingsAllowed) return;
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    const wrap = document.createElement('div');
    wrap.className = 'container footer-owner-button-wrap';
    const label = window.NovaBrandSettings?.read?.().copyFooterOwnerButton || 'Owner Settings';
    wrap.innerHTML = `<a href="site-settings.html" class="btn btn-primary footer-owner-button">${label}</a>`;
    footer.appendChild(wrap);
  }

  function bind(){
    const mappings = {
      themePageMode:'mode',
      themePageAccent:'accent',
      themePageAccentAlt:'accentAlt',
      themePageRadius:'radius',
      themePageSurface:'surface',
      themePageTextScale:'textScale',
      themePageLayoutWidth:'layoutWidth',
      themePageSpacing:'spacing',
      themePageHeaderScale:'headerScale',
      themePageFontBody:'fontBody',
      themePageFontHeading:'fontHeading',
      themePageHeadingColor:'headingColor',
      themePageBodyColor:'bodyColor',
      themePageMutedColor:'mutedColor',
      themePageHeaderColor:'headerColor',
      themePageHeaderOpacity:'headerOpacity',
      themePageHeaderBorderColor:'headerBorderColor',
      themePageHeaderText:'headerLinkColor',
      themePageCardTint:'cardTint',
      themePageCardStyle:'cardStyle',
      themePageButtonStyle:'buttonStyle',
      themePageButtonGlow:'buttonGlow',
      themePageButtonText:'buttonText',
      themePageLineHeight:'lineHeight',
    };
    Object.entries(mappings).forEach(([id,key]) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.bound) return;
      const eventName = el.tagName === 'SELECT' || el.type === 'color' ? 'input' : 'input';
      el.addEventListener(eventName, () => commit({ [key]: el.value }));
      if (el.tagName === 'SELECT') el.addEventListener('change', () => commit({ [key]: el.value }));
      el.dataset.bound='1';
    });
    $$('.theme-preset-btn,[data-theme-preset]').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.addEventListener('click',()=>commit({ preset: btn.dataset.themePreset }));
      btn.dataset.bound='1';
    });
    const reset = document.getElementById('themePageReset');
    if (reset && !reset.dataset.bound) {
      reset.addEventListener('click',()=>{ save({...defaults}); apply(defaults); sync(document); });
      reset.dataset.bound='1';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const settings = read();
    apply(settings);
    fillPresets(document);
    sync(document);
    bind();
    ensureHeaderSettingsLink();
  });
  document.addEventListener('nova-auth-changed', ensureHeaderSettingsLink);
  document.addEventListener('nova-brand-updated', ensureHeaderSettingsLink);
})();
