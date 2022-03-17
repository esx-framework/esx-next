import {setConfig} from "./server";

export * from "./decorators"
export * from "./classes/reflector"
import {Player} from "./classes/player"
import {Identifiers} from "./skeleton/constants";

exports.PlayerManager = Player

export interface Config {
    /**
     * The identifier type to be used when doing anything related to user identity (defaults to license)
     */
    preferredIdent: Identifiers
}

export const ESX = {configure: (cnf: Partial<Config>) => setConfig(cnf)}