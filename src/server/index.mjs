import config        from '../config.json';
import EventEmitter  from 'eventemitter3';
import ESXModules    from '../modules/index.server';
import i18next       from 'i18next';
import * as locales  from '../shared/locales';

export default class ESX extends EventEmitter {

  constructor({
    platform,
    logWrapper,
    eventWrapper,
    flowControlWrapper,
    getPlayerIdentifiers
  }) {

    super();

    this.platform              = platform;
    this.modules               = {};
    this.logWrapper            = logWrapper;
    this.eventWrapper          = eventWrapper;
    this.flowControlWrapper    = flowControlWrapper;
    this._getPlayerIdentifiers = getPlayerIdentifiers;

    this.players = [];

    process.on('unhandledRejection', (reason, promise) => {
      this.log('Unhandled Rejection at:', reason.stack || reason)
    });

  }

  log(...args) {
    return this.logWrapper.log(...args);
  }

  logError(...args) {
    return this.logWrapper.logError(...args);
  }

  $on(name, cb) {
    return this.eventWrapper.on(name, cb);
  }

  $off(name, cb) {
    return this.eventWrapper.off(name, cb);
  }

  $emit(name, ...args) {
    return this.eventWrapper.emit(name, ...args);
  }

  onClient(name, cb) {
    return this.eventWrapper.onClient(name, cb);
  }

  offClient(name, cb) {
    return this.eventWrapper.offClient(name, cb);
  }

  emitClient(player, name, ...args) {
    return this.eventWrapper.emitClient(player, name, ...args);
  }

  setTimeout(cb, ms) {
    return this.flowControlWrapper.setTimeout(cb, ms);
  }

  clearTimeout(cb) {
    return this.flowControlWrapper.clearTimeout(cb);
  }

  setInterval(cb, ms) {
    return this.flowControlWrapper.setInterval(cb, ms);
  }

  clearInterval(cb) {
    return this.flowControlWrapper.clearInterval(cb);
  }

  delay(timeout) {
    return this.flowControlWrapper.delay(timeout);
  }

  promisify(start, ended, check = () => true, run = null, delay = 100) {
    return this.flowControlWrapper.promisify(start, ended, check, run, delay);
  }

  waitFor(check, timeout = -1, delay = 100) {
    return this.flowControlWrapper.waitFor(check, timeout, delay);
  }

  init() {
    
    return new Promise((resolve, reject) => {
      
      i18next.init({ lng: config.locale, debug: false, resources: locales }, async (err, t) => {
        
        this.i18n = i18next;
        
        this.log(i18next.t('init'));

        this.on('player.connect', (player) => {
          
          this.log(`[esx] Player "${player.name}" has connected with player id ${player.id}`);
          
          const idx = this.players.indexOf(player);

          if(idx === -1)
            this.players.push(player);

        });

        this.on('player.disconnect', (player) => {

          const idx = this.players.indexOf(player);

          if(idx !== -1)
            this.players.slice(idx, 1);

        });

        for(let i=0; i<ESXModules.length; i++) {

          const mod = ESXModules[i];

          this.log(`[esx] Loading module => ${mod.name}`);

          const serverClass      = mod.default;
          const server           = new serverClass(this);
          this.modules[mod.name] = await server.init(this);

        }

        if(this.platform === 'fivem')
          await this.delay(1000);  // Wait for players to 'register'

        this.emit('ready:before');
        this.emit('ready');

        resolve();

      });
    });
  }

  getPlayerIdentifiers(player) {
    return this._getPlayerIdentifiers(player);
  }

};
