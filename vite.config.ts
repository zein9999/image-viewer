import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(import.meta.dirname, 'src/background/index.ts'),
        content: resolve(import.meta.dirname, 'src/content/index.ts'),
        popup: resolve(import.meta.dirname, 'popup.html'),
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
      name: 'copy-manifest-and-assets',
      closeBundle() {
        try {
          // Copy manifest.json
          mkdirSync('dist', { recursive: true });
          const manifest = readFileSync(resolve(import.meta.dirname, 'src/manifest.json'), 'utf-8');
          writeFileSync(resolve(import.meta.dirname, 'dist/manifest.json'), manifest);
          console.info('Successfully copied manifest.json to dist/');

          // Copy icons/ directory contents
          const srcIconsDir = resolve(import.meta.dirname, 'src/icons');
          const distIconsDir = resolve(import.meta.dirname, 'dist/icons');
          mkdirSync(distIconsDir, { recursive: true });
          const files = readdirSync(srcIconsDir);
          for (const file of files) {
            const data = readFileSync(resolve(srcIconsDir, file));
            writeFileSync(resolve(distIconsDir, file), data);
          }
          console.info('Successfully copied icons/ to dist/');
        } catch (err) {
          console.error('Failed to copy assets:', err);
        }
      },
    },
  ],
});
