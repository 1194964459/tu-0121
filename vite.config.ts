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
    base: './', // 使用相对路径，适配任意部署环境
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      viteMockServe({
        mockPath: 'src/mock',
        // 只在开发环境启用Mock插件（提供HTTP服务）
        // 生产环境通过 mockAdapter.ts 直接使用Mock数据
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
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/img/[name]-[hash][extname]`;
            }
            if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
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
