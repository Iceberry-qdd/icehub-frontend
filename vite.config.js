import { fileURLToPath, URL } from 'node:url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { codeObfuscatorPlugin } from './plugin/obfuscatorPlugin.js'
import { workboxPlugin } from './plugin/workboxPlugin'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild = false, isPreview = false }) => {
  const isBuild = command === 'build'
  return {
    // plugins字段须放在首位，否则报错
    plugins: [
      vue(),
      splitVendorChunkPlugin(),
      workboxPlugin(isBuild),
      codeObfuscatorPlugin(isBuild)
    ],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url))
      }
    },
    build: {
      cssMinify: 'esbuild',
      assetsInlineLimit: 4096,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          auth: resolve(__dirname, 'auth.html'),
          sw: resolve(__dirname, 'public/sw.js'), // 作为混淆sw的入口文件
          hash: resolve(__dirname, 'public/hash.js') // 作为混淆worker的入口文件
        },
      }
    }
  }
})
