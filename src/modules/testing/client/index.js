export default class Testing {

  constructor(esx) {

  }
  
  init(esx) {

    return new Promise(async (resolve, reject) => {
      
      await esx.webview.ready();

      esx.log('[esx] webview ready');

      const frame = esx.webview.createFrame('gizz', 'https://gizz.co');

      frame.focus(true);

      resolve(this);
      
    });

  }

};