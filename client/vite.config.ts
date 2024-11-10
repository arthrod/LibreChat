import path from 'path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, createLogger } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import type { Plugin } from 'vite';

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes('vite:css') && msg.includes('^^^^^^^')) {
    return;
  }
  if (msg.includes('Use build.rollupOptions.output.manualChunks')) {
    return;
  }
  originalWarning(msg, options);
};

export default defineConfig({
  customLogger: logger,
  server: {
    fs: {
      cachedChecks: false
    },
    host: 'localhost',
    port: 3090,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3080',
        changeOrigin: true
      },
      '/oauth': {
        target: 'http://localhost:3080',
        changeOrigin: true
      }
    }
  },
  envDir: '../',
  envPrefix: ['VITE_', 'SCRIPT_', 'DOMAIN_', 'ALLOW_'],
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      workbox: {
        globPatterns: ['assets/**/*.{png,jpg,svg,ico}', '**/*.{js,css,html,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      },
      manifest: {
        name: 'Cicero',
        short_name: 'Cicero',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#FF4040',
        icons: [
          {
            src: '/assets/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/assets/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/assets/apple-touch-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/assets/maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    sourcemapExclude({ excludeNodeModules: true })
  ],
  publicDir: './public',
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    outDir: './dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      },
      onwarn(warning, warn) {
        if (warning.message.includes('Error when using sourcemap')) {
          return;
        }
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, './src'),
      '$fonts': path.join(__dirname, './public/fonts')
    }
  }
});

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}
export function sourcemapExclude(opts?: SourcemapExclude): Plugin {
  return {
    name: 'sourcemap-exclude',
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes('node_modules')) {
        return {
          code,
          map: { mappings: '' }
        };
      }
    }
  };
}
