import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

async function getAuthCookie() {
  try {
    const res = await fetch('https://crm.skch.cz/v3/index.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=lm&password=mjf7JIM1WM',
      redirect: 'manual'
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/PHPSESSID=[^;]+/);
      if (match) {
        console.log('Auto-login successful!');
        return match[0];
      }
    }
  } catch (e) {
    console.error('Auto-login failed:', e);
  }
  return '';
}

export default defineConfig(async () => {
  const authCookie = await getAuthCookie();

  return {
    plugins: [
      react(),
      basicSsl(),
    ],
    resolve: {
      alias: {
        Utils: path.resolve(import.meta.dirname, 'src/utils/'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    define: {
      PRODUCTION: false,
    },
    server: {
      port: 9000,
      host: true,
      proxy: {
        '^/(rest\\.php|index\\.php)': {
          target: 'https://crm.skch.cz/v3',
          changeOrigin: true,
          secure: false,
          headers: authCookie ? { Cookie: authCookie } : {}
        }
      }
    },
  };
});
