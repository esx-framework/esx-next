import * as DB              from './db/server';
import * as Defaultmodel    from './defaultmodel/server';
import * as Spawnlocation   from './spawnlocation/server';
import * as CharacterEditor from './charactereditor/server';
import * as Testing         from './testing/server';

/* RP */
import * as RPBase from './[rp]/base/server';

export default [
  DB,
  Defaultmodel,
  Spawnlocation,
  CharacterEditor,
  RPBase,
  Testing,
];
