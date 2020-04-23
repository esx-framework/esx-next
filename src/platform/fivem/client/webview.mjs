import EventEmitter from 'eventemitter3';

class WebviewFrame extends EventEmitter {

  constructor(parent, name, url, visible) {

    super();

    this.parent    = parent;
    this.name      = name;
    this.url       = url;
    this.visible   = visible;
    this.destroyed = false;

    global.SendNuiMessage(JSON.stringify({action: 'create_frame', name, url, visible}));

  }

  destroy() {
    this.destroyed = true;
    global.SendNuiMessage(JSON.stringify({action: 'destroy_frame', name: this.name}));
  } 

  show() {
    this.visible = true;
    global.SendNuiMessage(JSON.stringify({action: 'show_frame', name: this.name}));
  }

  hide() {
    this.visible = false;
    global.SendNuiMessage(JSON.stringify({action: 'hide_frame', name: this.name}));
  }

  focus(cursor = false) {

    for(let name in this.parent.frames)
      this.parent.frames[name].focused = false;

    this.focused = true;

    global.SendNuiMessage(JSON.stringify({action: 'focus_frame', name: this.name}));

    global.SetNuiFocus(true, cursor);
  }

}

export default class Webview extends EventEmitter {

  constructor(esx) {

    super();

    this.esx         = esx;
    this.frames      = {};
    this._ready      = false;
    this.cursorState = 0;

    global.RegisterNuiCallbackType('webview.ready');
    
    global.on('__cfx_nui:webview.ready', (data, cb) => {
      this._ready = true
      cb('');
    });

  }

  createFrame(name, url, visible = true) {
    
    const frame       = new WebviewFrame(this, name, url, visible);
    this.frames[name] = frame;
    
    return frame;
  }

  unfocus() {

    global.SetNuiFocus(false, false);

  }

  ready() {
    return this.esx.waitFor(() => this._ready);
  }

}
