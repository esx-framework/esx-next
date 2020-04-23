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
global.on('playerSpawned', () => {
  esx.emit('player.spawn');
});

// Initialize ESX
esx.init();

esx.emit('player.connect');
esx.emitServer('player.connect');

(async () => {

  while(true) {


    
    await esx.delay(1000);
  }

})();