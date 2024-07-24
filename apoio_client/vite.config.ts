import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (development, production)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      // Exponha as variáveis de ambiente no código
      'process.env': {
        ...env,
        __APP_ENV__: mode
      },
    },
  };
});