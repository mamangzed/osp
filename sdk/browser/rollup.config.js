import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'dist/index.js',
  output: [
    {
      file: 'dist/osp-browser.js',
      format: 'umd',
      name: 'OSP',
      sourcemap: true,
    },
    {
      file: 'dist/osp-browser.min.js',
      format: 'umd',
      name: 'OSP',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: ['node_modules/**', 'dist/**'],
    }),
  ],
};
