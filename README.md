# versado-web-styles

CSS design system and styles for Versado web projects. Built with [Vite](https://vitejs.dev/).

---

## Estructura del proyecto

```
src/
  css/
    base/         # Reset, variables, tipografía, helpers
    components/   # Botones, cards, formularios, badges, etc.
    fonts/        # Fuentes web (DM Sans, DM Serif, Mulish, Roboto, Sailors, Borsok)
    layout/       # Header, footer, sidebar, overlay, navbar móvil
    pages/        # Estilos por página (home, catálogo, detalle, blog, etc.)
    sections/     # Secciones reutilizables (brands, video banner)
  css-bundle.js   # Punto de entrada para el bundle CSS del CDN
css-dist/         # Salida del build de CSS (deployado a Vercel como CDN)
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Build de producción (HTML + JS + CSS) |
| `npm run build:css` | Genera el bundle CSS para CDN (`css-dist/style.min.css`) |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## CDN de CSS

El CSS puede servirse desde un CDN separado deployado en Vercel, lo que permite cachear el bundle de estilos de forma independiente al sitio principal.

### 1. Generar el bundle CSS

```bash
npm run build:css
```

Esto produce `css-dist/style.min.css` (y un `vercel.json` con headers de CORS y caché).

### 2. Deployar a Vercel

```bash
cd css-dist
vercel
```

O configurar el proyecto en Vercel con:
- **Build Command:** `npm run build:css`
- **Output Directory:** `css-dist`

### 3. Configurar la variable de entorno

Crear un archivo `.env` (o `.env.production`) en la raíz del proyecto con la URL del CDN deployado:

```
VITE_CSS_CDN_URL=https://tu-proyecto.vercel.app
```

### 4. Build del sitio

```bash
npm run build
```

Cuando `VITE_CSS_CDN_URL` está definido, los HTML generados referenciarán automáticamente el CDN en lugar de los archivos CSS locales.

---

## Build de producción

El build principal (`npm run build`) genera los siguientes assets en `dist/`:

- `assets/js/` — Entry points y chunks de JavaScript (minificados con Terser)
- `assets/css/` — Hojas de estilos por página
- `assets/fonts/` — Fuentes web
- `assets/images/` — Imágenes

Características del build:
- **Compresión Gzip y Brotli** automática para archivos mayores a 10 KB
- **Code splitting** con chunk `vendor` separado para dependencias de `node_modules`
- **Análisis de bundle** disponible en `stats.html` tras el build

---

## Instalación

```bash
npm install
```

Requiere Node.js >= 18.

