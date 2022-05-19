/**
 * Class representing a player
 *
 */
import {PlayerPermissionManager} from "./permmgr";
import {Identifiers} from "../skeleton/constants";
import {Augmentable, AugmentableComponent} from "../decorators/augments.decorator";
import {buildObject} from "../skeleton/utils";


@Augmentable("player")
export class Player implements AugmentableComponent {
    public getComponent: <C>(name: string) => C
    private static identifierStore = new Map<number, Map<Identifiers, string>>()
    private readonly permManager = new PlayerPermissionManager(this)
    private readonly idents = new Map<Identifiers, string>()
    constructor(private readonly src: number) {
        const ids = Player.identifierStore.get(src)
        if (ids) {
            this.idents = ids
        } else {
            const strPlayer = src.toString()
            const num = GetNumPlayerIdentifiers(strPlayer)
            for (let i = 0; i < num; i++) {
                const ident = GetPlayerIdentifier(strPlayer, i)
                if (ident.startsWith("discord:")) {
                    this.idents.set("discord", ident)

                } else if (ident.startsWith("steam:")) {
                    this.idents.set("steam", ident)

                } else if (ident.startsWith("license:")) {
                    this.idents.set("license", ident)

                } else if (ident.startsWith("xbl:")) {
                    this.idents.set("xbl", ident)

                } else if (ident.startsWith("ip:")) {
                    this.idents.set("ip", ident)

                } else if (ident.startsWith("live:")) {
                    this.idents.set("live", ident)

                }
            }
            Player.identifierStore.set(src, this.idents)
            //log here
        }
    }


    public getPermManager() {
        return this.permManager
    }

    public getIdentifier(kind: Identifiers) {
        return this.idents.get(kind)
    }

    public getSourceAs<T extends "string" | "number">(as: T): T extends "string" ? string : number {
        //@ts-ignore
        return as === "string" ? this.src.toString() : this.src
    }

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
    public static _identifiersAsObject(player: number) {
        const idents = new Player(player).idents
        return buildObject(Array.from(idents.entries()))
    }
}

export function usePlayerState<T>(player: Player, key: string, val: T, replicate = false) {
    return player.useState<T>(key, val, replicate)
}


export function usePlayerEffect<T>(player: Player, key: string | string[], handlerFunc: (newVal: T, key: string, isReplicated: boolean) => void) {
    return player.useEffect(key, handlerFunc)
}