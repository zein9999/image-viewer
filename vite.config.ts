import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
      },
    },
  },
  plugins: [
    {
      name: 'copy-manifest',
      closeBundle() {
        try {
          mkdirSync('dist', { recursive: true });
          const manifest = readFileSync(resolve(__dirname, 'src/manifest.json'), 'utf-8');
          writeFileSync(resolve(__dirname, 'dist/manifest.json'), manifest);
          console.info('Successfully copied manifest.json to dist/');
        } catch (err) {
          console.error('Failed to copy manifest.json:', err);
        }
      },
    },
  ],
});
