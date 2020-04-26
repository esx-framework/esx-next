import config         from '../config.json';
import mongoose      from 'mongoose'
import { nameClass } from '../../../shared/utils';

export const name = 'db';

export default class DB {

  constructor(esx) {

    this.db     = null;
    this.models = {};
    
  }

  model(name, data = null, cls = null) {

    if(data === null) {
      return this.models[name];
    }

    if(this.models[name] !== undefined) {
      throw new Error(`[esx] db error => Model ${name} is already registered`);
    }

    const schema   = new mongoose.Schema(data);
    const namedCls = nameClass(name, cls);

    schema.loadClass(namedCls);

    this.models[name] = this.db.model(name, schema);

    return this.models[name];
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