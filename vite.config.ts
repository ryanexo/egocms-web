import tailwindcss from '@tailwindcss/vite'
import { TDesignResolver } from '@tdesign-vue-next/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

export default defineConfig((context) => {
  const env = loadEnv(context.mode, process.cwd())
  const apiBaseURL = `^${env.VITE_API_BASE_URL}\\b`

  return {
    build: {
      target: 'es6',
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
      svgLoader(),
      AutoImport({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      cors: true,
      hmr: true,
      proxy: {
        [apiBaseURL]: {
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(apiBaseURL), ''),
          target: env.VITE_BACKEND_URL,
        },
      },
    },
  }
})
