import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'line-1_5px': 'src/components/line-1_5px.ts',
    'solid': 'src/components/solid.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-native-svg'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
});