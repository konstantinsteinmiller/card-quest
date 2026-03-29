import { resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // 1. ELECTRON MAIN PROCESS
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main.ts')
      }
    }
  },

  // 2. ELECTRON PRELOAD SCRIPTS
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload.ts')
      }
    }
  },

  // 3. VUE RENDERER (Your Frontend)
  renderer: {
    root: '.',
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '#': resolve(__dirname, 'src/assets')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    plugins: [
      tailwindcss(),
      vue(),
      vueDevTools(),
      VueI18nPlugin({
        include: resolve(__dirname, './src/locales/**'),
        defaultSFCLang: 'yaml'
      })
    ],
    build: {
      // Your requested optimization: Inline small assets into Base64
      assetsInlineLimit: 10240,
      rollupOptions: {
        input: resolve(__dirname, 'index.html')
      }
    }
  }
})