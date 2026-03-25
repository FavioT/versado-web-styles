/**
 * Vite config dedicated to building the CSS-only CDN bundle.
 *
 * Usage:
 *   npm run build:css            → produces css-dist/style.min.css
 *
 * After building, deploy the css-dist/ folder to Vercel:
 *   1. Create a new Vercel project (or use the CLI: `cd css-dist && vercel`)
 *   2. Set "Output Directory" to css-dist/ in your Vercel project settings
 *   3. Copy the deployed URL (e.g. https://rav-styles.vercel.app)
 *   4. Add it to the relevant .env file:  VITE_CSS_CDN_URL=https://rav-styles.vercel.app
 *   5. Run a normal `npm run build` → HTML files will reference the CDN automatically
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        {
            // Emits vercel.json alongside the CSS so CORS + cache headers are
            // already configured when you deploy css-dist/ to Vercel.
            name: 'emit-vercel-config',
            generateBundle() {
                this.emitFile({
                    type: 'asset',
                    fileName: 'vercel.json',
                    source: JSON.stringify(
                        {
                            headers: [
                                {
                                    source: '/(.*)',
                                    headers: [
                                        {
                                            key: 'Access-Control-Allow-Origin',
                                            value: '*',
                                        },
                                        {
                                            key: 'Cache-Control',
                                            value: 'public, max-age=31536000, immutable',
                                        },
                                    ],
                                },
                            ],
                        },
                        null,
                        2
                    ),
                });
            },
        },
    ],

    build: {
        outDir: 'css-dist',
        emptyOutDir: true,

        // Library mode: produces a (nearly empty) JS file and extracts the CSS
        lib: {
            entry: resolve(process.cwd(), 'src/css-bundle.js'),
            formats: ['es'],
            fileName: () => 'bundle', // the .js output — not needed for CDN
        },

        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name ?? '';
                    if (name.endsWith('.css')) return 'style.min.css';
                    if (/\.(woff2?|ttf|eot|otf)$/i.test(name))
                        return 'fonts/[name][extname]';
                    return '[name][extname]';
                },
            },
        },

        cssCodeSplit: false, // all CSS → single file
        cssMinify: true,
        minify: false,       // no need to minify the (essentially empty) JS entry
    },
});
