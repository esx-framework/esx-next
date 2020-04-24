import path          from 'path';
import resolve       from '@rollup/plugin-node-resolve';
import commonjs      from '@rollup/plugin-commonjs';
import json          from '@rollup/plugin-json';
import {terser}      from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import copy          from 'rollup-plugin-copy';
import externals     from 'rollup-plugin-node-externals';

const production = !process.env.ROLLUP_WATCH;

const RESOURCE_NAME = 'esx.fivem';

export default[

  {

    input: path.join(__dirname, 'client/index.mjs'),
    
    output: {
      file: path.join(__dirname, '../../../dist/' + RESOURCE_NAME + '/src/client.bundle.js'),
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      nodePolyfills(),
      commonjs(),
      json(),
      production && terser(),
      copy({
        targets: [
          {
            src : path.join(__dirname, 'resource/*')                    .replace(/\\/g, '/'),
            dest: path.join(__dirname, '../../../dist/' + RESOURCE_NAME).replace(/\\/g, '/')
          },
          {
            src : path.join(__dirname, '../../html/main/*')                       .replace(/\\/g, '/'),
            dest: path.join(__dirname, '../../../dist/' + RESOURCE_NAME + '/html').replace(/\\/g, '/')
          }
        ],
      })
    ]
  },

  {

    input: path.join(__dirname, 'server/index.mjs'),
    
    output: {
      file: path.join(__dirname, '../../../dist/' + RESOURCE_NAME + '/src/server.bundle.js'),
      format: 'cjs',
      sourcemap: true,
    },

    external: [],

    plugins: [
      externals({
        packagePath: path.join(__dirname, '../../../package.json'),
        exclude: ['@math.gl/core']
      }),
      resolve(), // tells Rollup how to find date-fns in node_modules
      json(),
      commonjs(),
      production && terser(),
      copy({
        targets: [
          {
            src : path.join(__dirname, '../../../package.json').replace(/\\/g, '/'),
            dest: path.join(__dirname, '../../../dist/' + RESOURCE_NAME).replace(/\\/g, '/')
          }
        ]
      }),
    ]

  }
];
