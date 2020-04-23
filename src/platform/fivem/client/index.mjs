import ESX          from '../../../client';
import * as natives from './natives';
import {Vector3}    from '@math.gl/core/dist/esm';
import {toUnsigned} from '../../../shared/utils';

const logWrapper = {
  log     : console.log,
  logError: console.error
}

const eventWrapper = {
  on        : (name, cb)      => global.on                 (name, cb),
  off       : (name, cb)      => global.removeEventListener(name, cb),
  emit      : (name, ...args) => global.emit               (name, ...args),
  onServer  : (name, cb)      => global.onNet              (name, cb),
  offServer : (name, cb)      => global.removeEventListener(name, cb),
  emitServer: (name, ...args) => global.emitNet            (name, ...args),
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

      const interval = global.setInterval(() => {

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

const nativeWrapper = new Proxy({}, {

  get: (obj, prop) => {

    if(natives[prop] !== undefined)
      return natives[prop];

    const name = prop.substr(0, 1).toUpperCase() + prop.substr(1);

    if(global[name] !== undefined)
      return global[name];

    throw new Error(`[esx] native ${prop} does not exists`);

  }

});

const esx = new ESX({
  platform: 'fivem',
  logWrapper,
  eventWrapper,
  flowControlWrapper,
  nativeWrapper
});


esx.init();

// connect / spawn
(async () => {

  while(!esx.natives.networkIsPlayerActive(esx.natives.playerId()))
    await esx.delay(0);

  esx.emit('player.connect');
  esx.emitServer('player.connect');

  esx.natives.shutdownLoadingScreen();
  esx.natives.freezeEntityPosition(esx.natives.playerPedId(), false);

  esx.emitServer('player.spawn:before', {model: toUnsigned(esx.natives.getEntityModel(esx.natives.playerPedId()))});

  startPositionSync();
})();



// coords / rot
const startPositionSync = async () => {
  let previousCoords = new Vector3(0.0, 0.0, 0.0);

  while(true) {
    const playerPed    = esx.natives.playerPedId();
    const playerCoords = esx.natives.getEntityCoords(playerPed);
    const distance     = previousCoords.distance(playerCoords);

    if (distance > 1) {

      previousCoords       = playerCoords;
      const playerRotation = esx.natives.getEntityRotation(playerPed, 0);

      esx.emitServer('player.position.update', previousCoords, {x: playerRotation.x, y: playerRotation.y, z: playerRotation.z});
    }

    await esx.delay(1000);
  }
}