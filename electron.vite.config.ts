import { resolve, dirname } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Load variables from .env.native
  // The third argument '' loads all variables regardless of prefix
  const env = loadEnv(mode, process.cwd(), '')

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        // Changed output directory
        outDir: resolve(__dirname, 'electron/out/main'),
        rollupOptions: {
          input: resolve(__dirname, 'electron/main.ts')
        }
      }
    },

    // 2. ELECTRON PRELOAD SCRIPTS
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        // Changed output directory
        outDir: resolve(__dirname, 'electron/out/preload'),
        rollupOptions: {
          input: resolve(__dirname, 'electron/preload.ts'),
          output: {
            // Change format to 'cjs' (CommonJS)
            format: 'cjs',
            // Ensure the extension is .js for easier resolution
            entryFileNames: 'preload.js'
          }
        }
      }
    },

    // 3. VUE RENDERER (Your Frontend)
    renderer: {
      root: '.',
      define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
        'import.meta.env.VITE_APP_NATIVE': JSON.stringify(env.VITE_APP_NATIVE)
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
        // Changed output directory
        outDir: resolve(__dirname, 'electron/out/renderer'),
        assetsInlineLimit: 10240,
        rollupOptions: {
          input: resolve(__dirname, 'index.html')
        }
      }
    }
  }
})