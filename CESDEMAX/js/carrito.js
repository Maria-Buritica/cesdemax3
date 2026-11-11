(() => {
  'use strict';
  const C = window.Cinemax;
  if (!C || !document.querySelector('#cart-content')) return;
  const $ = selector => document.querySelector(selector);
  const empty = $('#cart-empty');
  const content = $('#cart-content');
  let selection = C.getSelection();

  const calc = seats => {
    const vip = seats.filter(id => C.seatType(id) === 'vip').length;
    const general = seats.length - vip;
    return { vip, general, total: vip * C.DATA.prices.vip + general * C.DATA.prices.general };
  };

  const render = () => {
    selection = C.getSelection();
    const fn = selection ? C.functionById(selection.functionId) : null;
    const film = fn ? C.filmById(fn.filmId) : null;
    const room = fn ? C.roomById(fn.roomId) : null;
    if (!selection || !fn || !film || !selection.seats.length) {
      empty.hidden = false; content.hidden = true; return;
    }
    empty.hidden = true; content.hidden = false;
    $('#cart-poster').src = film.image;
    $('#cart-poster').alt = `Afiche de ${film.title}`;
    $('#cart-genre').textContent = film.genre;
    $('#cart-film-title').textContent = film.title;
    $('#cart-function-meta').textContent = `${fn.time} · ${room.name}`;
    $('#cart-seat-label').textContent = `Asientos: ${selection.seats.join(', ')}`;
    renderItems();
    const user = C.currentUser();
    $('#login-gate').hidden = Boolean(user);
    $('#checkout-area').hidden = !user;
    $('#checkout-greeting').textContent = user ? `La orden quedará asociada a ${user.name}.` : '';
  };

  const renderItems = () => {
    const prices = calc(selection.seats);
    const rows = [];
    if (prices.vip) rows.push({ type: 'vip', label: 'Entrada VIP', detail: 'Fila A', count: prices.vip, amount: prices.vip * C.DATA.prices.vip });
    if (prices.general) rows.push({ type: 'general', label: 'Entrada General', detail: 'Filas B y C', count: prices.general, amount: prices.general * C.DATA.prices.general });
    const itemsEl = $('#cart-items');
    itemsEl.innerHTML = '';
    rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'cart-item';
      rowEl.innerHTML = `<div><strong>${row.label} · ${C.money(C.DATA.prices[row.type])}</strong><small>${row.detail} · Subtotal ${C.money(row.amount)}</small></div><div class="quantity-control"><button type="button" data-change="${row.type}" data-delta="-1" aria-label="Quitar una entrada ${row.label}">−</button><span>${row.count}</span><button type="button" data-change="${row.type}" data-delta="1" aria-label="Agregar una entrada ${row.label}">+</button></div>`;
      itemsEl.append(rowEl);
    });
    const tagRow = document.createElement('div');
    tagRow.className = 'selected-tags';
    tagRow.setAttribute('aria-label', 'Entradas seleccionadas por asiento');
    tagRow.innerHTML = '<p class="muted" style="font-size:.7rem;margin:14px 0 8px">Quitar un asiento específico:</p>';
    selection.seats.forEach(seatId => {
      const tag = document.createElement('span');
      tag.className = 'seat-tag';
      tag.innerHTML = `${seatId} <button type="button" data-remove-seat="${seatId}" aria-label="Eliminar asiento ${seatId}">×</button>`;
      tagRow.append(tag);
    });
    itemsEl.append(tagRow);
    $('#cart-total').textContent = C.money(prices.total);
    $('#cart-seat-label').textContent = `Asientos: ${selection.seats.join(', ')}`;
  };

  const adjust = (type, delta) => {
    if (!selection) return;
    if (delta < 0) {
      const index = selection.seats.map(C.seatType).lastIndexOf(type);
      if (index >= 0) selection.seats.splice(index, 1);
    } else {
      if (selection.seats.length >= 8) { C.toast('El máximo por compra es de ocho asientos.', 'error'); return; }
      const freeSeat = C.availableSeats(selection.functionId, type)[0];
      if (!freeSeat) { C.toast('No hay más asientos disponibles en esta zona.', 'error'); return; }
      selection.seats.push(freeSeat);
    }
    if (!selection.seats.length) { C.clearSelection(); render(); return; }
    C.setSelection(selection); render();
  };

  $('#cart-items').addEventListener('click', event => {
    const changer = event.target.closest('[data-change]');
    if (changer) { adjust(changer.dataset.change, Number(changer.dataset.delta)); return; }
    const remover = event.target.closest('[data-remove-seat]');
    if (remover) {
      selection.seats = selection.seats.filter(id => id !== remover.dataset.removeSeat);
      if (!selection.seats.length) C.clearSelection(); else C.setSelection(selection);
      render();
    }
  });

  $('#clear-cart').addEventListener('click', () => {
    C.clearSelection(); C.toast('El carrito quedó vacío.', 'success'); render();
  });

  const validExpiry = value => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentMonth = now.getFullYear() * 12 + now.getMonth();
    const expiryMonth = (2000 + year) * 12 + (month - 1);
    return expiryMonth >= currentMonth;
  };

  $('#card-number').addEventListener('input', event => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
    event.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  $('#card-exp').addEventListener('input', event => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
    event.target.value = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
  });
  $('#card-cvv').addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4); });

  $('#checkout-form').addEventListener('submit', event => {
    event.preventDefault();
    const error = $('#payment-error'); error.textContent = '';
    const user = C.currentUser();
    const active = C.getSelection();
    if (!user || !active) { render(); return; }
    const number = $('#card-number').value.replace(/\D/g, '');
    const expiry = $('#card-exp').value.trim();
    const cvv = $('#card-cvv').value.trim();
    if (number.length !== 16 || !validExpiry(expiry) || !/^\d{3,4}$/.test(cvv)) {
      error.textContent = 'Revisa el número de tarjeta, la fecha de vencimiento y el CVV.'; return;
    }
    if (number === '5555555555555555') {
      error.textContent = 'El banco de prueba rechazó el pago. Puedes intentar con otra tarjeta de demostración.'; return;
    }
    if (number !== '4444444444444444' && number !== '4242424242424242') {
      error.textContent = 'Tarjeta no reconocida. Usa 4444 4444 4444 4444 o 4242 4242 4242 4242.'; return;
    }
    const fn = C.functionById(active.functionId);
    const film = C.filmById(fn.filmId);
    const room = C.roomById(fn.roomId);
    const totals = calc(active.seats);
    const occupied = C.read(C.KEY.occupied, {});
    const sold = occupied[fn.id] || [];
    if (active.seats.some(seat => sold.includes(seat))) {
      error.textContent = 'Uno de los asientos ya fue comprado en esta sesión. Regresa a la cartelera y selecciona otros.'; return;
    }
    const orderNumber = `CMX-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
    const order = {
      number: orderNumber, username: user.username, filmId: film.id, filmTitle: film.title,
      functionId: fn.id, time: fn.time, room: room.name, seats: [...active.seats],
      vip: totals.vip, general: totals.general, total: totals.total,
      status: 'Confirmada', payment: 'Tarjeta de prueba', createdAt: Date.now()
    };
    const orders = C.read(C.KEY.orders, []); orders.push(order); C.write(C.KEY.orders, orders);
    occupied[fn.id] = [...new Set([...sold, ...active.seats])]; C.write(C.KEY.occupied, occupied);
    if ($('#save-payment').checked) {
      const methods = C.read(C.KEY.methods, {});
      const mine = methods[user.username] || [];
      const last4 = number.slice(-4);
      if (!mine.some(method => method.last4 === last4 && method.expiry === expiry)) {
        mine.push({ id: `pay-${Date.now().toString(36)}`, brand: 'Visa', last4, expiry });
        methods[user.username] = mine; C.write(C.KEY.methods, methods);
      }
    }
    C.clearSelection();
    $('#checkout-form').hidden = true;
    $('#payment-success').hidden = false;
    $('#success-message').textContent = `Tu orden ${orderNumber} quedó confirmada por ${C.money(totals.total)}. Puedes consultar el detalle en Mi cuenta.`;
    $('#clear-cart').hidden = true;
    C.toast('Orden de demostración creada correctamente.', 'success');
  });

  render();
})();
