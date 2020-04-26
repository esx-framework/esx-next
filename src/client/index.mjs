import config       from '../config.json';
import EventEmitter from 'eventemitter3';
import ESXModules   from '../modules/index.client';
import i18next      from 'i18next';
import * as locales from '../shared/locales';

export default class ESX extends EventEmitter {

  constructor({
    platform,
    logWrapper,
    eventWrapper,
    flowControlWrapper,
    nativeWrapper,
    Webview
  }) {

    super();

    this.platform           = platform;
    this.modules            = {};
    this.logWrapper         = logWrapper;
    this.eventWrapper       = eventWrapper;
    this.flowControlWrapper = flowControlWrapper;
    this.natives            = nativeWrapper;
    this.webview            = new Webview(this);

  }

  log(...args) {
    return this.logWrapper.log(...args);
  }

  logError(...args) {
    return this.logWrapper.logError(...args);
  }

  $on(name, cb) {

    return this.eventWrapper.on(name, (...args) => {
      this.emit('')
    });

  }

  $off(name, cb) {
    return this.eventWrapper.off(name, cb);
  }

  $emit(name, ...args) {
    return this.eventWrapper.emit(name, ...args);
  }

  onServer(name, cb) {
    return this.eventWrapper.onServer(name, cb);
  }

  offServer(name, cb) {
    return this.eventWrapper.offServer(name, cb);
  }

  emitServer(name, ...args) {
    return this.eventWrapper.emitServer(name, ...args);
  }

  setTimeout(cb, ms) {
    return this.flowControlWrapper.setTimeout(cb, ms);
  }

  clearTimeout(cb, ms) {
    return this.flowControlWrapper.clearTimeout(cb, ms);
  }

  setInterval(cb, ms) {
    return this.flowControlWrapper.setInterval(cb, ms);
  }

  clearInterval(cb, ms) {
    return this.flowControlWrapper.clearInterval(cb, ms);
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

  async init() {
    
    return new Promise((resolve, reject) => {
      
      i18next.init({ lng: config.locale, debug: false, resources: locales }, async (err, t) => {

        this.i18n = i18next;

        this.log(this.i18n.t('init'));

        this.on('player.spawn', () => this.emitServer('player.spawn'));

        this.onServer('model.set', async (model) => {
          
          if(this.platform === 'fivem') {
            this.natives.requestModel(model);
            await this.waitFor(() => this.natives.hasModelLoaded(model));
            this.natives.setPlayerModel(this.natives.playerId(), model);
          }

          this.natives.setPedDefaultComponentVariation(this.natives.playerPedId());
        
        });

        this.onServer('position.set', (position) => {

          if(this.platform === 'fivem') {
            this.natives.requestCollisionAtCoord(position.x, position.y, position.z);
            this.natives.setEntityCoordsNoOffset(this.natives.playerPedId(), position.x, position.y, position.z)
          }

        });

        for(let i=0; i<ESXModules.length; i++) {

          const mod = ESXModules[i]

          this.log(`[esx] loading module => ${mod.name}`);

          const clientClass      = mod.default;
          const client           = new clientClass(this);
          this.modules[mod.name] = await client.init(this);

        }

        this.emit('ready:before');
        this.emit('ready');

        resolve();

      });
    });
  }

};