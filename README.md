# ClearWater Piscinas · sitio informativo (mockup v2)

Página de una sola pantalla para ClearWater Piscinas (Bahía Blanca): quiénes somos, servicios, trabajos antes/después, opiniones, zonas con mapa y pedido de visita por WhatsApp.

HTML, CSS y JS estáticos, sin build. Se abre directo con `index.html` o se publica con GitHub Pages.

## Publicar en GitHub Pages

1. Crear un repositorio (por ejemplo `clearwater-piscinas`) y subir esta carpeta. El `.gitignore` deja afuera `diseño/` (material crudo del cliente) y las carpetas de trabajo.
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En uno o dos minutos queda en `https://<usuario>.github.io/clearwater-piscinas/`.

## Datos de muestra a confirmar con el cliente

| Dato | Dónde se cambia |
| --- | --- |
| Número de WhatsApp (`5492910000000`, se muestra como 291 000-0000) | `assets/js/main.js` (constante `WHATSAPP`) y los `href="https://wa.me/..."` de `index.html` |
| Barrios y localidades donde trabajan | Sección `#zonas` y `<datalist id="zonas-lista">` en `index.html` |
| Polígono de la zona urbana y puntos del mapa | `assets/js/main.js` (`city` y `towns`) |
| Lista de servicios y su descripción | Sección `#servicios` de `index.html` |
| Nota "Versión preliminar" del pie | `index.html`, al final |

## Origen del material

- Fotos de trabajos, mascota, logo y testimonios: Instagram de @clearwaterpiscinas_ (carpeta `diseño/`). Los mensajes de clientes están transcriptos de las capturas de WhatsApp publicadas, con la ortografía corregida apenas.
- Mapa base: Esri World Light Gray Canvas (con atribución en el mapa), dibujado con Leaflet 1.9.4.
- Texturas de agua de fondo (acreditadas en el pie): "Water Ripples" de Drakonfly (CC BY-SA 4.0) y "Caustic light" de fdecomite (CC BY 2.0), vía Wikimedia Commons. Detalle en `assets/credits.json`.
- Logo: recorte del logo del cliente con el fondo crema quitado (`assets/img/logo-clearwater.png`). Conviene pedirle al cliente el logo original en vector o PNG transparente.
- Tipografías: Playfair Display (la más parecida a la letra del logo) y Poppins (la de sus posteos), de Google Fonts.

## Criterios de diseño

- La identidad del cliente manda: colores de sus placas, la serif del logo y la sans de sus posteos.
- Motivo propio: las fotos se recortan con la forma de una pileta con extremo romano (como la del trabajo de diciembre), más la franja de venecitas y los remolinos celestes de sus placas.
- Fotos curadas: solo las de buena resolución y sin textos encima; se descartaron portadas de video borrosas y placas con texto.
- Antes/después solo con pares que coinciden en encuadre (la pileta verde y el equipo de filtrado).
