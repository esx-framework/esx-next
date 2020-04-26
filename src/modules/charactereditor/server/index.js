import config from '../config.json';

export const name = 'charactereditor';

export default class CharacterEditor {

  constructor(esx) {

  }

  init(esx) {

    return new Promise(async (resolve, reject) => {

      esx.onClient('charactereditor.model.set', (player, model) => {
        player.model = model;
      });

      resolve(this);
    });

  }

};