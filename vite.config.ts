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
      }
    },
    port: 1234
  }
});
