import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import { mockApiPlugin } from './mockApiPlugin.js';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    basicSsl(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      Utils: path.resolve(import.meta.dirname, 'src/utils/'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  define: {
    PRODUCTION: command === 'build',
  },
  server: {
    port: 9000,
    host: true,
  },
}));
