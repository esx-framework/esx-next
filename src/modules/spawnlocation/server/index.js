import config from '../config.json';

export default class SpawnLocation {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise((resolve, reject) => {

      esx.on('ready', () => {
        esx.players.forEach(e => e.position = config.location);
      });

      esx.onClient('player.spawn', (player) => {
        player.position = config.location;
      });

      resolve(this);
  
    });

  }

};