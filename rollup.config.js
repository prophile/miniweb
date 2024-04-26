import typescript from '@rollup/plugin-typescript';
import { apiExtractor } from 'rollup-plugin-api-extractor';

export default {
  input: {
    miniweb: 'src/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({
    compilerOptions: {
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      declarationDir: 'dist/types',
    },
  }), apiExtractor()]
}
