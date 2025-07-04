import { defineConfig } from 'tsup';

export default defineConfig([
  // Main bundles for backward compatibility
  {
    entry: {
      'index': 'src/index.ts',
      'line-1_5px': 'src/components/line-1_5px.ts',
      'solid': 'src/components/solid.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false, // Disable splitting for main bundles
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: ['react', 'react-native-svg'],
    esbuildOptions(options) {
      // Remove the banner to avoid "use client" warnings
      options.banner = {};
    },
  },
  // Individual icon files for tree-shaking
  {
    entry: ['src/components/**/*.tsx'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: false, // Don't clean since we're building after main bundles
    treeshake: true,
    minify: false,
    external: ['react', 'react-native-svg'],
    outDir: 'dist/icons',
    esbuildOptions(options) {
      // Remove the banner to avoid "use client" warnings
      options.banner = {};
    },
  },
]);