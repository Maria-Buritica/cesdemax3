# CESDEMAX — desarrollo en cinco fases

## FASE 1. Diagnóstico empresarial

### Identidad y contexto

- **Nombre del proyecto:** CINEMAX CESDE.
- **Identidad que ve el visitante:** CESDEMAX.
- **Origen:** proyecto integrador académico de primer año, segundo semestre, del programa Técnico Laboral como Asistente en Desarrollo de Software de CESDE.
- **Ubicación de referencia:** Medellín, Colombia; la propuesta busca visibilizar emprendimientos del centro de Medellín.
- **Correo publicado:** cinemaxcesde@gmail.com.
- **Equipo documentado:** Andrés Julián Bernal Montoya, María Alejandra Buriticá Santillana, Heilen Johanna Gómez Ruiz y Juan Fernando Zapata Picón.
- **Docente documentado:** Luis Fernando Henao Mesa.

El brief no presenta razón social registrada ni dirección de una sala comercial. Por eso se comunica como proyecto académico de boletería y no como una cadena de cine con sede física acreditada.

### Público y necesidades

- Público principal: personas interesadas en organizar una salida al cine en Medellín.
- Público secundario: emprendimientos del centro de Medellín que quieran conocer la propuesta de aliados.
- Necesidades principales: conocer películas, precios, funciones, sala y disponibilidad de asientos; después revisar el carrito y la orden.
- Uso previsto: celular y computador. El brief no aporta mediciones reales de edad, dispositivos o canales de llegada.

### Equipo y referentes

El equipo documentado está integrado por Andrés Julián Bernal Montoya, María Alejandra Buriticá Santillana, Heilen Johanna Gómez Ruiz y Juan Fernando Zapata Picón. El docente registrado es Luis Fernando Henao Mesa. El brief no asigna cargos individuales.

Como referentes documentales del sector se identifican Cine Colombia, Cinemark y Royal Films. Se utilizan para observar presentación de cartelera, funciones y beneficios; no son aliados ni determinan los precios de CESDEMAX.

### Oferta y diferenciadores

- Producto central: entrada de cine.
- Tipos: General y VIP.
- Tarifas de demostración del catálogo: General $15.000 COP; VIP $25.000 COP.
- Catálogo: cinco películas, trece funciones y tres salas de treinta asientos.
- Diferenciador de la propuesta: combinar cartelera y recorrido de compra con una invitación a emprendimientos locales.

### Misión, visión y valores

El brief los formula como propuestas académicas, por lo que el sitio los identifica de esa manera:

- Misión propuesta: facilitar la consulta de películas y la selección de entradas.
- Visión propuesta: conectar la experiencia de cine con propuestas de emprendimiento local.
- Valores propuestos: claridad en precios y selección, facilidad de uso y cercanía con lo local.

### Información no aportada

No se inventan razón social, sede comercial, horarios de atención al público, redes sociales, WhatsApp, testimonios, reseñas, certificaciones, premios, estadísticas de ventas ni aliados activos. Tampoco se afirma que exista una conexión a SQL Server.

## FASE 2. Propuesta creativa

### Concepto

**“La próxima historia empieza aquí”.** La dirección visual utiliza códigos de una sala cinematográfica contemporánea: fondos oscuros, jerarquía tipográfica contundente, contrastes magenta/amarillo y afiches verticales como foco de la cartelera.

### Identidad visual

| Elemento | Definición |
|---|---|
| Negro | `#000000` como base de la marca; fondo general cercano a negro para lectura. |
| Fucsia | `#FF00AA` para acciones principales y acentos. |
| Amarillo | `#FFD400` para precios, indicadores y llamados secundarios. |
| Blanco | Texto principal y contraste. |
| Grises | `#141414`, `#232323` y `#333333` para paneles. |
| Títulos | Barlow Condensed, mayúsculas y peso fuerte. |
| Lectura | DM Sans, con fuentes de respaldo. |

