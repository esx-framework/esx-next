import {setConfig} from "./server";

export * from "./decorators"
export * from "./classes/reflector"
import {Player} from "./classes/player"
import {Identifiers, ORIG_CLASS_NAME} from "./skeleton/constants";
import {registerSingleton} from "./skeleton/singletonloader";
import {TLogLevelName} from "tslog";

export const PlayerManager = Player
export interface Config {
    /**
     * The identifier type to be used when doing anything related to user identity (defaults to license)
     */
    preferredIdent: Identifiers,
    /**
     * The minimum log level to use when performing internal logging (defaults to debug)
     */
    minLogLevel: TLogLevelName
}


export const ESX = {
    configure: (cnf: Partial<Config>) => setConfig(cnf),
    withSingletons: (singletons: any[]) => singletons.forEach(sing => {
        const name = sing[ORIG_CLASS_NAME]
        registerSingleton(name, sing)
    }),
}