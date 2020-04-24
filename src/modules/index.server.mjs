import * as defaultmodel  from './defaultmodel/server';
import * as spawnlocation from './spawnlocation/server';
import * as db            from './db/server';
import * as testing       from './testing/server';

export default [
  db,
  defaultmodel,
  spawnlocation,
  testing,
];
