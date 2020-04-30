import { IClientModule } from './IModule';

class ESXFramework {

  #modules: Map<string, IClientModule>

  constructor() {
    this.#modules = new Map();
  }

  registerModule(module: IClientModule) {
    
  }

}
