// Minimal development mock of element_sdk expected by the app
// Provides init(opts) and setConfig(cfg)
(function(){
  let config = {};
  let onConfigChange = null;

  window.elementSdk = {
    async init(opts = {}) {
      // store default config and onConfigChange if provided
      config = Object.assign({}, opts.defaultConfig || {});
      onConfigChange = opts.onConfigChange || null;

      // if an onConfigChange hook is present, call it with the default config
      if (typeof onConfigChange === 'function') {
        try { onConfigChange(config); } catch (e) { console.warn('[mock elementSdk] onConfigChange error', e); }
      }

      // Return a small API the app might expect
      return { isOk: true };
    },

    setConfig(partial) {
      config = Object.assign({}, config, partial || {});
      if (typeof onConfigChange === 'function') {
        try { onConfigChange(config); } catch (e) { console.warn('[mock elementSdk] onConfigChange error', e); }
      }
    },

    // helper used by some map functions
    getConfig() {
      return config;
    },

    showToast(message, type='info') {
      console.log('[mock elementSdk] showToast', type, message);
      if (window.showNotification) window.showNotification(message, type === 'error' ? 'error' : 'success');
    }
  };
})();
