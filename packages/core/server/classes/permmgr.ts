import {Player} from "./player";
import {Identifiers} from "../skeleton/constants";
import {getConfigField} from "../server";
import {Augmentable} from "../decorators/augments.decorator";

import {AugmentableComponent, getComponentSignature} from "../decorators/augments.decorator";
import {getComponentInClassCtx} from "../decorators/augments.decorator";

function constructPrincipalCommand(action: "add" | "revoke", child: Principal, parent: Principal, execute = true) {
    const str = `${action === "add" ? "add_principal" : "remove_principal"} ${child.toString()} ${parent.toString()}`
    if (execute) {
        ExecuteCommand(str)
    }
    return str
}

function constructAceCommand(action: "add" | "revoke", principal: Principal, ace: Principal, allow: boolean, execute = true) {
    const str = `${action === "add" ? "add_ace" : "remove_ace"} ${principal.toString()} "${ace.toString()}" ${allow ? "allow" : "deny"}`
    if (execute) {
        ExecuteCommand(str)
    }
    return str
}

@Augmentable("principal")
class Principal implements AugmentableComponent {
    public getComponent: getComponentSignature
    private readonly fields: Set<string> = new Set<string>()
    constructor() {}


    public addField(field: string) {
        this.fields.add(field)
    }

    public removeField(field: string) {
        this.fields.delete(field)
    }

    public hasField(field: string) {
        return this.fields.has(field)
    }

    public toString() {
        const set: string[] = []
        this.fields.forEach(field => {
            set.push("field")
        })

        return set.join(".")
    }

    /**
     * Will create a Permission from the inputted string
     * @param permString
     */
    public static from(permString: string) {
        const parts = this.fix(permString).split(".")
        const perm = new Principal()
        parts.forEach(val => (perm.addField(val)))
        return perm
    }

    /**
     * Will remove trailing dots
     * @param permString
     */
    public static fix(permString: string) {
        let newString = permString
        if (permString[0] == ".") {
            newString = permString.slice(1)
        }
        if (newString[newString.length - 1] == ".") {
            newString = newString.slice(0, newString.length - 1)
        }
        return newString
    }

    public static everyone() {
        return Principal.from("builtin.everyone")
    }

    public static ident(kind: Identifiers, id: string) {
        return Principal.from(`identifier.${kind}:${id}`)
    }

    public allowAce(ace: Principal) {
        constructAceCommand("add", this, ace, true)
    }

    public denyAce(ace: Principal) {
        constructAceCommand("add", this, ace, false)
    }

    public command(cmdName: string) {
        return Principal.from(`command.${cmdName}`)
    }

    public allowPrincipal(pric: Principal) {
        constructPrincipalCommand("add", this, pric)
    }

    public denyPrincipal(pric: Principal) {
        constructPrincipalCommand("revoke", this, pric)
    }


}


@Augmentable("PlayerPermissionManager")
export class PlayerPermissionManager {
    constructor(private readonly player: Player) {}


    public isPrincipalAllowed(principal: Principal, identKind = getConfigField("preferredIdent")) {
        return IsPrincipalAceAllowed(this.getPrincipalFor(identKind).toString(), principal.toString())
    }

    public isAceAllowed(ace: Principal) {
        return IsPlayerAceAllowed(this.player.getSourceAs("string"), ace.toString())
    }

    public getPrincipalFor(kind: Identifiers) {
        const ident = this.player.getIdentifier(kind)
        return Principal.ident(kind, ident)
    }

}