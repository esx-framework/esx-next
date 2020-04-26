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
      
      esx.on('player.spawn', () => {

        const idx             = this.pedModelHashes.indexOf(toUnsigned(esx.natives.getEntityModel(esx.natives.playerPedId()))) || 0;
        const isFreeModeModel = config.pedModels[idx].match(/mp_(m|f)_freemode_01/) !== null;
  
        const menu = esx.modules.menu.create('character_editor', {
          title: 'Character',
          items: [
            {name: 'model',       type: 'slider', label: `Model (${idx})`,     value: idx, min: 0, max: this.pedModelHashes.length - 1},
            {name: 'face.mother', type: 'slider', label: `Face - mother (0)`,  value: 0,   min: 0, max: 45, visible: isFreeModeModel},
            {name: 'face.father', type: 'slider', label: `Face - father (0)`,  value: 0,   min: 0, max: 45, visible: isFreeModeModel},
            {name: 'submit',      type: 'button', label: 'Submit'}
          ]
        });
  
        menu.on('ready', () => {
  
        });
  
        menu.on('item.change', (item, prop, val, index) => {
          
          if(item.name === 'model' && prop === 'value') {
            
            const isFreeModeModel = config.pedModels[val].match(/mp_(m|f)_freemode_01/) !== null;
            const model           = this.pedModelHashes[val];
            item.label            = `Model (${val})`;

            menu.items.find(e => e.name === 'face.mother').visible = isFreeModeModel;
            menu.items.find(e => e.name === 'face.father').visible = isFreeModeModel;

            if(this.modelChangeTimeout !== null)
              esx.clearTimeout(this.modelChangeTimeout);
            
            this.modelChangeTimeout = esx.setTimeout(() => {
  
              esx.emitServer('charactereditor.model.set', model);
  
            }, 300);
  
          }
  
          if(item.name === 'face.father') {
            item.label = `Face - father (${val})`;
          }
  
          if(item.name === 'face.mother') {
            item.label = `Face - mother (${val})`;
          }
  
        });
  
        menu.on('item.click', (item, index) => {
          
          if(item.name === 'submit') {
            menu.destroy();
          }
  
        });

      });

      resolve(this);
      
    });

  }

};