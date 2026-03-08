import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
    VueI18nPlugin({
      // 1. Tell the plugin where your global translation files are
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),

      // 2. This allows you to use YAML in the <i18n> block
      // The plugin usually detects yaml automatically, but you can force
      // strict behavior if needed by ensuring the 'yaml' loader is available.
      defaultSFCLang: 'yaml',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/': fileURLToPath(new URL('./src/', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
})
