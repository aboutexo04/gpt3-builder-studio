import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process'. Casting process to any to resolve TS error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the app code to work seamlessly
      // Maps VITE_API_KEY from .env to process.env.API_KEY in the app
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});