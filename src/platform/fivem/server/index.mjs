import ESX       from '../../../server';
import ESXPlayer from '../../../server/player';

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
  emitClient: (player, name, ...args) => global.emitNet            (name, player.get(), ...args),
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
    model   : null,
    position: null,
    rotation: null
  };

  const wrapped = new ESXPlayer(esx, {

    get: () => data.id,

    getId       : () => player,
    getName     : () => global.GetPlayerName(player),
    getModel    : () => data.model,
    getPosition : () => data.position,
    getRotation : () => data.rotation,

    setModel : v => {
      data.model = v;
      global.emitNet('model.set', player, data.model);
    },

    setPosition : (v, update = true) => {
      data.position = {x: v.x, y: v.y, z: v.z};

      if (update)
        global.emitNet('position.set', player, data.position);
    },

    setRotation : (v, update = true) => {
      data.rotation = {x: v.x, y: v.y, z: v.z};

      if (update)
        global.emitNet('rotation.set', player, data.rotation);
    },

  });

  player2wrapper.set(player, wrapped);

  return wrapped;

}

// Instanciate ESX
esx = new ESX({
  platform: 'fivem',
  logWrapper,
  eventWrapper,
  flowControlWrapper
})

// Forward events

esx.onClient('player.connect', (player) => {
  esx.emit('player.connect', player);
});

esx.onClient('player.position.update', (player, position, rotation) => {
  player.wrapper.setPosition(position, false);
  player.wrapper.setRotation(rotation, false);
});

// Initialize ESX
esx.init();


