import typescript from '@rollup/plugin-typescript';
import { apiExtractor } from 'rollup-plugin-api-extractor';
// Minification
import terser from '@rollup/plugin-terser';

const isProduction = !process.env.ROLLUP_WATCH;

if (isProduction) {
  console.log('Building for production...');
}

export default {
  input: {
    miniweb: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    compact: isProduction,
    generatedCode: {
      preset: "es2015",
      arrowFunctions: true,
      constBindings: true,
      symbols: true,
      constBindings: true,
    },
    interop: "auto",
  },
  treeshake: "smallest",
  plugins: [typescript({
    compilerOptions: {
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      declarationDir: 'dist/types',
    },
  }), apiExtractor(), isProduction && terser()]
}
