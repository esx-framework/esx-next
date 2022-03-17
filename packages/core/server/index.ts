import {setConfig} from "./server";

export * from "./decorators"
export * from "./classes/reflector"
import {Player} from "./classes/player"
import {Identifiers} from "./skeleton/constants";

exports.PlayerManager = Player

export interface Config {
preferredIdent: Identifiers
}

export const ESX = {configure: (cnf: Partial<Config>) => setConfig(cnf)}