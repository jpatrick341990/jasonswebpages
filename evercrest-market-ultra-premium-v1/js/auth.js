(function(){
  const SESSION_KEY = 'evercrestMarketSessionV1';
  const USERS = [
    { id: 'owner-root', role: 'owner', name: 'Evercrest Owner', email: 'owner@evercrest.demo', password: 'owner123' },
    { id: 'seller-studio', role: 'seller', name: 'Seller Studio', email: 'seller@evercrest.demo', password: 'seller123' },
    { id: 'shopper-demo', role: 'customer', name: 'Guest Shopper', email: 'shopper@evercrest.demo', password: 'shopper123' }
  ];
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  function read(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
  }
  function save(session){
    if (!session) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function getCurrentUser(){ return read(); }
  function login(email, password){
    const user = USERS.find(item => item.email.toLowerCase() === String(email||'').trim().toLowerCase() && item.password === password);
    if (!user) return { ok:false, message:'That email and password did not match a demo account.' };
    const session = { id:user.id, role:user.role, name:user.name, email:user.email };
    save(session);
    return { ok:true, user:session };
  }
  function logout(){ save(null); document.dispatchEvent(new CustomEvent('nova-auth-changed')); }
  function canManageProduct(item, user){
    if (!user) return false;
    if (user.role === 'owner') return true;
    if (user.role === 'seller') return Boolean(item?.isCustom && item?.ownerId === user.id);
    return false;
  }
  function quickButtons(){
    return USERS.map(user => `<button class="btn btn-secondary small-btn auth-quick-btn" type="button" data-email="${user.email}" data-password="${user.password}">${user.role === 'owner' ? 'Owner' : user.role === 'seller' ? 'Seller' : 'Shopper'} Demo</button>`).join('');
  }
  function updateAccountLabels(){
    const session = getCurrentUser();
    const settings = window.NovaBrandSettings?.read?.() || {};
    const baseLabel = settings.copyHeaderAccount || 'Account';
    $$('a[href="account.html"]').forEach(link => {
      if (link.closest('.utility-links') || link.classList.contains('cart-pill') || link.classList.contains('header-wishlist-link')) return;
      const base = `👤 ${baseLabel}`;
      link.textContent = session ? `${base} · ${session.role[0].toUpperCase()}${session.role.slice(1)}` : base;
    });
    const gate = document.getElementById('authRolePill');
    if (gate) gate.textContent = session ? `${session.role.toUpperCase()} ACCESS` : 'NOT SIGNED IN';
  }
  function mountAccountAuth(){
    const layout = document.querySelector('.account-layout');
    if (!layout || document.getElementById('novaAuthCard')) return;
    const session = getCurrentUser();
    const card = document.createElement('aside');
    card.className = 'account-sidebar-card auth-sidebar-card';
    card.id = 'novaAuthCard';
    card.innerHTML = `
      <p class="section-kicker">Access</p>
      <h3>Demo Sign In</h3>
      <p class="theme-helper">Use the built-in owner, seller, or shopper accounts to preview the premium controls in this storefront.</p>
      <div class="auth-role-pill" id="authRolePill">${session ? `${session.role.toUpperCase()} ACCESS` : 'NOT SIGNED IN'}</div>
      <form id="novaAuthForm" class="upload-form auth-form">
        <input type="email" id="novaAuthEmail" placeholder="Email" value="${session?.email || ''}">
        <input type="password" id="novaAuthPassword" placeholder="Password">
        <button class="btn btn-primary" type="submit">Sign In</button>
        <button class="btn btn-secondary" type="button" id="novaAuthLogout">Sign Out</button>
        <div class="seller-status" id="novaAuthStatus">${session ? `Signed in as ${session.name}.` : 'Use the quick buttons below for the demo accounts.'}</div>
      </form>
      <div class="button-group wrap-buttons auth-quick-row">${quickButtons()}</div>
      <div class="settings-note-box"><strong>Demo logins</strong><ul><li>Owner: owner@evercrest.demo / owner123</li><li>Seller: seller@evercrest.demo / seller123</li><li>Shopper: shopper@evercrest.demo / shopper123</li></ul></div>`;
    layout.prepend(card);
    card.addEventListener('click', (event) => {
      const quick = event.target.closest('.auth-quick-btn');
      if (!quick) return;
      document.getElementById('novaAuthEmail').value = quick.dataset.email;
      document.getElementById('novaAuthPassword').value = quick.dataset.password;
    });
    $('#novaAuthForm', card).addEventListener('submit', (event) => {
      event.preventDefault();
      const result = login($('#novaAuthEmail', card).value, $('#novaAuthPassword', card).value);
      const status = $('#novaAuthStatus', card);
      if (!result.ok) {
        status.textContent = result.message;
        return;
      }
      status.textContent = `Signed in as ${result.user.name}.`;
      document.dispatchEvent(new CustomEvent('nova-auth-changed'));
      window.location.reload();
    });
    $('#novaAuthLogout', card).addEventListener('click', () => { logout(); window.location.reload(); });
  }
  function gatePrivilegedPages(){
    const page = location.pathname.split('/').pop();
    const session = getCurrentUser();
    const privileged = ['seller-dashboard.html','site-settings.html'];
    if (!privileged.includes(page)) return;
    if (session && (session.role === 'owner' || session.role === 'seller')) return;
    const hero = document.querySelector('.page-hero .container, .site-settings-hero .container');
    if (!hero || document.getElementById('authGateNotice')) return;
    const note = document.createElement('div');
    note.id = 'authGateNotice';
    note.className = 'notice-card auth-gate-notice';
    note.innerHTML = `<p class="section-kicker">Protected Preview</p><h3>Sign in as Owner or Seller to save live changes</h3><p>You can still look around this page, but saving store settings or managing seller listings works best after signing into a demo owner or seller account on the account page.</p><a class="btn btn-primary small-btn" href="account.html">Open Account Sign In</a>`;
    hero.appendChild(note);
  }
  document.addEventListener('DOMContentLoaded', () => { updateAccountLabels(); mountAccountAuth(); gatePrivilegedPages(); });
  document.addEventListener('nova-auth-changed', updateAccountLabels);
  document.addEventListener('nova-brand-updated', updateAccountLabels);
  window.NovaAuth = { USERS: USERS.map(({password, ...rest}) => rest), getCurrentUser, login, logout, canManageProduct };
})();
