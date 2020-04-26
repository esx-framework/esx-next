import config from '../config.json';

export const name = 'testing';

export default class testing {

  constructor(esx) {

  }

  init(esx) {

    return new Promise(async (resolve, reject) => {
      resolve(this);
    });

  }

};