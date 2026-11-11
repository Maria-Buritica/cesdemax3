# CESDEMAX — CINEMAX CESDE

Sitio web multipágina en HTML5, CSS3 y JavaScript ES6, basado en el brief web y en el catálogo del commit documentado en el brief.

## Abrir en Visual Studio Code

1. Descomprime `CESDEMAX.zip`.
2. Abre la carpeta `CESDEMAX` en Visual Studio Code.
3. Recomendado: instala la extensión **Live Server**.
4. Abre `index.html` y selecciona **Open with Live Server**.
5. El sitio abrirá en el navegador. No requiere `npm install` ni frameworks.

También puedes iniciar un servidor local desde la carpeta raíz:

```bash
python -m http.server 5500
```

Después abre `http://localhost:5500`.

> Para que el almacenamiento se comparta entre páginas, utiliza Live Server o un servidor local. No abras cada HTML como un archivo aislado.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada, nosotros, historia académica, equipo, misión/visión/valores propuestos y aliados locales. |
| `cartelera.html` | Cinco películas, filtros por género, trece funciones, tres salas y selección de hasta ocho asientos. |
| `carrito.html` | Resumen de compra, ajuste de cantidades, eliminación de asientos, vaciado y pago de prueba. |
| `login.html` | Registro, inicio de sesión, edición del perfil, historial de órdenes y eliminación de métodos guardados. |

## Recorrido de prueba

1. Entra a **Cartelera** y filtra por género.
2. Selecciona una película y una de sus funciones.
3. Elige hasta ocho asientos. La fila A es VIP; las filas B y C son General.
4. Continúa al carrito. Ajusta cantidades o elimina asientos individuales.
5. Inicia sesión o crea una cuenta de demostración.
6. Paga con una tarjeta de prueba:
   - Aprobada: `4444 4444 4444 4444`
   - Aprobada: `4242 4242 4242 4242`
   - Rechazada: `5555 5555 5555 5555`
7. Para la prueba, usa una fecha futura en formato `MM/AA` y un CVV de tres dígitos.
8. Consulta el resultado en **Mi cuenta → Órdenes recientes**.

## Datos del catálogo

Los datos se recuperaron de `Front/js/data.js` en el commit `0296a0f1496a28b1132cd3b580e2ca81690e0ac1` del repositorio enlazado en el brief: https://github.com/Malvandrew/semestre2Integrador/tree/0296a0f1496a28b1132cd3b580e2ca81690e0ac1

- 5 películas: Noche de Neón, Tierra Roja, El Último Reino, El Pasillo y Lluvia en París.
- 13 funciones en las horas documentadas.
- 3 salas, cada una con 30 asientos: fila A VIP y filas B/C General.
- Tarifa de prueba General: $15.000 COP.
- Tarifa de prueba VIP: $25.000 COP.

Los cinco afiches se extrajeron de la página de evidencias del brief. La imagen panorámica de portada se generó para esta interfaz como ambientación de cine; no representa una sede real ni una película del catálogo.

## Estructura

```text
CESDEMAX/
├── index.html
├── cartelera.html
├── carrito.html
├── login.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   ├── app.js
│   ├── cartelera.js
│   ├── carrito.js
│   └── cuenta.js
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   └── images/
│       ├── hero-cinema.webp
│       ├── pelicula-1.webp
│       ├── pelicula-2.webp
│       ├── pelicula-3.webp
│       ├── pelicula-4.webp
│       └── pelicula-5.webp
├── robots.txt
├── sitemap.xml
├── FASES_DEL_PROYECTO.md
└── README.md
```

## Alcance técnico y limitaciones

- Las cuentas, el carrito, las órdenes, los asientos ocupados y los métodos de prueba se almacenan en `localStorage` del navegador.
- El inicio de sesión es una demostración de frontend; no sustituye autenticación de servidor.
- El pago es simulado con números de prueba; no existe pasarela, banco, cobro ni transacción real.
- No se almacenan el número completo de tarjeta ni el CVV.
- No hay backend, API remota ni conexión SQL Server en esta entrega.
- El brief no aporta razón social registrada, dirección comercial de una sala, redes sociales, reseñas, certificaciones ni aliados confirmados. Por eso no se inventan.
- `sitemap.xml` contiene un dominio de marcador. Sustitúyelo por el dominio real antes de publicar.
- Las tipografías Barlow Condensed y DM Sans se solicitan a Google Fonts; se definen fuentes de respaldo para uso sin conexión.

## Personalización

- Edita películas, salas, funciones y tarifas en `js/data.js`.
- Ajusta colores y fuentes en las variables CSS al inicio de `css/styles.css`.
- Cambia el correo en `js/data.js` y en el enlace de contacto de los HTML si el equipo confirma uno diferente.
- Reemplaza los afiches únicamente cuando cuentes con imágenes autorizadas y registra su procedencia.

## Créditos y criterio de veracidad

Este desarrollo conserva el identificador tipográfico CESDEMAX recreado con HTML/CSS, la paleta y los contenidos funcionales documentados en el brief. No se presentan cifras de ventas, testimonios, certificaciones, sedes ni alianzas como hechos.
