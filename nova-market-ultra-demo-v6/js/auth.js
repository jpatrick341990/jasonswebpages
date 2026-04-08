(function(){
  const SESSION_KEY = 'novaMarketDemoSessionV1';
  const USERS = [
    { id: 'owner-root', role: 'owner', name: 'Nova Owner', email: 'owner@novamarket.example' },
    { id: 'seller-studio', role: 'seller', name: 'Seller Studio', email: 'seller@novamarket.example' },
    { id: 'shopper-access', role: 'customer', name: 'Guest Shopper', email: 'shopper@novamarket.example' }
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
  function loginByRole(role){
    const user = USERS.find(item => item.role === role);
    if (!user) return { ok:false, message:'That preview view is not available.' };
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
    return [
      '<button class="btn btn-primary small-btn auth-quick-btn" type="button" data-role="owner">Open Owner View</button>',
      '<button class="btn btn-secondary small-btn auth-quick-btn" type="button" data-role="seller">Open Seller View</button>',
      '<button class="btn btn-secondary small-btn auth-quick-btn" type="button" data-role="customer">Open Shopper View</button>'
    ].join('');
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
      <h3>Choose a preview view</h3>
      <p class="theme-helper">This live preview keeps the account-access flow visible, but the buttons below open each role instantly so visitors can explore the store faster.</p>
      <div class="auth-role-pill" id="authRolePill">${session ? `${session.role.toUpperCase()} ACCESS` : 'NOT SIGNED IN'}</div>
      <div class="button-group wrap-buttons auth-quick-row">${quickButtons()}</div>
      <button class="btn btn-secondary small-btn" type="button" id="novaAuthLogout">Clear preview access</button>
      <div class="seller-status" id="novaAuthStatus">${session ? `Viewing the store as ${session.name}.` : 'Pick Owner, Seller, or Shopper to open that version of the store.'}</div>
      <div class="settings-note-box"><strong>Preview flow</strong><ul><li>Owner View opens the site settings and seller tools.</li><li>Seller View opens the storefront with seller dashboard access.</li><li>Shopper View opens the storefront like a customer account.</li></ul></div>`;
    layout.prepend(card);
    card.addEventListener('click', (event) => {
      const quick = event.target.closest('.auth-quick-btn');
      if (quick) {
        const result = loginByRole(quick.dataset.role);
        const status = $('#novaAuthStatus', card);
        if (!result.ok) {
          status.textContent = result.message;
          return;
        }
        status.textContent = `Viewing the store as ${result.user.name}.`;
        document.dispatchEvent(new CustomEvent('nova-auth-changed'));
        window.location.reload();
        return;
      }
      if (event.target.closest('#novaAuthLogout')) {
        logout();
        window.location.reload();
      }
    });
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
    note.innerHTML = `<p class="section-kicker">Protected Access</p><h3>Open Owner or Seller view to use the editable tools</h3><p>You can still look around this page, but editing store settings or managing seller listings works best after choosing Owner View or Seller View on the account page.</p><a class="btn btn-primary small-btn" href="account.html">Open Account Access</a>`;
    hero.appendChild(note);
  }
  document.addEventListener('DOMContentLoaded', () => { updateAccountLabels(); mountAccountAuth(); gatePrivilegedPages(); });
  document.addEventListener('nova-auth-changed', updateAccountLabels);
  document.addEventListener('nova-brand-updated', updateAccountLabels);
  window.NovaAuth = { USERS: USERS, getCurrentUser, loginByRole, logout, canManageProduct };
})();
