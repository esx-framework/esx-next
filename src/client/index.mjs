import EventEmitter from 'eventemitter3';
import ESXModules   from '../modules';

export default class ESX extends EventEmitter {

  constructor({
    platform,
    logWrapper,
    eventWrapper,
    flowControlWrapper,
    nativeWrapper
  }) {

    super();

    this.platform           = platform;
    this.modules            = {};
    this.logWrapper         = logWrapper;
    this.eventWrapper       = eventWrapper;
    this.flowControlWrapper = flowControlWrapper;
    this.natives            = nativeWrapper;

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

    this.log('[esx] init client');

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
      this.log('[esx] load ' + mod.name);
      
      const clientClass      = mod.server;
      const client           = new clientClass(this);
      this.modules[mod.name] = await client.init(this);

    }

    this.emit('ready:before');
    this.emit('ready');
  }

};