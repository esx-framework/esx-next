import {Logger as TSLOG, TLogLevelName} from "tslog";

export class Logger extends TSLOG {
    constructor(name: string, minLevel: TLogLevelName = "debug") {
        super({minLevel, name})
    }
}