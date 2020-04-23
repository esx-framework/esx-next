import config from '../config.json';

export default class SpawnLocation {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise((resolve, reject) => {

      esx.on('ready', () => {
        esx.players.forEach(player => player.position = config.location);
      });

      esx.on('player.spawn', (player) => {
        player.position = config.location;
      });

      resolve(this);
  
    });

  }

};