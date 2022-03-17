/**
 * Class representing a player
 *
 */
import {PlayerPermissionManager} from "./permmgr";
import {Identifiers} from "../skeleton/constants";

export class Player {
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


}