(() => {
  'use strict';
  const C = window.Cinemax;
  if (!C || !document.querySelector('#movie-grid')) return;
  const { DATA } = C;
  const $ = selector => document.querySelector(selector);
  const grid = $('#movie-grid');
  const functionGrid = $('#function-grid');
  const seatSection = $('#seat-section');
  const seatMap = $('#seat-map');
  let activeFilter = 'Todos';
  let selectedFilmId = new URLSearchParams(location.search).get('pelicula') || 'p1';
  let selectedFunctionId = '';
  let selectedSeats = [];

  const renderMovies = () => {
    grid.innerHTML = '';
    const films = DATA.films.filter(film => activeFilter === 'Todos' || film.genre === activeFilter);
    films.forEach((film, index) => {
      const card = document.createElement('article');
      card.className = `movie-card${film.id === selectedFilmId ? ' is-active' : ''}`;
      card.innerHTML = `
        <div class="movie-poster"><span class="movie-index">0${DATA.films.indexOf(film) + 1}</span><img src="${film.image}" alt="Afiche de ${film.title}" loading="lazy"></div>
        <div class="movie-info"><span class="movie-genre">${film.genre}</span><h3>${film.title}</h3><span class="movie-duration">${film.duration} min</span><button class="btn btn--outline btn--small movie-select" type="button" data-film="${film.id}">Ver funciones <span aria-hidden="true">→</span></button></div>`;
      card.querySelector('[data-film]').addEventListener('click', () => selectFilm(film.id));
      grid.append(card);
    });
    if (!films.length) grid.innerHTML = '<p class="muted">No hay películas para este filtro.</p>';
  };

  const renderFunctions = filmId => {
    functionGrid.innerHTML = '';
    const options = DATA.functions.filter(fn => fn.filmId === filmId);
    options.forEach(fn => {
      const room = C.roomById(fn.roomId);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `function-option${fn.id === selectedFunctionId ? ' is-active' : ''}`;
      button.dataset.function = fn.id;
      button.innerHTML = `<strong>${fn.time}</strong><span>${room.name}</span>`;
      button.addEventListener('click', () => selectFunction(fn.id));
      functionGrid.append(button);
    });
  };

  const selectFilm = filmId => {
    const film = C.filmById(filmId);
    if (!film) return;
    selectedFilmId = filmId;
    selectedFunctionId = '';
    selectedSeats = [];
    $('#selected-poster').src = film.image;
    $('#selected-poster').alt = `Afiche de ${film.title}`;
    $('#selected-title').textContent = film.title;
    $('#selected-description').textContent = film.description;
    $('#selected-genre').textContent = film.genre;
    $('#selected-duration').textContent = `${film.duration} minutos`;
    seatSection.hidden = true;
    renderMovies();
    renderFunctions(filmId);
    const url = new URL(location.href);
    url.searchParams.set('pelicula', filmId);
    history.replaceState({}, '', url);
  };

  const renderSeatMap = () => {
    const fn = C.functionById(selectedFunctionId);
    if (!fn) return;
    const room = C.roomById(fn.roomId);
    const film = C.filmById(fn.filmId);
    const occupied = C.getOccupied(fn.id);
    $('#seat-function-label').textContent = `${film.title} · ${fn.time} · ${room.name}. Elige hasta ocho asientos.`;
    seatMap.innerHTML = '';
    room.rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'seat-row';
      const rowLabel = document.createElement('span');
      rowLabel.className = 'seat-row-label';
      rowLabel.textContent = row;
      rowEl.append(rowLabel);
      for (let column = 1; column <= room.columns; column += 1) {
        const seatId = `${row}${column}`;
        const button = document.createElement('button');
        const typeClass = room.vipRows.includes(row) ? 'seat--vip' : 'seat--general';
        const isOccupied = occupied.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        button.type = 'button';
        button.className = `seat ${typeClass}${isSelected ? ' is-selected' : ''}`;
        button.textContent = column;
        button.setAttribute('aria-label', `Asiento ${seatId}, ${room.vipRows.includes(row) ? 'VIP' : 'General'}${isOccupied ? ', ocupado' : ''}${isSelected ? ', seleccionado' : ''}`);
        button.setAttribute('aria-pressed', String(isSelected));
        button.dataset.seat = seatId;
        button.disabled = isOccupied;
        button.addEventListener('click', () => toggleSeat(seatId));
        rowEl.append(button);
      }
      seatMap.append(rowEl);
    });
    updateSummary();
  };

  const updateSummary = () => {
    const vip = selectedSeats.filter(id => C.seatType(id) === 'vip').length;
    const general = selectedSeats.length - vip;
    const total = vip * DATA.prices.vip + general * DATA.prices.general;
    $('#seat-count').textContent = `${selectedSeats.length} / 8`;
    $('#vip-count').textContent = vip;
    $('#general-count').textContent = general;
    $('#seat-total').textContent = C.money(total);
    $('#continue-cart').disabled = selectedSeats.length === 0;
  };

  const toggleSeat = seatId => {
    if (selectedSeats.includes(seatId)) {
      selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
      if (selectedSeats.length >= 8) {
        C.toast('Puedes seleccionar máximo ocho asientos por función.', 'error');
        return;
      }
      selectedSeats.push(seatId);
    }
    renderSeatMap();
  };

  const selectFunction = functionId => {
    const fn = C.functionById(functionId);
    if (!fn) return;
    selectedFunctionId = functionId;
    const previous = C.getSelection();
    selectedSeats = previous?.functionId === functionId ? [...previous.seats] : [];
    renderFunctions(fn.filmId);
    seatSection.hidden = false;
    renderSeatMap();
    seatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(chip => chip.setAttribute('aria-pressed', String(chip === button)));
      renderMovies();
    });
  });

  $('#continue-cart').addEventListener('click', () => {
    if (!selectedFunctionId || !selectedSeats.length) return;
    const selection = {
      functionId: selectedFunctionId,
      filmId: selectedFilmId,
      seats: [...selectedSeats],
      createdAt: Date.now()
    };
    C.setSelection(selection);
    location.href = 'carrito.html';
  });

  selectFilm(selectedFilmId);
})();
