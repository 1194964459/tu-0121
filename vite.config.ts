import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { viteMockServe } from 'vite-plugin-mock';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  const useMock = env.VITE_USE_MOCK === 'true';

  return {
    base: mode === 'production' ? '/tu-0121/' : './',
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      viteMockServe({
        mockPath: 'src/mock',
        enable: isDev && useMock,
        watchFiles: true,
        logger: true
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      open: true,
      proxy: isDev && !useMock ? {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ant-design': ['ant-design-vue'],
            'utils': ['lodash-es', 'dayjs']
          }
        },
        onwarn(warning, warn) {
          if (warning.message.includes('src/mock')) {
            return;
          }
          warn(warning);
        }
      }
    }
  };
});
