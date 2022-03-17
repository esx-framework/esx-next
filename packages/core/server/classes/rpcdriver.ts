interface RPCEvent {
    source: number,
    name: string
    payload: any
}

export class RpcDriver {
    private readonly events = new Map<number, RPCEvent>()

    constructor(name: string) {}

    public removeEvent(source: number) {
        this.events.delete(source)
    }
    public getEvent(source: number) {
        return this.events.get(source)
    }



}