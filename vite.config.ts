import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
        popup: resolve(__dirname, 'popup.html'),
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
          const manifest = readFileSync(resolve(__dirname, 'src/manifest.json'), 'utf-8');
          writeFileSync(resolve(__dirname, 'dist/manifest.json'), manifest);
          console.info('Successfully copied manifest.json to dist/');

          // Copy icons/ directory contents
          const srcIconsDir = resolve(__dirname, 'src/icons');
          const distIconsDir = resolve(__dirname, 'dist/icons');
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
