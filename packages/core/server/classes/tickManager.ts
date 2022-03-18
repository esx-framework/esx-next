export class TickManager {
    private tickId: number
    private running = false
    private onFirstFn: (cx: TickManager) => void
    private state = new Map<string, any>()
    constructor(private readonly fn: (cx: TickManager, isFirst: boolean) => void) {}
    public start() {
        this.running = true
        let ran = false
        let wasFirst = false
        this.tickId = setTick(() => {
            if (!ran) {
                this.onFirstFn(this)
                ran = true
                wasFirst = true
            } else {
                wasFirst = false
            }
            this.fn(this, wasFirst)
        })
        return this.tickId
    }

    public stop() {
        this.running = false
        clearTick(this.tickId)
        return this
    }
    public isRunning() {
        return this.running
    }

    public onFirst(fn: (cx: TickManager) => void) {
        this.onFirstFn = fn
    }
    public setState(key: string, value: any) {
        this.state.set(key, value)
    }

    public getState<T>(key: string): T | undefined {
        return this.state.get(key)
    }
}