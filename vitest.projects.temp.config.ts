import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true,
    include: [
      'features/projects/validations/create-project.schema.test.ts',
      'features/projects/hooks/actions/use-get-github-repos.test.tsx',
      'features/projects/components/new-project-page-view.test.tsx',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@lib': path.resolve(__dirname, './lib'),
      '@features': path.resolve(__dirname, './features'),
      '@styles': path.resolve(__dirname, './styles'),
      '@type': path.resolve(__dirname, './types'),
      '@messages': path.resolve(__dirname, './messages'),
      '@services': path.resolve(__dirname, './services'),
      '@i18n': path.resolve(__dirname, './i18n'),
    },
  },
});
