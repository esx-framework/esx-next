import {createStub, defineSource, stub} from "../skeleton/stubs";
import {INTERNAL_LOGGER} from "../server";


export abstract class Testing {
    private constructor() {}
    public static defStub = createStub
    public static setSource = defineSource
    public static stub() {
        stub()
    }
    public static emitNetEventWithSource(name: string, source: number, ...payload: any[]) {
        INTERNAL_LOGGER.debug(`Emitting mock event ${name} with source: ${source}, payload:`, payload)
        this.setSource(source)
        global.emitNet(name, ...payload)
    }
    public static callRpcWithSource(name: string, source: number, ...payload: any[]) {

    }

}