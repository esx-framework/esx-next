import config from '../config.json';

export default class SpawnLocation {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise((resolve, reject) => {

      esx.on('ready', () => {
        esx.players.forEach(player => esx.log(JSON.stringify(player.position)));
      });

      esx.on('player.connect', (player) => esx.log(JSON.stringify(player.position)));

      resolve(this);
  
    });

  }

};