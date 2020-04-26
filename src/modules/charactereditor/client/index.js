import config                from '../config.json';
import { joaat, toUnsigned } from '../../../shared/utils';

export const name = 'charactereditor';

export default class CharacterEditor {

  constructor(esx) {

    this.esx                = esx;
    this.pedModelHashes     = config.pedModels.map(e => joaat(e));
    this.modelChangeTimeout = null;
    this.cam                = null;
    this.data               = {};

  }

  ensureData() {

    const playerPed       = this.esx.natives.playerPedId();
    const idx             = this.pedModelHashes.indexOf(toUnsigned(this.esx.natives.getEntityModel(playerPed))) || 0;
    const isFreeModeModel = config.pedModels[idx].match(/mp_(m|f)_freemode_01/) !== null;

    let headBlendData = null;

    if(isFreeModeModel)
      headBlendData = this.esx.natives.getPedHeadBlendData(playerPed);

    this.data = {
      ...this.data,
      'model'      : this.pedModelHashes[idx],
      'face.mother': isFreeModeModel ? headBlendData[0] : null,
      'face.father': isFreeModeModel ? headBlendData[1] : null,
    };

  }

  async open() {
    await this.openMenu();
    return this.data;
  }

  close() {

  }

  openMenu() {
    
    return new Promise((resolve, reject) => {

      this.ensureData();

      const idx             = this.pedModelHashes.indexOf(this.data['model']);
      const isFreeModeModel = config.pedModels[idx].match(/mp_(m|f)_freemode_01/) !== null;
  
      const menu = this.esx.modules.menu.create('character_editor', {
        title: 'Character',
        items: [
          {name: 'model',     type: 'slider',  label: `Model (${idx})`, value: idx, min: 0, max: this.pedModelHashes.length - 1},
          {name: 'head.menu', type: 'default', label: `Head`, visible: isFreeModeModel},
          {name: 'submit',    type: 'button',  label: 'Submit'}
        ]
      });
  
      menu.on('item.change', (item, prop, val, index) => {
        
        if(prop === 'value' && item.type !== 'button' && !item.name.endsWith('.menu')) {

          if(item.name === 'model')
            this.data[item.name] = this.pedModelHashes[val];
          else
            this.data[item.name] = val;
    
        }

        if(item.name === 'model' && prop === 'value') {
          
          const model           = this.pedModelHashes[val];
          item.label            = `Model (${val})`;
          const isFreeModeModel = config.pedModels[val].match(/mp_(m|f)_freemode_01/) !== null;
          
           menu.items.find(e => e.name === 'head.menu').visible = isFreeModeModel;

          if(this.modelChangeTimeout !== null)
            this.esx.clearTimeout(this.modelChangeTimeout);
          
          this.modelChangeTimeout = this.esx.setTimeout(() => {
  
            this.esx.emitServer('charactereditor.model.set', model);
  
          }, 300);
  
        }
  
      });
  
      menu.on('item.click', async (item, index) => {
        
        switch(item.name) {

          case 'head.menu' : {
            this.openHeadMenu();
            break;
          }

          case 'submit' : {
            menu.destroy();
            resolve();
            break
          }

          default: break;
        }
  
      });  

    });
  }

  openHeadMenu() {

    return new Promise((resolve, reject) => {

      this.ensureData();

      const idx             = this.pedModelHashes.indexOf(this.data.model);
      const isFreeModeModel = config.pedModels[idx].match(/mp_(m|f)_freemode_01/) !== null;
  
      const menu = this.esx.modules.menu.create('character_editor.head', {
        title: 'Character - Head',
        items: [
          {name: 'face.mother', type: 'slider', label: `Face - mother (0)`,  value: this.data['face.mother'],   min: 0, max: 45, visible: isFreeModeModel},
          {name: 'face.father', type: 'slider', label: `Face - father (0)`,  value: this.data['face.father'],   min: 0, max: 45, visible: isFreeModeModel},
          {name: 'submit',      type: 'button', label: 'Submit'}
        ]
      });
  
      menu.on('ready', () => {
  
      });
  
      menu.on('item.change', (item, prop, val, index) => {
        
        if(prop === 'value' && item.type !== 'button') {

          if(item.name === 'model')
            this.data[item.name] = this.pedModelHashes[val];
          else
            this.data[item.name] = val;
    
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
          resolve();
        }
  
      });  

    });

  }
  
  init(esx) {

    return new Promise(async (resolve, reject) => {
      
      esx.on('player.spawn', async () => {
        const data = await this.open();
        esx.log(JSON.stringify(data, null, 2));
      });

      resolve(this);
      
    });

  }

};