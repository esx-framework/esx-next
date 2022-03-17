import {createStub, defineSource, stub} from "../skeleton/stubs";


export abstract class Testing {
    private constructor() {}
    public static defStub = createStub
    public static setSource = defineSource
    public static stub() {
        stub()
    }
    public static emitNetEventWithSource(name: string, source: number, ...payload: any[]) {
        this.setSource(source)
        global.emitNet(name, ...payload)
    }
    public static callRpcWithSource(name: string, source: number, ...payload: any[]) {

    }

}