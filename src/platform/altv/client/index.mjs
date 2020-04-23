import * as alt         from 'alt';
import * as natives     from 'natives';
import * as wrapNatives from './natives';
import Webview          from './webview';

import ESX from '../../../client';

// Create wrappers
const logWrapper = {
  log     : alt.log,
  logError: alt.logError
}

const eventWrapper = {
  on        : (name, cb)      => alt.on        (name, cb),
  off       : (name, cb)      => alt.off       (name, cb),
  emit      : (name, ...args) => alt.emit      (name, ...args),
  onServer  : (name, cb)      => alt.onServer  (name, cb),
  offServer : (name, cb)      => alt.offServer (name, cb),
  emitServer: (name, ...args) => alt.emitServer(name, ...args),
};

const flowControlWrapper = {
  setTimeout   : alt.setTimeout,
  clearTimeout : alt.clearTimeout,
  setInterval  : alt.setInterval,
  clearInterval: alt.clearInterval,
  
  delay : (timeout) => {
    return new Promise((resolve, reject) => {
      alt.setTimeout(resolve, timeout);
    });
  },

  promisify: function(start, ended, check = () => true, run = null, delay = 100) {

    return function(...args) {
  
      return new Promise((resolve, reject) => {
  
        start.apply(this, args);
  
        const interval = alt.setInterval(() => {
  
          if(ended.apply(this, args)) {
            alt.clearInterval(interval);
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
          alt.clearInterval(interval);
          resolve(success);
        }
  
      }, delay);
  
    });
  
  }

};

const nativeWrapper = new Proxy({}, {
  
  get: (obj, prop) => {
    
    if(wrapNatives[prop] !== undefined)
      return wrapNatives[prop];
      
    if(natives[prop] !== undefined)
      return natives[prop];
    
    throw new Error(`[esx] native ${prop} does not exists`);
  }

});

// Instanciate ESX
const esx = new ESX({
  platform: 'altv',
  logWrapper,
  eventWrapper,
  flowControlWrapper,
  nativeWrapper,
  Webview
});

// Forward events
alt.on('connectionComplete', () => esx.emit('player.connected'));

// Initialize ESX
esx.init();

esx.emit('player.spawn');
esx.emitServer('player.spawn');
