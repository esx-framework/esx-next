export class Player {
    /**
     *
     * @param src Client player id
     */
    constructor(private readonly src: number) {}


    /**
     * Set a state on the player
     * @param key The state key
     * @param value The state value
     * @param replicate Whether to replicate the state to the client (use carefully, defaults to false)
     * @return A getter and a setter function for the state
     */
    public useState<T>(key: string, value: T, replicate: boolean = false): [() => T, (val: T) => void] {
        const {state} = global.Player(this.src)
        state.set(key, value, replicate)
        return [() => state[key], (val: T) => state.set(key, val, replicate)]
    }

    /**
     * Subscribe to player state changes
     * @param key A state key
     * @param handlerFunc An effect function
     * @return An array of destructor functions for the corresponding states
     */
    public useEffect<T>(key: string | string[], handlerFunc: (newVal: T, key: string, isReplicated: boolean) => void) {
        const keys = Array.isArray(key) ? key : [key]
        const destructors = keys.map(key => AddStateBagChangeHandler(key, `player:${this.src}`, (bagName: string, key: string, value: T, _: unknown, repl: boolean) => handlerFunc(value, key, repl)))
        return destructors.map(cookie => () => RemoveStateBagChangeHandler(cookie))
    }

    /**
     * Get a piece of player state
     * @param key
     */
    public getState<T>(key: string): T | null {
        const {state} = global.Player(this.src)
        return state[key] as T
    }

    public pedId() {
        return GetPlayerPed(this.src)
    }
    public serverId() {
        return GetPlayerServerId(this.src)
    }
    public kill() {
        SetEntityHealth(this.pedId(), 0)
    }
}