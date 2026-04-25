import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/')

          if (!normalizedId.includes('node_modules')) {
            return
          }

          if (normalizedId.includes('vue-router') || normalizedId.includes('pinia')) {
            return 'router-store'
          }

          if (normalizedId.includes('/vue/') || normalizedId.includes('/@vue/')) {
            return 'vue-core'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      dts: true,
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
        }),
      ],
    }),
    Components({
      dts: true,
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
        }),
      ],
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: {
      include: /element-plus/,
    },
    server: {
      deps: {
        inline: ['element-plus'],
        web: {
          transformCss: true,
        },
      },
    },
    coverage: {
      provider: 'v8',
    },
  },
})
