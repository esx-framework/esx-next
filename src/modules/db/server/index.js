import config   from '../config.json';
import mongoose from 'mongoose'

export const name = 'db';

export default class DB {

  constructor(esx) {

  }

  init(esx) {


    return new Promise((resolve, reject) => {
      resolve(this);
    });

  }

};