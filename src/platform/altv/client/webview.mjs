import * as alt     from 'alt';
import EventEmitter from 'eventemitter3';

class WebviewFrame extends EventEmitter {

  constructor(parent, name, url, visible) {

    super();

    this.esx       = parent.esx;
    this.parent    = parent;
    this.name      = name;
    this.url       = url;
    this.visible   = visible;
    this.destroyed = false;
    
    this.parent.altWebview.emit('window.message', {action: 'create_frame', name, url, visible});

  }

  destroy() {
    this.destroyed = true;
    this.parent.altWebview.emit('window.message', {action: 'destroy_frame', name: this.name});
  } 

  show() {
    this.visible = true;
    this.parent.altWebview.emit('window.message', {action: 'show_frame', name: this.name});
  }

  hide() {
    this.visible = false;
    this.parent.altWebview.emit('window.message', {action: 'hide_frame', name: this.name});
  }

  focus(cursor = false) {

    for(let name in this.parent.frames)
      this.parent.frames[name].focused = false;

    this.focused = true;

    this.parent.altWebview.emit('window.message', {action: 'focus_frame', name: this.name});

    this.parent.altWebview.focus();

    if(cursor) {
      this.parent.altWebview.cursorState++;
      alt.showCursor(true);
    }

    alt.toggleGameControls(false);
  }

  postMessage(msg) {
    this.parent.emitFrameMessage(this.name, msg);
  }

}

export default class Webview extends EventEmitter {

  constructor(esx) {

    super();

    this.altWebview  = new alt.WebView('http://resource/html/index.html', false);
    this.esx         = esx;
    this.frames      = {};
    this._ready      = false;
    this.cursorState = 0;

    this.altWebview.on('webview.ready', () => this._ready = true);

    this.altWebview.on('frame.message', (json) => {
      const {name, msg} = JSON.parse(json);
      this.frames[name].emit('message', msg);
    });

  }

  createFrame(name, url, visible = true) {
    
    const frame       = new WebviewFrame(this, name, url, visible);
    this.frames[name] = frame;
    
    return frame;
  }

  createLocalFrame(name, path, visible = true) {

    const frame       = new WebviewFrame(this, name, 'http://resource/html/' + path, visible);
    this.frames[name] = frame;
    
    return frame;

  }

  unfocus() {

    altWebView.unfocus();

    while(this.cursorState > 0)
      alt.showCursor(false);

    alt.toggleGameControls(true);

  }

  ready() {
    return this.esx.waitFor(() => this._ready);
  }

  emitFrameMessage(name, msg) {
    this.altWebview.emit('window.message', {target: name, data: msg});
  }

}
