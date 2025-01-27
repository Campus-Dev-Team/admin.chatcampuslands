import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src', // Alias para simplificar importaciones
      },
    },
    server: {
      host: env.VITE_HOST || 'localhost', // Host definido en las variables de entorno o localhost por defecto
      port: parseInt(env.VITE_PORT_FRONTEND, 10) || 3000, // Puerto del frontend desde variables de entorno o 3000 por defecto
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://chatcampuslands.com:8443/chatbot/', // URL base para el backend
          changeOrigin: true, // Cambiar el origen del encabezado Host
          secure: true, // Asegurar que las solicitudes sean HTTPS
        },
      },
    },
  };
});