El identificador tipográfico CESDEMAX se recrea mediante texto y CSS, con la C amarilla y el término MAX en fucsia. No se crea un logotipo comercial distinto.

### Recursos visuales

- Los cinco afiches proceden de la página de evidencias del brief; no se les asignan películas diferentes.
- La fotografía panorámica de portada se generó como ambientación de una sala cinematográfica ficticia. No se presenta como fotografía de una sede real.
- No se añadieron fotos de personal, clientes, aliados o instalaciones reales que no estén documentadas.

## FASE 3. Diseño de interfaz y mapa del sitio

### Arquitectura

```text
Inicio — index.html
├── Nosotros
├── Historia
├── Equipo
└── Aliados

Cartelera — cartelera.html
├── Cinco películas y filtros por género
├── Funciones y salas
└── Mapa de asientos (30 por sala)

Carrito y orden — carrito.html
├── Resumen de entradas
├── Ajuste de cantidades / eliminación
└── Inicio de sesión requerido para el pago de prueba

Mi cuenta — login.html
├── Registro e inicio de sesión
├── Edición de datos
├── Historial de órdenes
└── Eliminación de métodos de pago de prueba
```

### Recorrido principal

`Inicio → Cartelera → Película → Función y sala → Asientos → Carrito → Inicio de sesión o registro → Carrito → Orden → Historial en Mi cuenta`.

### Adaptación por dispositivo

- **Escritorio:** navegación horizontal fija, tarjetas de cartelera en cinco columnas, resumen de compra junto a los asientos.
- **Tableta:** navegación compacta, rejillas de tres columnas y paneles apilados cuando el espacio lo exige.
- **Móvil:** menú hamburguesa, tarjetas en dos columnas, formularios y resumen en una columna, mapa de asientos adaptable.

## FASE 4. Desarrollo completo

### Tecnologías

HTML5 semántico, CSS3 moderno, CSS Grid, Flexbox y JavaScript ES6 sin dependencias pesadas. Los datos están separados del comportamiento en `js/data.js` y la lógica compartida está en `js/app.js`.

### Funcionalidades implementadas

- Menú responsive con control de estado accesible.
- Filtro de películas por género.
- Selección de película y sus horarios documentados.
- Mapa de tres filas por diez columnas para cada sala.
- Fila A VIP; filas B y C General.
- Límite de ocho asientos por selección.
- Carrito persistente con ajuste de cantidades y eliminación individual.
- Registro, inicio/cierre de sesión y edición de perfil en el navegador.
- Pago de prueba con respuesta aprobada o rechazada.
- Historial de órdenes y eliminación de métodos guardados.
- Avisos accesibles, textos alternativos, foco visible, metadatos SEO y respeto por `prefers-reduced-motion`.

### Datos y seguridad

No existe backend ni pasarela real. El navegador conserva los datos en `localStorage`. Las cuentas son demostrativas y no deben utilizar contraseñas reales. El pago no transmite información a un banco y no realiza cobros.

## FASE 5. Verificación y entrega

### Comprobaciones realizadas sobre el paquete

- Estructura multipágina y rutas relativas.
- Archivos HTML, CSS, JavaScript y recursos locales presentes.
- Sintaxis JavaScript revisada con `node --check`.
- Los cinco afiches y la imagen de portada están empaquetados localmente.
- Las funciones coinciden con las trece horas del archivo de datos del commit citado.
- Los botones de navegación y formularios tienen acciones asociadas; no se dejan llamadas decorativas.

### Pendientes antes de publicación pública

- Probar con compañeros y registrar observaciones reales de usabilidad.
- Sustituir el dominio de marcador en `sitemap.xml` cuando exista dominio final.
- Confirmar licencia y permiso de uso de los cinco afiches del repositorio.
- Conectar backend, autenticación segura y pasarela real solo si el proyecto evoluciona más allá de la demostración.
- Confirmar si hay una sede física, horarios comerciales, redes, aliados o datos de contacto adicionales antes de publicarlos.
