import { IServerModule } from '@framework/server/IModule';

export class OneModule implements IServerModule {

  init() : Promise<boolean> {
    
    return new Promise((resolve) => {
      console.log('init OneModule');
      resolve(true);
    });

  }

}