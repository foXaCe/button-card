import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;
const port = process.env.PORT || 5000;

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: port,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript(),
  json(),
  dev && serve(serveopts),
  !dev &&
    terser({
      ecma: 2022,
      module: true,
      compress: { passes: 2 },
      format: { comments: false },
    }),
];

export default [
  {
    input: 'src/button-card.ts',
    output: {
      dir: './dist',
      format: 'es',
      sourcemap: dev ? true : false,
    },
    plugins: [...plugins],
    watch: {
      exclude: 'node_modules/**',
    },
  },
];
