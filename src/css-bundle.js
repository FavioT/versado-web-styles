/**
 * CSS Bundle Entry Point
 *
 * This file is the entry for the CSS-only CDN build (`npm run build:css`).
 * Vite (in library mode) will import all the CSS, minify it, and emit a
 * single `style.min.css` file into `css-dist/`.
 *
 * Add or remove imports here to control what ends up in the CDN bundle.
 */

// Main stylesheet (includes base, components, layout, sections, pages)
import './css/style.css';

// Pages not imported by style.css that should also ship in the CDN bundle
import './css/pages/subscribe-form.css';
