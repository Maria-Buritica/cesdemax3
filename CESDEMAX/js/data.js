/*
 * Catálogo recuperado del commit documentado en el brief:
 * Malvandrew/semestre2Integrador — 0296a0f1496a28b1132cd3b580e2ca81690e0ac1
 * Los cinco afiches se extrajeron de la página de evidencias del brief.
 */
window.CINEMAX_DATA = {
  brand: {
    name: 'CESDEMAX',
    project: 'CINEMAX CESDE',
    email: 'cinemaxcesde@gmail.com',
    location: 'Medellín, Colombia'
  },
  prices: { vip: 25000, general: 15000 },
  rooms: [
    { id: 's1', name: 'Sala 1', rows: ['A', 'B', 'C'], columns: 10, vipRows: ['A'] },
    { id: 's2', name: 'Sala 2', rows: ['A', 'B', 'C'], columns: 10, vipRows: ['A'] },
    { id: 's3', name: 'Sala 3', rows: ['A', 'B', 'C'], columns: 10, vipRows: ['A'] }
  ],
  films: [
    { id: 'p1', title: 'Noche de Neón', genre: 'Acción', duration: 118, image: 'assets/images/pelicula-1.webp', description: 'Dos agentes persiguen a una red criminal por una ciudad que nunca apaga sus luces.' },
    { id: 'p2', title: 'Tierra Roja', genre: 'Ciencia ficción', duration: 104, image: 'assets/images/pelicula-2.webp', description: 'Una astronauta queda sola en Marte y debe volver a casa antes de que se acabe el oxígeno.' },
    { id: 'p3', title: 'El Último Reino', genre: 'Aventura', duration: 126, image: 'assets/images/pelicula-3.webp', description: 'Un guerrero solitario defiende la ciudad que lo vio nacer de un ejército invasor.' },
    { id: 'p4', title: 'El Pasillo', genre: 'Terror', duration: 97, image: 'assets/images/pelicula-4.webp', description: 'Una joven vuelve a la casa de su infancia y descubre que no está sola.' },
    { id: 'p5', title: 'Lluvia en París', genre: 'Romance', duration: 101, image: 'assets/images/pelicula-5.webp', description: 'Dos desconocidos comparten un paraguas y una noche que les cambia la vida.' }
  ],
  functions: [
    { id: 'p4-1230', filmId: 'p4', time: '12:30', roomId: 's1' },
    { id: 'p1-1430', filmId: 'p1', time: '14:30', roomId: 's1' },
    { id: 'p4-1645', filmId: 'p4', time: '16:45', roomId: 's1' },
    { id: 'p1-1845', filmId: 'p1', time: '18:45', roomId: 's1' },
    { id: 'p4-2100', filmId: 'p4', time: '21:00', roomId: 's1' },
    { id: 'p5-1300', filmId: 'p5', time: '13:00', roomId: 's2' },
    { id: 'p2-1500', filmId: 'p2', time: '15:00', roomId: 's2' },
    { id: 'p5-1700', filmId: 'p5', time: '17:00', roomId: 's2' },
    { id: 'p2-1900', filmId: 'p2', time: '19:00', roomId: 's2' },
    { id: 'p5-2100', filmId: 'p5', time: '21:00', roomId: 's2' },
    { id: 'p3-1330', filmId: 'p3', time: '13:30', roomId: 's3' },
    { id: 'p3-1630', filmId: 'p3', time: '16:30', roomId: 's3' },
    { id: 'p3-1930', filmId: 'p3', time: '19:30', roomId: 's3' }
  ]
};
