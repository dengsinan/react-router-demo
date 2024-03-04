import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import modifyVars from './src/style/modifyVars';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars,
      },
    },
  },
});
