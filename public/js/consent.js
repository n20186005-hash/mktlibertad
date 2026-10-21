(() => {
  const key = 'mktlibertad_cookie_preferences', deniedKey = 'mktlibertad_analytics_denied', gaId = 'G-HXM22WWPKP';
  const en = document.documentElement.lang === 'en';
  const messages = en ? {
    on: 'Analytics allowed in this browser.', off: 'Analytics rejected in this browser.',
    session: 'Analytics is off for this tab, including navigation and refresh. The permanent choice could not be saved and the old choice may remain. Clear site data in browser settings to remove stored permission.',
    page: 'Analytics is off on this page. Storage is unavailable; clear site data in browser settings before navigating or refreshing.'
  } : {
    on: 'Analítica permitida en este navegador.', off: 'Analítica rechazada en este navegador.',
    session: 'La analítica está desactivada en esta pestaña, incluso al navegar y recargar. No se pudo guardar la elección permanente y puede quedar el permiso anterior. Borra los datos del sitio en la configuración del navegador para retirar ese permiso.',
    page: 'La analítica está desactivada en esta página. El almacenamiento no está disponible; borra los datos del sitio antes de navegar o recargar.'
  };
  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      const denied = window.__mktlibertadDenied || sessionStorage.getItem(deniedKey) === '1';
      return { analytics: !denied && raw?.analytics === true, decided: denied || typeof raw?.analytics === 'boolean' };
    } catch { return { analytics: false, decided: false }; }
  }
  function denySession() {
    window.__mktlibertadDenied = true; window['ga-disable-' + gaId] = true;
    try { sessionStorage.setItem(deniedKey, '1'); return true; } catch { return false; }
  }
  function apply() {
    const allowed = read().analytics; window['ga-disable-' + gaId] = !allowed;
    if (!allowed) {
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      for (const part of document.cookie.split(';')) {
        const name = part.split('=')[0].trim();
        if (/^_ga(?:_|$)/.test(name)) for (const domain of ['', '; domain=' + location.hostname, '; domain=.mktlibertad.com']) document.cookie = name + '=; Max-Age=0; path=/' + domain;
      }
      return;
    }
    if (window.__mktlibertadLoaded) return;
    window.__mktlibertadLoaded = true; window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', gaId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId; document.head.appendChild(script);
  }
  function save(value) {
    value = value === true; let sessionDenied = false, saved = false;
    if (!value) sessionDenied = denySession();
    try {
      localStorage.setItem(key, JSON.stringify({ analytics: value }));
      if (value) { sessionStorage.removeItem(deniedKey); window.__mktlibertadDenied = false; }
      saved = true;
    } catch { sessionDenied = denySession() || sessionDenied; }
    apply();
    const result = { saved, analytics: read().analytics, message: saved ? (value ? messages.on : messages.off) : (sessionDenied ? messages.session : messages.page) };
    document.querySelectorAll('[data-consent-status]').forEach(node => { node.textContent = result.message; });
    const checkbox = document.getElementById('analytics'); if (checkbox) checkbox.checked = result.analytics;
    const banner = document.getElementById('cookie-banner'); if (saved) banner?.classList.add('hidden');
    return result;
  }
  window.MktlibertadConsent = { read, save };
  apply();
  const checkbox = document.getElementById('analytics'); if (checkbox) checkbox.checked = read().analytics;
  if (!read().decided) document.getElementById('cookie-banner')?.classList.remove('hidden');
  document.querySelectorAll('[data-cookie-accept]').forEach(node => node.addEventListener('click', () => save(true)));
  document.querySelectorAll('[data-cookie-reject]').forEach(node => node.addEventListener('click', () => save(false)));
  document.getElementById('cookie-settings')?.addEventListener('submit', event => { event.preventDefault(); save(checkbox?.checked === true); });
  window.addEventListener('storage', apply);
})();
