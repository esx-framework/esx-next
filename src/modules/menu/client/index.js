import EventEmitter from 'eventemitter3';

export const name = 'menu';

const menus = [];

class Menu extends EventEmitter {

  constructor(esx, name, data, focus = true) {

    super();

    this.esx = esx;
    
    this.name  = name;
    this.float = data.float || 'top|left';
    this.title = data.title || 'Untitled ESX Menu';
    this.items = [];

    const _items = data.items || {};

    for(let i=0; i<_items.length; i++) {

      ((i) => {

        _items[i].visible = _items[i].visible == undefined ? true : _items[i].visible;

        switch(this.items.type) {

          case 'slider' : {
            
            _items[i].min = _items[i].min == undefined ? 0   : _items[i].min;
            _items[i].max = _items[i].max == undefined ? 100 : _items[i].max;
            
            break;
          }

          default: break;
        }

        this.items[i] = new Proxy(_items[i], {

          get: (obj, prop) => {
            return obj[prop];
          },

          set: (obj, prop, val) => {
            obj[prop] = val;
            this.frame.postMessage({action: 'set_item', index: i, prop, val});
            return true;
          },

          has: (obj, prop) => {
            return obj[prop] !== undefined;
          },

          ownKeys: (obj) => {
            return Object.keys(obj);
          }

        });

      })(i);

    }
    
    this.frame = this.esx.webview.createLocalFrame('menu_' + name, 'menu/index.html');

    this.frame.on('message', (msg) => {

      switch(msg.action) {

        case 'ready' : {
          this.emit('internal:ready');
          break;
        }

        case 'item.change' : {
          this.emit('internal:item.change', msg.prop, msg.val, msg.index);
          break;
        }

        case 'item.click' : {
          this.emit('internal:item.click', msg.index);
          break;
        }

        default: break;

      }

    });

    this.on('internal:ready', () => {

      this.frame.postMessage({action: 'set', data: {
        float: this.float,
        title: this.title,
        items: this.items,
      }});

      if(focus)
        this.focus();

      this.emit('ready');

    });

    this.on('internal:item.change', (prop, val, index) => {

      const prev = {..._items[index]};

      for(let k in data)
        _items[index][k] = data[k];

      this.emit('item.change', this.items[index], prop, val, index);

    });
    
    this.on('internal:item.click', (index) => {
      this.emit('item.click', this.items[index], index);
    });

    menus.push(this);
  }

  focus() {
    this.frame.focus(true);
  }

  destroy() {
    
    this.frame.destroy();

    const idx = menus.indexOf(this);

    if(idx !== -1)
      menus.splice(idx, 1);

    if(menus.length === 0)
      this.frame.parent.unfocus();
    else
      menus[menus.length - 1].focus();
  }

} 

export default class MenuManager {

  constructor(esx) {

    this.esx = esx;

  }

  create(name, data = {}, focus = true) {

    return new Menu(this.esx, name, data, focus);

  }
  
  init(esx) {

    return new Promise(async (resolve, reject) => {
      
      await esx.webview.ready();

      resolve(this);
      
    });

  }

};