import ESX         from '../../../server';
import ESXPlayer   from '../../../server/player';
import { Vector3 } from '@math.gl/core/dist/esm';

let esx;

// Create wrappers
const logWrapper = {
  log     : console.log,
  logError: console.error
}

const eventWrapper = {
  on        : (name, cb)              => global.on                 (name, cb),
  off       : (name, cb)              => global.removeEventListener(name, cb),
  emit      : (name, ...args)         => global.emit               (name, ...args),
  onClient  : (name, cb)              => global.onNet              (name, (...args) => cb(wrapPlayer(source), ...args)),
  offClient : (name, cb)              => global.removeEventListener(name, cb),
  emitClient: (player, name, ...args) => global.emitNet            (name, player ? player.get() : -1, ...args),
};

const flowControlWrapper = {
  setTimeout   : global.setTimeout,
  clearTimeout : global.clearTimeout,
  setInterval  : global.setInterval,
  clearInterval: global.clearInterval,

  delay : (timeout) => {
    return new Promise((resolve, reject) => {
      global.setTimeout(resolve, timeout);
    });
  },

  promisify: function(start, ended, check = () => true, run = null, delay = 100) {

    return function(...args) {

      return new Promise((resolve, reject) => {

        start.apply(this, args);

        const interval = global.setInterval(() => {

          if(ended.apply(this, args)) {
            global.clearInterval(interval);
            const success = check.apply(this, args);
            resolve(success);
            return;
          }

          if(run !== null)
            run.apply(this, args);

        }, delay);

      });

    }

  },

  waitFor: function(check, timeout = -1, delay = 100) {

    return new Promise((resolve, reject) => {

      const start = +new Date;

      const interval = alt.setInterval(() => {

        const now     = +new Date;
        const success = check();

        if(success || (timeout !== -1 && (now - start >= timeout))) {
          global.clearInterval(interval);
          resolve(success);
        }

      }, delay);

    });

  }

};

const player2wrapper = new Map();

const wrapPlayer = (player) => {

  if(player2wrapper.has(player))
    return player2wrapper.get(player);

  const data = {
    self    : null,
    model   : null,
    position: null,
    rotation: null
  };

  const wrapped = new ESXPlayer(esx, {

    get         : () => player,
    getId       : () => player,
    getName     : () => global.GetPlayerName(player),
    getModel    : () => data.model,
    getPosition : () => data.position,
    getRotation : () => data.rotation,

    setModel : (newModel, update = true) => {

      data.model = newModel;

      if(update)
        esx.emitClient(wrapped, 'model.set', data.model);
    },

    setPosition : (v, update = true) => {

      data.position = new Vector3(v.x, v.y, v.z);

      if(update)
        esx.emitClient(wrapped, 'position.set', {x: data.position.x, y: data.position.y, z: data.position.z});
    },

    setRotation : (v, update = true) => {

      data.rotation = new Vector3(v.x, v.y, v.z);

      if(update)
        esx.emitClient(wrapped, 'rotation.set', {x: data.rotation.x, y: data.rotation.y, z: data.rotation.z});
    },

  });

  player2wrapper.set(player, wrapped);

  return wrapped;

}

const getPlayerIdentifiers = (player) => {

  const id             = player.get();
  const identifiers    = [];
  const numIdentifiers = global.GetNumPlayerIdentifiers(id);

  for(let i=0; i<numIdentifiers; i++)
    identifiers.push(global.GetPlayerIdentifier(id, i));

  return identifiers.map(e => {

    const split = e.split(':');

    if(split[0] === 'ip' || split[0] === 'steam')
      return 'common|' + e;
    
    return 'fivem|' + e;

  });

}

// Instanciate ESX
esx = new ESX({
  platform: 'fivem',
  logWrapper,
  eventWrapper,
  flowControlWrapper,
  getPlayerIdentifiers
})

// Forward events

esx.onClient('player.connect', (player) => {
  esx.emit('player.connect', player);
});

esx.onClient('player.position.update', (player, position, rotation) => {
  player.wrapper.setPosition(position, false);
  player.wrapper.setRotation(rotation, false);
});

esx.onClient('player.spawn:before', (player, data) => {
  player.wrapper.setModel(data.model, false);
  esx.emit('player.spawn', player);
});

// Initialize ESX
esx.init();

