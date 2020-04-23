import config from '../config.json';

export default class DefaultModel {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise((resolve, reject) => {

      esx.on('player.spawn', (player) => {
        player.model = config.model;
      });

      resolve(this);
  
    });

  }

};