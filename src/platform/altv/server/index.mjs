import * as alt from 'alt';

import ESX         from '../../../server';
import ESXPlayer   from '../../../server/player';
import { Vector3 } from '@math.gl/core/dist/esm';

let esx;

// Create wrappers
const player2wrapper = new Map();

const wrapPlayer = (player) => {

  if(player2wrapper.has(player))
    return player2wrapper.get(player);

  const wrapped = new ESXPlayer(esx, {

    get         : () => player,
    getId       : () => player.id,
    getName     : () => player.name,
    getModel    : () => player.model,
    
    getPosition : () => {
      
      const pos = player.pos;

      return new Vector3(pos.x, pos.y, pos.z);

    },

    getRotation : () => {

      const rot = player.rot;
      
      return new Vector3(
        rot.x * (180 / Math.PI),
        rot.y * (180 / Math.PI),
        rot.z * (180 / Math.PI)
      );

    },

    getHeading : () => player.rotation.z * 180 / Math.PI,

    setModel : (v, update) => {
      
      player.model = v;
      
      esx.emitClient(wrapped, 'model.set', v);
    },
    
    setPosition : (v, update) => {

      player.pos = {
        x: v.x,
        y: v.y,
        z: v.z
      };

    },

    setRotation : (v, update) => {

      player.rot = {
        x: v.x * (Math.PI / 180),
        y: v.y * (Math.PI / 180),
        z: v.z * (Math.PI / 180)
      };

    },

    setHeading  : (v, update) => {
      
      player.rot = {
        x: player.rot.x,
        y: player.rot.y,
        z: v * (Math.PI / 180)
      };

    }
  });

  player2wrapper.set(player, wrapped);

  return wrapped;

}

const logWrapper = {
  log     : alt.log,
  logError: alt.logError
}

const eventWrapper = {
  on        : (name, cb)              => alt.on        (name, cb),
  off       : (name, cb)              => alt.off       (name, cb),
  emit      : (name, ...args)         => alt.emit      (name, ...args),
  onClient  : (name, cb)              => alt.onClient  (name, (player, ...args) => cb(wrapPlayer(player), ...args)),
  offClient : (name, cb)              => alt.offClient (name, cb),
  emitClient: (player, name, ...args) => alt.emitClient(player.get(), name, ...args),
};

const flowControlWrapper = {
  setTimeout   : alt.setTimeout,
  clearTimeout : alt.clearTimeout,
  setInterval  : alt.setInterval,
  clearInterval: alt.clearInterval
};

const getPlayerIdentifiers = (player) => {

  return [
    'altv|hwid:'     + player.get().hwidHash,
    'altv|hwidex:'   + player.get().hwidExHash,
    'altv|socialid:' + player.get().socialId,
    'common|ip:'     + player.get().ip.split('ffff:')[1],
  ];

}

// Instanciate ESX
esx = new ESX({
  platform: 'altv',
  logWrapper,
  eventWrapper,
  flowControlWrapper,
  getPlayerIdentifiers,
});

// Forward events
alt.on('playerConnect', (player) => esx.emit('player.connect', wrapPlayer(player)));

esx.on('ready:before', () => {
  alt.Player.all.forEach(player => esx.emit('player.connect', wrapPlayer(player)));
});

esx.onClient('player.spawn', (player) => esx.emit('player.spawn', player));

// Initialize ESX
esx.init();


