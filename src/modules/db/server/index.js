import config   from '../config.json';
import mongoose from 'mongoose'

export const name = 'db';

export default class DB {

  constructor(esx) {

    this.db = null;
    
  }

  init(esx) {

    return new Promise((resolve, reject) => {
      
      this.db = mongoose.connection;
      
      this.db.on('error', (err) => reject(err));

      this.db.once('open', () => {

        esx.log('[esx] connected to database');

        resolve(this);
      });

      mongoose.connect(config.connection, {useNewUrlParser: true, useUnifiedTopology: true});

    });

  }

};