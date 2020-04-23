import { joaat } from '../shared/utils';

export default class ESXPlayer {
  
  get id()       { return this.wrapper.getId();       }
  get name()     { return this.wrapper.getName();     }
  get model()    { return this.wrapper.getModel();    }
  get position() { return this.wrapper.getPosition(); }
  get rotation() { return this.wrapper.getRotation(); }
  get heading()  { return this.wrapper.getHeading();    }

  set model(v) {

    if(typeof v === 'string')
      v = joaat(v);

    this.wrapper.setModel(v);
  }
  
  set position(v) { this.wrapper.setPosition(v); }
  set rotation(v) { this.wrapper.setRotation(v); }
  set heading(v)  { this.wrapper.setHeading (v); }

  constructor(esx, wrapper) {
    this.esx     = esx;
    this.wrapper = wrapper;
  }

  get() {
    return this.wrapper.get();
  }

  emit(name, ...args) {
    this.esx.emitClient(this, name, ...args);
  }

}