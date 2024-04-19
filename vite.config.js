/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    base: process.env.VITE_APP_PREFIX || '/',
    plugins: [react()],
    server: {
      port: process.env.VITE_PORT || 3000,
      host: process.env.VITE_HOST || 'localhost',
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components/'),
        public: path.resolve(__dirname, './public/'),
        pages: path.resolve(__dirname, './src/pages'),
        reduxApp: path.resolve(__dirname, './src/reduxApp'),
        routers: path.resolve(__dirname, './src/routers'),
        context: path.resolve(__dirname, './src/context'),
        utils: path.resolve(__dirname, './src/utils'),
        services: path.resolve(__dirname, './src/services'),
        navigation: path.resolve(__dirname, './src/navigation'),
        hooks: path.resolve(__dirname, './src/hooks'),
        layouts: path.resolve(__dirname, './src/layouts'),
        configs: path.resolve(__dirname, './src/configs'),
        images: path.resolve(__dirname, './src/images'),
        common: path.resolve(__dirname, './src/common'),
      },
    },
    esbuild: {
      loader: 'jsx',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
  });
};
