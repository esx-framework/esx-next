import config                from '../config.json';
import { joaat, toUnsigned } from '../../../shared/utils';

export const name = 'charactereditor';

export default class CharacterEditor {

  constructor(esx) {

    this.pedModelHashes     = config.pedModels.map(e => joaat(e));
    this.modelChangeTimeout = null;
    this.cam                = null;

  }
  
  init(esx) {

    return new Promise(async (resolve, reject) => {
      
      const idx = this.pedModelHashes.indexOf(toUnsigned(esx.natives.getEntityModel(esx.natives.playerPedId()))) || 0;

      const menu = esx.modules.menu.create('test', {
        title: 'Character',
        items: [
          {name: 'model',  type: 'slider', label: `Model (${idx})`, value: idx, min: 0, max: this.pedModelHashes.length - 1},
          {name: 'submit', type: 'button', label: 'Submit'}
        ]
      });

      menu.on('ready', () => {


      });

      menu.on('item.change', (item, prop, val, index) => {
        
        if(item.name === 'model' && prop === 'value') {
          
          if(this.modelChangeTimeout !== null)
            esx.clearTimeout(this.modelChangeTimeout);
          
          this.modelChangeTimeout = esx.setTimeout(() => {
            const model = this.pedModelHashes[val];
            item.label  = `Model (${val})`;
            esx.emitServer('charactereditor.model.set', model);
          }, 300);

        }

      });

      menu.on('item.click', (item, index) => {
        
        if(item.name === 'submit') {
          esx.log('submit');
        }

      });

      resolve(this);
      
    });

  }

};