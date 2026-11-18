import { defineConfig, loadEnv } from 'vite' 
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {  

  const env = loadEnv(mode, process.cwd(), '')

  const isProd = mode === 'production';
  const envPrefix = isProd ? 'VITE_PROD_' : 'VITE_DEV_';

  const backendUrl = env[`${envPrefix}BACKEND_URL`] || env.VITE_BACKEND_URL || 'http://10.17.30.21:3000'
  const gatewayTarget = env.VITE_GATEWAY_TARGET || 'http://localhost:3001'
  const objxStorageTarget = env.VITE_OBJX_STORAGE_TARGET || 'https://objxstore-sandbox.authorix.id'

  let sandboxOrigin = 'https://sandbox.authorix.id'
  try {
    sandboxOrigin = new URL(backendUrl).origin
  } catch (e) {}

  const createBackendProxy = (target) => {
    let targetOrigin = target
    try {
      targetOrigin = new URL(target).origin
    } catch (e) {}

    return {
      target,
      changeOrigin: true,
      secure: false,
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          // Set origin ke target backend itu sendiri agar backend CORS selalu meloloskan request
          proxyReq.setHeader('origin', targetOrigin);
        });
        proxy.on('proxyRes', (proxyRes, req) => {
          if (req.headers.origin) {
            proxyRes.headers['access-control-allow-origin'] = req.headers.origin;
            proxyRes.headers['access-control-allow-credentials'] = 'true';
          }
          // Hapus flag Secure agar browser menerima cookie via HTTP non-localhost (contoh: http://10.17.11.22)
          if (proxyRes.headers['set-cookie']) {
            proxyRes.headers['set-cookie'] = (Array.isArray(proxyRes.headers['set-cookie'])
              ? proxyRes.headers['set-cookie']
              : [proxyRes.headers['set-cookie']]
            ).map(cookie => cookie.replace(/;\s*Secure/gi, '').replace(/;\s*SameSite=Strict/gi, '; SameSite=Lax'));
          }
        });
      },
    }
  };

  return {
    plugins: [vue()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env[`${envPrefix}API_BASE_URL`]),
      'import.meta.env.VITE_GATEWAY_URL': JSON.stringify(env[`${envPrefix}GATEWAY_URL`]),
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(env[`${envPrefix}BACKEND_URL`]),
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env[`${envPrefix}APP_ENV`]),
    },
    build: {
      outDir: mode === 'development' ? 'dist-dev' : 'dist-prod',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    server: {
      host: true,
      proxy: {
        '/auth': createBackendProxy(backendUrl),
        '/users': createBackendProxy(backendUrl),
        '/categories': createBackendProxy(backendUrl),
        '/approval-request': createBackendProxy(backendUrl),
        '/approval-requests': createBackendProxy(backendUrl),
        '/comments': createBackendProxy(backendUrl),
        '/audit': createBackendProxy(backendUrl),
        '/uploads': createBackendProxy(backendUrl),
        '/notifications': createBackendProxy(backendUrl),
        '/objx-gateway': {
          target: gatewayTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/objx-gateway/, ''),
        },
        '/objx-storage': {
          target: objxStorageTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/objx-storage/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Kirim origin sandbox resmi agar server storage mengizinkan request
              proxyReq.setHeader('origin', sandboxOrigin);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              if (req.headers.origin) {
                proxyRes.headers['access-control-allow-origin'] = req.headers.origin;
                proxyRes.headers['access-control-allow-credentials'] = 'true';
              }
            });
          },
        },
      }
    }
  }
})