import path          from 'path';
import resolve       from '@rollup/plugin-node-resolve';
import commonjs      from '@rollup/plugin-commonjs';
import json          from '@rollup/plugin-json';
import {terser}      from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import copy          from 'rollup-plugin-copy';

const production    = !process.env.ROLLUP_WATCH;
const RESOURCE_NAME = 'esx.altv';
const pkg           = require(__dirname + '../../../../package.json');
const external      = ['fs', 'path'].concat(Object.keys(pkg.dependencies));

export default[

  {

    input: path.join(__dirname, 'client/index.mjs'),
    
    output: {
      file: path.join(__dirname, '../../../dist/' + RESOURCE_NAME + '/src/client.bundle.mjs'),
      format: 'esm',
      sourcemap: true,
    },

    external: ['alt', 'natives'].concat(external),

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
      file: path.join(__dirname, '../../../dist/' + RESOURCE_NAME + '/src/server.bundle.mjs'),
      format: 'esm',
      sourcemap: true,
    },

    external: ['alt'].concat(external),

    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      json(),
      commonjs(),
      production && terser(),
      copy({
        targets: [
          {
            src : path.join(__dirname, '../../../package.json').replace(/\\/g, '/'),
            dest: path.join(__dirname, '../../../dist/' + RESOURCE_NAME).replace(/\\/g, '/')
          },
          {
            src : path.join(__dirname, '../../../package-lock.json').replace(/\\/g, '/'),
            dest: path.join(__dirname, '../../../dist/' + RESOURCE_NAME).replace(/\\/g, '/')
          }
        ]
      }),
    ]

  }
];
