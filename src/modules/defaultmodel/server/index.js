import config from '../config.json';

export default class DefaultModel {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise((resolve, reject) => {

      esx.on('ready', () => {
        esx.players.forEach(e => e.model = config.model);
      });

      esx.onClient('player.spawn', (player) => {
        player.model = config.model;
      });

      resolve(this);
  
    });

  }

};