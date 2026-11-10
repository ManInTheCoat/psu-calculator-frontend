import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адреса бэкенда и MinIO. Браузер обращается только к dev-серверу 127.0.0.1:3000,
// а он проксирует запросы дальше - так обходится ограничение CORS.
const BACKEND_URL = 'http://127.0.0.1:8000'
const MINIO_URL = 'http://127.0.0.1:9000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    proxy: {
      // 1. Веб-сервис: /api/power_components -> http://127.0.0.1:8000/api/power_components
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
      // 2. S3 (MinIO): /power-components/<файл> -> http://127.0.0.1:9000/power-components/<файл>
      '/power-components': {
        target: MINIO_URL,
        changeOrigin: true,
      },
    },
  },
})
