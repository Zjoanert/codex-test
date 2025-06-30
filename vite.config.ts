import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // When deploying to a subpath like /codex-test, configure the base URL
  base: '/codex-test/',
});
