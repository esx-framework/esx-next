export class IntervalManager {
    private intervalId: NodeJS.Timer
    private running = false
    private onFirstFn: (cx: IntervalManager) => void
    private state = new Map<string, any>()
    constructor(private readonly fn: (cx: IntervalManager, isFirst: boolean) => void, private interval: number) {}
    public start() {
        this.running = true
        let ran = false
        let wasFirst = false
        this.intervalId = setInterval(() => {
            if (!ran) {
                this.onFirstFn(this)
                ran = true
                wasFirst = true
            } else {
                wasFirst = false
            }
            this.fn(this, wasFirst)
        }, this.interval)
        return this.intervalId
    }
    public changeInterval(interval: number) {
        this.interval = interval
        if (this.running) {
            this.stop()
            this.start()
        }
    }

    public stop() {
        this.running = false
        clearInterval(this.intervalId)
        return this
    }
    public isRunning() {
        return this.running
    }

    public onFirst(fn: (cx: IntervalManager) => void) {
        this.onFirstFn = fn
    }
    public setState(key: string, value: any) {
        this.state.set(key, value)
    }

    public getState<T>(key: string): T | undefined {
        return this.state.get(key)
    }
}