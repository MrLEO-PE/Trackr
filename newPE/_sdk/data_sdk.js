// data_sdk.js - Firestore-aware SDK with localStorage fallback
(function() {
  const STORAGE_KEY = 'peHubUsers';
  let handlerRef = null;
  let selected = null;

  // ===== Local Storage Implementation =====
  const localImpl = {
    async init(handler) {
      handlerRef = handler || {};
      const data = this.loadData();
      if (handlerRef.onDataChanged) try { handlerRef.onDataChanged(data); } catch (e) {}
      return { isOk: true };
    },
    loadData() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; }
    },
    saveData(data) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    },
    async create(obj) {
      const id = obj.user_id || obj.student_id || String(Date.now());
      const record = Object.assign({ user_id: id }, obj);
      const data = this.loadData();
      data.push(record);
      this.saveData(data);
      window.userData = data;
      if (handlerRef.onDataChanged) try { handlerRef.onDataChanged(data); } catch (e) {}
      return { isOk: true, data: record };
    },
    async update(obj) {
      const id = obj.user_id || obj.student_id;
      if (!id) return { isOk: false, error: 'missing id' };
      const data = this.loadData();
      const idx = data.findIndex(u => u.user_id === id || u.student_id === id);
      if (idx !== -1) {
        data[idx] = Object.assign(data[idx], obj);
        this.saveData(data);
        window.userData = data;
        if (handlerRef.onDataChanged) try { handlerRef.onDataChanged(data); } catch (e) {}
        return { isOk: true, data: data[idx] };
      }
      return { isOk: false, error: 'not found' };
    },
    async get(query) {
      const data = this.loadData();
      if (!query) return { isOk: true, data };
      const filtered = data.filter(u => Object.keys(query).every(k => String(u[k]) === String(query[k])));
      return { isOk: true, data: filtered };
    }
  };

  // ===== Firestore Implementation =====
  const firestoreImpl = {
    db: null,
    async init(handler) {
      handlerRef = handler || {};
      if (!window.firebase || !window.FIREBASE_CONFIG) {
        console.warn('[dataSdk] Firebase not configured, using localStorage');
        selected = localImpl;
        return localImpl.init(handler);
      }
      try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
        this.db = firebase.firestore();
        const snap = await this.db.collection('students').get();
        const data = snap.docs.map(d => d.data());
        window.userData = data;
        if (handlerRef.onDataChanged) try { handlerRef.onDataChanged(data); } catch (e) {}
        this.db.collection('students').onSnapshot(s => {
          const live = s.docs.map(d => d.data());
          window.userData = live;
          if (handlerRef.onDataChanged) try { handlerRef.onDataChanged(live); } catch (e) {}
        });
        console.log('[dataSdk] Firestore initialized');
        return { isOk: true };
      } catch (e) {
        console.error('[dataSdk] Firestore init failed:', e);
        selected = localImpl;
        return localImpl.init(handler);
      }
    },
    async create(obj) {
      try {
        const id = obj.user_id || obj.student_id || String(Date.now());
        const payload = Object.assign({ user_id: id }, obj);
        await this.db.collection('students').doc(String(id)).set(payload);
        return { isOk: true, data: payload };
      } catch (e) {
        console.error('[dataSdk] create error:', e);
        return { isOk: false, error: e };
      }
    },
    async update(obj) {
      try {
        const id = obj.user_id || obj.student_id;
        if (!id) return { isOk: false, error: 'missing id' };
        await this.db.collection('students').doc(String(id)).set(obj, { merge: true });
        return { isOk: true };
      } catch (e) {
        console.error('[dataSdk] update error:', e);
        return { isOk: false, error: e };
      }
    },
    async get(query) {
      try {
        let q = this.db.collection('students');
        if (query) Object.keys(query).forEach(k => { q = q.where(k, '==', query[k]); });
        const snap = await q.get();
        return { isOk: true, data: snap.docs.map(d => d.data()) };
      } catch (e) {
        console.error('[dataSdk] get error:', e);
        return { isOk: false, error: e };
      }
    }
  };

  // ===== Public API =====
  window.dataSdk = {
    async init(handler) {
      selected = (window.firebase && window.FIREBASE_CONFIG) ? firestoreImpl : localImpl;
      return selected.init(handler);
    },
    async create(obj) { return selected ? selected.create(obj) : localImpl.create(obj); },
    async update(obj) { return selected ? selected.update(obj) : localImpl.update(obj); },
    async get(q) { return selected ? selected.get(q) : localImpl.get(q); }
  };

  console.log('[dataSdk] loaded (localStorage ready, Firestore optional)');
})();
