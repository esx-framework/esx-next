import { IClientModule } from '@framework/client/IModule';

class OneModule implements IClientModule {

  name: 'one'

  constructor() {

    // TODO register module to framework
    console.log('constructor');
  }

  init() : Promise<boolean> {
    
    return new Promise((resolve) => {
      console.log('init OneModule');
      resolve(true);
    });

  }

}

export default new OneModule();
