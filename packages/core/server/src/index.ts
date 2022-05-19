import {setConfig} from "./server";

import {Player} from "./classes/player"
import {Identifiers, ORIG_CLASS_NAME} from "./skeleton/constants";
import {getSingletonRef, registerSingleton} from "./skeleton/singletonloader";
import {TLogLevelName} from "tslog";
import "reflect-metadata"

export const PlayerManager = Player
export {IntervalManager} from "./classes/intervalManager"
export {TickManager} from "./classes/tickManager"
export {ClassReflector} from "./classes/reflector"
export {PlayerPermissionManager, Principal} from "./classes/permmgr"
export {Logger} from "./classes/logger"
export * from "./decorators/index"

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
        const name = sing[ORIG_CLASS_NAME] || sing.constructor.name
        registerSingleton(name, sing)
    }),
    addSingleton: (singleton: any) => registerSingleton(singleton[ORIG_CLASS_NAME] || singleton.constructor.name, singleton),
    getSingletonRef: <T>(name: string) => getSingletonRef<T>(name)
}