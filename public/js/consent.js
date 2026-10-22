(() => {
  const key = 'mktlibertad_cookie_preferences', deniedKey = 'mktlibertad_analytics_denied', id = 'G-HXM22WWPKP';
  const checkbox = document.getElementById('analytics');
  const en = document.documentElement.lang === 'en';
  const messages = en ? {
  "on": "Analytics allowed and choice saved.",
  "off": "Analytics rejected and choice saved.",
  "tab": "Analytics is off for this tab, including navigation and refresh while the session marker remains available. The permanent choice could not be saved; stored permission may remain in other tabs. Clear site data in browser settings to remove stored permission.",
  "page": "Analytics is off on this page. The choice could not be saved and refusal cannot be assured on the next page; stored permission may remain in other tabs. Clear site data in browser settings before navigating or refreshing."
} : {
  "on": "Analítica permitida y elección guardada.",
  "off": "Analítica rechazada y elección guardada.",
  "tab": "La analítica está desactivada en esta pestaña, incluso al navegar y recargar mientras el marcador de sesión siga disponible. No se pudo guardar la elección permanente; el permiso guardado puede seguir disponible en otras pestañas. Borra los datos del sitio en el navegador para retirar el permiso guardado.",
  "page": "La analítica está desactivada en esta página. No se pudo guardar la elección ni asegurar el rechazo en la siguiente página; el permiso guardado puede seguir disponible en otras pestañas. Borra los datos del sitio antes de navegar o recargar."
};
  function state() {
    let denied = window.__mktlibertadDenied === true;
    try {
      denied = sessionStorage.getItem(deniedKey) === '1' || denied;
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key + '-write-check', '1');
      if (localStorage.getItem(key + '-write-check') !== '1') throw Error('Storage unavailable');
      localStorage.removeItem(key + '-write-check');
      if (localStorage.getItem(key + '-write-check') !== null) throw Error('Storage unavailable');
      const valid = typeof saved?.analytics === 'boolean';
      return { analytics: !denied && valid && saved.analytics, denied, failed: false, decided: valid || denied, storedFalse: valid && saved.analytics === false };
    } catch { return { analytics: false, denied, failed: true, decided: false, storedFalse: false }; }
  }
  function apply(consent) {
    window['ga-disable-' + id] = !consent;
    if (!consent) {
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (/^_ga(?:_|$)/.test(name)) {
          for (const domain of ['', '; domain=' + location.hostname, '; domain=.mktlibertad.com']) document.cookie = name + '=; Max-Age=0; path=/' + domain;
        }
      }
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (window.__mktlibertadLoaded) return;
    window.__mktlibertadLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function retainDenial() {
    window.__mktlibertadDenied = true; apply(false);
    try { sessionStorage.setItem(deniedKey, '1'); return sessionStorage.getItem(deniedKey) === '1'; } catch { return false; }
  }
  function clearDenial() {
    try {
      sessionStorage.getItem(deniedKey);
      sessionStorage.removeItem(deniedKey);
      return sessionStorage.getItem(deniedKey) === null;
    } catch { return false; }
  }
  function rollbackGrant() {
    try {
      localStorage.setItem(key, JSON.stringify({ analytics: false }));
      if (JSON.parse(localStorage.getItem(key) || 'null')?.analytics === false) return true;
    } catch {}
    try { localStorage.removeItem(key); return localStorage.getItem(key) === null; } catch { return false; }
  }
  function sync(message, current = state(), saved) {
    apply(current.analytics);
    if (checkbox) checkbox.checked = current.analytics;
    const feedback = message || (current.failed ? messages.page : current.denied && !current.storedFalse ? messages.tab : current.decided ? (current.analytics ? messages.on : messages.off) : '');
    document.querySelectorAll('[data-consent-status]').forEach(node => { node.textContent = feedback; });
    const banner = document.getElementById('cookie-banner');
    banner?.classList[(saved === undefined ? current.decided : saved) ? 'add' : 'remove']('hidden');
  }
  function save(value) {
    value = value === true;
    let stored = false, retained = false;
    if (!value) {
      retained = retainDenial();
      try { localStorage.setItem(key, JSON.stringify({ analytics: false })); stored = JSON.parse(localStorage.getItem(key) || 'null')?.analytics === false; } catch {}
    } else {
      try {
        if (state().failed || !clearDenial()) throw Error('Choice unavailable');
        localStorage.setItem(key, JSON.stringify({ analytics: true }));
        if (JSON.parse(localStorage.getItem(key) || 'null')?.analytics !== true) throw Error('Choice not retained');
        window.__mktlibertadDenied = false;
        const current = state(); if (current.failed || !current.analytics) throw Error('Choice unavailable');
        stored = true;
      } catch { rollbackGrant(); retained = retainDenial(); }
    }
    let current = state();
    if (stored && value && !current.analytics) {
      rollbackGrant(); retained = retainDenial(); stored = false; current = state();
    }
    const message = stored ? (current.analytics ? messages.on : messages.off) : (retained ? messages.tab : messages.page);
    sync(message, current, stored);
    return { saved: stored, analytics: current.analytics, message };
  }
  window.MktlibertadConsent = { read: () => { const current = state(); return { analytics: current.analytics, decided: current.decided }; }, save };
  sync();
  document.querySelectorAll('[data-cookie-accept]').forEach(node => node.addEventListener('click', () => save(true)));
  document.querySelectorAll('[data-cookie-reject]').forEach(node => node.addEventListener('click', () => save(false)));
  document.getElementById('cookie-settings')?.addEventListener('submit', event => { event.preventDefault(); save(checkbox?.checked === true); });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) sync(); });
})();
