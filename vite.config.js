import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const cdnCssPlugin = {
    name: 'cdn-css',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const cdnUrl = env.VITE_CSS_CDN_URL;
        if (!cdnUrl) return html;

        return html
          // Main stylesheet → CDN bundle
          .replace(
            /<link rel="stylesheet" href="src\/css\/style\.css">/g,
            `<link rel="stylesheet" href="${cdnUrl}/style.min.css" crossorigin>`
          )
          // subscribe-form.css is already included in the CDN bundle
          .replace(
            /<link rel="stylesheet" href="src\/css\/pages\/subscribe-form\.css">/g,
            ''
          );
      },
    },
  };

  return {
  plugins: [
    cdnCssPlugin,
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'stats.html',
      template: 'treemap',
    }),
  ],
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        productos: resolve(__dirname, 'productos.html'),
        blog: resolve(__dirname, 'blog.html'),
        beneficios: resolve(__dirname, 'beneficios.html'),
        suscripcion: resolve(__dirname, 'suscripcion.html'),
        producto: resolve(__dirname, 'producto.html'),
        carrito: resolve(__dirname, 'carrito.html'),
        articulo: resolve(__dirname, 'articulo.html'),
        servicios: resolve(__dirname, 'servicios.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    assetsInlineLimit: 4096,
  },

  optimizeDeps: {
    include: [],
    exclude: [],
  },

  css: {
    devSourcemap: true,
  },
  };
});