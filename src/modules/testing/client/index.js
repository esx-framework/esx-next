export default class Testing {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise(async (resolve, reject) => {

      const menu = esx.modules.menu.create('test', {
        title: 'Test menu',
        items: [
          {name: 'a', label: 'Fufu c\'est ma bro', type: 'slider'},
          {name: 'b', label: 'Fuck that shit',     type: 'check'},
          {name: 'c', label: 'Fuck that shit',     type: 'text'},
          {name: 'd', label: 'Lorem ipsum'},
          {name: 'e', label: 'Submit',             type: 'button'},
        ]
      });

      menu.on('ready', () => {

        menu.items[0].label = 'TEST'; // label changed instantly in webview

      });

      menu.on('item.change', (item, prop, val, index) => {
        
        if(item.name === 'a') {

          item.label = `Dynamic label ${val}`;

        }

      });

      resolve(this);
      
    });

  }

};