import {Logger as TSLOG, TLogLevelName} from "tslog";
export class Logger extends TSLOG {
    constructor(name: string, minLevel: TLogLevelName = "debug", esxInternal = false) {
        super({ minLevel, name })
    }
    public setLevel(lvl: TLogLevelName) {
        this.setSettings({ minLevel: lvl })
    }
}