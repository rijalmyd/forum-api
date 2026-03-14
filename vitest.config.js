import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    fileParallelism: false,
    maxWorkers: 1,
    coverage: {
      exclude: [
        'src/Commons/config.js',
        'src/Commons/**',
      ],
    },
  },
});