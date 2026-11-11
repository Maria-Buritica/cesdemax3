(() => {
  'use strict';
  const C = window.Cinemax;
  if (!C || !document.querySelector('#auth-view')) return;
  const $ = selector => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const nextPage = params.get('next') === 'carrito.html' ? 'carrito.html' : '';

  const hashPassword = async password => {
    const bytes = new TextEncoder().encode(password);
    if (window.crypto?.subtle) {
      const digest = await window.crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
    }
    // Respaldo funcional para navegadores que abran el sitio directamente desde file://.
    let binary = ''; bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return `local-demo-${btoa(binary)}`;
  };

  const showTab = tab => {
    const isLogin = tab === 'login';
    $('#login-form').hidden = !isLogin;
    $('#register-form').hidden = isLogin;
    $('#tab-login').setAttribute('aria-selected', String(isLogin));
    $('#tab-register').setAttribute('aria-selected', String(!isLogin));
  };
  $('#tab-login').addEventListener('click', () => showTab('login'));
  $('#tab-register').addEventListener('click', () => showTab('register'));

  const afterAuth = () => {
    if (nextPage && C.getSelection()) { location.href = nextPage; return; }
    renderDashboard();
  };

  $('#login-form').addEventListener('submit', async event => {
    event.preventDefault();
    const username = $('#login-username').value.trim();
    const password = $('#login-password').value;
    const user = C.getUsers().find(item => item.username.toLowerCase() === username.toLowerCase());
    if (!user || user.passwordHash !== await hashPassword(password)) {
      $('#login-error').textContent = 'Usuario o contraseña incorrectos. Revisa tus datos o crea una cuenta.'; return;
    }
    C.setSession(user.username); C.toast('Sesión iniciada.', 'success'); afterAuth();
  });

  $('#register-form').addEventListener('submit', async event => {
    event.preventDefault();
    const name = $('#register-name').value.trim();
    const email = $('#register-email').value.trim().toLowerCase();
    const address = $('#register-address').value.trim();
    const username = $('#register-username').value.trim();
    const password = $('#register-password').value;
    const confirm = $('#register-confirm').value;
    const error = $('#register-error'); error.textContent = '';
    if (!name || !email || !username || password.length < 6) { error.textContent = 'Completa los campos obligatorios. La contraseña debe tener al menos seis caracteres.'; return; }
    if (password !== confirm) { error.textContent = 'Las contraseñas no coinciden.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error.textContent = 'Escribe un correo electrónico válido.'; return; }
    const users = C.getUsers();
    if (users.some(item => item.username.toLowerCase() === username.toLowerCase())) { error.textContent = 'Ese nombre de usuario ya está registrado.'; return; }
    if (users.some(item => item.email.toLowerCase() === email)) { error.textContent = 'Ese correo ya está asociado a una cuenta.'; return; }
    users.push({ name, email, address, username, passwordHash: await hashPassword(password), createdAt: Date.now() });
    C.write(C.KEY.users, users); C.setSession(username); C.toast('Cuenta creada en este navegador.', 'success'); afterAuth();
  });

  const renderOrders = user => {
    const list = $('#orders-list');
    const orders = C.getOrders(user.username);
    if (!orders.length) { list.innerHTML = '<p class="muted" style="font-size:.8rem">Todavía no tienes órdenes. Cuando completes una compra de prueba aparecerá aquí.</p>'; return; }
    list.innerHTML = '';
    orders.forEach(order => {
      const el = document.createElement('article'); el.className = 'order-card';
      el.innerHTML = `<div class="order-card-top"><div><strong>${order.filmTitle}</strong><small>${order.number}</small></div><span class="status-pill">${order.status}</span></div><small>${order.time} · ${order.room} · Asientos ${order.seats.join(', ')}</small><div style="display:flex;justify-content:space-between;gap:12px;margin-top:7px"><small>${new Date(order.createdAt).toLocaleDateString('es-CO')}</small><strong class="yellow">${C.money(order.total)}</strong></div>`;
      list.append(el);
    });
  };

  const renderMethods = user => {
    const list = $('#methods-list');
    const methods = C.getMethods(user.username);
    if (!methods.length) { list.innerHTML = '<p class="muted" style="font-size:.8rem">No hay métodos guardados.</p>'; return; }
    list.innerHTML = '';
    methods.forEach(method => {
      const el = document.createElement('div'); el.className = 'method-card';
      el.innerHTML = `<div><strong>${method.brand} •••• ${method.last4}</strong><small>Vence ${method.expiry}</small></div><button class="btn btn--ghost btn--small" type="button" data-delete-method="${method.id}">Eliminar</button>`;
      list.append(el);
    });
  };

  const renderDashboard = () => {
    const user = C.currentUser();
    if (!user) { $('#auth-view').hidden = false; $('#account-view').hidden = true; return; }
    $('#auth-view').hidden = true; $('#account-view').hidden = false;
    $('#welcome-name').textContent = user.name.split(' ')[0];
    $('#profile-name').value = user.name;
    $('#profile-email').value = user.email;
    $('#profile-address').value = user.address || '';
    renderOrders(user); renderMethods(user);
    C.updateHeaderState();
  };

  $('#profile-form').addEventListener('submit', event => {
    event.preventDefault();
    const user = C.currentUser();
    if (!user) return;
    const name = $('#profile-name').value.trim();
    const email = $('#profile-email').value.trim().toLowerCase();
    const address = $('#profile-address').value.trim();
    const error = $('#profile-error'); error.textContent = '';
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { error.textContent = 'Revisa el nombre y el correo.'; return; }
    const users = C.getUsers();
    if (users.some(item => item.username !== user.username && item.email.toLowerCase() === email)) { error.textContent = 'Otro usuario ya tiene ese correo.'; return; }
    const index = users.findIndex(item => item.username === user.username);
    users[index] = { ...users[index], name, email, address };
    C.write(C.KEY.users, users);
    C.toast('Perfil actualizado.', 'success'); renderDashboard();
  });

  $('#methods-list').addEventListener('click', event => {
    const button = event.target.closest('[data-delete-method]');
    if (!button) return;
    const user = C.currentUser(); if (!user) return;
    const all = C.read(C.KEY.methods, {});
    all[user.username] = (all[user.username] || []).filter(method => method.id !== button.dataset.deleteMethod);
    C.write(C.KEY.methods, all); renderMethods(user); C.toast('Método de prueba eliminado.', 'success');
  });

  $('#logout-button').addEventListener('click', () => {
    C.logout(); C.toast('Sesión cerrada.', 'success');
    $('#account-view').hidden = true; $('#auth-view').hidden = false; showTab('login');
    $('#login-password').value = '';
  });

  if (C.currentUser()) renderDashboard();
  else showTab('login');
})();
