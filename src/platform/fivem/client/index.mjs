import ESX from '../../../client';

// Create wrappers
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
    
    const name = prop.substr(0, 1).toUpperCase() + prop.substr(1);

    if(global[name] === undefined)
      throw new Error(`[esx] native ${prop} does not exists`);

    return global[name];

  }

});

// Instanciate ESX
const esx = new ESX({
  platform: 'fivem',
  logWrapper,
  eventWrapper,
  flowControlWrapper,
  nativeWrapper
});

// Forward events
(async () => {
  while(!esx.natives.networkIsPlayerActive(esx.natives.playerId())) {
    await esx.delay(0);
  }

  esx.emit('player.connect');
  esx.emitServer('player.connect');

  esx.natives.shutdownLoadingScreen();
  esx.natives.freezeEntityPosition(esx.natives.playerPedId(), false);
  esx.emit('player.spawn');
})();

// Initialize ESX
esx.init();

(async () => {
  let previousCoords = {x: 0.0, y: 0.0, z: 0.0};

  while(true) {
    const playerPed = esx.natives.playerPedId();
    const playerCoords = esx.natives.getEntityCoords(playerPed);
    const distance = esx.natives.getDistanceBetweenCoords(playerCoords[0], playerCoords[1], playerCoords[2], previousCoords.x, previousCoords.y, previousCoords.z, true);

    if (distance > 1) {
      const playerRotation = esx.natives.getEntityRotation(playerPed, 0);
      previousCoords = {x: playerCoords[0], y: playerCoords[1], z: playerCoords[2]};
      esx.emitServer('player.position.update', previousCoords, {x: playerRotation[0], y: playerRotation[1], z: playerRotation[2]});
    }

    await esx.delay(1000);
  }

})();