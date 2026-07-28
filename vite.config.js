import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiPort = Number(
    env.BRIGHT_MUSIC_API_PORT ||
    process.env.BRIGHT_MUSIC_API_PORT ||
    8788
  );

  const webPort = Number(
    env.BRIGHT_MUSIC_WEB_PORT ||
    process.env.BRIGHT_MUSIC_WEB_PORT ||
    5190
  );

  return {
    plugins: [react()],
    server: {
      port: webPort,
      strictPort: true,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
