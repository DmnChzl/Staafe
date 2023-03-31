import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/ddg': {
        target: 'https://safe.duckduckgo.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/ddg/, '')
      },
      '/eco': {
        target: 'https://ac.ecosia.org',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/eco/, '')
      }
    },
    port: 1234
  }
});
