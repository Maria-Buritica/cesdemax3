(() => {
  'use strict';
  const DATA = window.CINEMAX_DATA;
  const KEY = {
    selection: 'cinemax_selection_v1', occupied: 'cinemax_occupied_v1',
    users: 'cinemax_users_v1', session: 'cinemax_session_v1',
    orders: 'cinemax_orders_v1', methods: 'cinemax_methods_v1'
  };
  const read = (key, fallback) => {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const money = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
  const filmById = id => DATA.films.find(f => f.id === id);
  const roomById = id => DATA.rooms.find(r => r.id === id);
  const functionById = id => DATA.functions.find(f => f.id === id);
  const getSelection = () => read(KEY.selection, null);
  const setSelection = value => { write(KEY.selection, value); updateCartCount(); };
  const clearSelection = () => { localStorage.removeItem(KEY.selection); updateCartCount(); };
  const getOccupied = functionId => read(KEY.occupied, {})[functionId] || [];
  const getUsers = () => read(KEY.users, []);
  const getSessionName = () => read(KEY.session, '');
  const currentUser = () => getUsers().find(user => user.username === getSessionName()) || null;
  const setSession = username => { write(KEY.session, username); updateHeaderState(); };
  const logout = () => { localStorage.removeItem(KEY.session); updateHeaderState(); };
  const getOrders = username => read(KEY.orders, []).filter(order => order.username === username).sort((a,b) => b.createdAt - a.createdAt);
  const getMethods = username => read(KEY.methods, {})[username] || [];
  const toast = (message, kind = 'info') => {
    let region = document.querySelector('#toast-region');
    if (!region) {
      region = document.createElement('div'); region.id = 'toast-region'; region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite'); region.setAttribute('aria-atomic', 'true'); document.body.append(region);
    }
    const node = document.createElement('div'); node.className = `toast toast--${kind}`; node.textContent = message;
    region.append(node); window.setTimeout(() => node.remove(), 4200);
  };
  const seatType = seatId => seatId.startsWith('A') ? 'vip' : 'general';
  const seatPrice = seatId => DATA.prices[seatType(seatId)];
  const availableSeats = (functionId, type) => {
    const fn = functionById(functionId); if (!fn) return [];
    const room = roomById(fn.roomId); const occupied = getOccupied(functionId);
    const current = getSelection();
    const alreadySelected = current && current.functionId === functionId ? current.seats : [];
    return room.rows.flatMap(row => Array.from({ length: room.columns }, (_, i) => `${row}${i + 1}`))
      .filter(id => seatType(id) === type && !occupied.includes(id) && !alreadySelected.includes(id));
  };
  const updateCartCount = () => {
    const selection = getSelection();
    const count = selection?.seats?.length || 0;
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; el.hidden = count === 0; });
  };
  const updateHeaderState = () => {
    const user = currentUser();
    document.querySelectorAll('[data-account-label]').forEach(el => { el.textContent = user ? 'Mi cuenta' : 'Ingresar'; });
    updateCartCount();
  };
  const setupNavigation = () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen)); nav.classList.toggle('is-open', !isOpen);
      });
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
      }));
    }
    const page = document.body.dataset.page;
    document.querySelectorAll('.site-nav a[data-page-link]').forEach(link => {
      if (link.dataset.pageLink === page) link.setAttribute('aria-current', 'page');
    });
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    document.querySelectorAll('[data-current-email]').forEach(el => { el.textContent = DATA.brand.email; el.href = `mailto:${DATA.brand.email}`; });
    updateHeaderState();
  };
  document.addEventListener('DOMContentLoaded', setupNavigation);
  window.Cinemax = {
    DATA, KEY, read, write, money, filmById, roomById, functionById,
    getSelection, setSelection, clearSelection, getOccupied, getUsers, getSessionName,
    currentUser, setSession, logout, getOrders, getMethods, toast, seatType, seatPrice,
    availableSeats, updateHeaderState
  };
})();
