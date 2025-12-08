import { defineConfig } from 'vite';
import zaloMiniApp from 'zmp-vite-plugin';
import react from '@vitejs/plugin-react';

export default () => {
  return defineConfig({
    root: './src',
    base: '',
    plugins: [zaloMiniApp(), react()],
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
  });
};
