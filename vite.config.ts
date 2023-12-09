import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', //要代理的域名
        changeOrigin: true,//允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }

})
