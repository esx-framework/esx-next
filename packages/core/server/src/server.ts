import {Testing} from "./testing/manager";
import {Config} from "./index";
import {DEFAULT_CONFIG} from "./skeleton/constants";
import {Logger} from "./classes/logger";
import "reflect-metadata"

Testing.stub()
Testing.defStub("GetNumPlayerIdentifiers", () => 0)
let config: Partial<Config> = {};
export const INTERNAL_LOGGER = new Logger("ESX::CORE", getConfigField("minLogLevel"), true)

const changeListeners: Function[] = []

export const onConfigChange = (fun: Function) => changeListeners.push(fun)



export function setConfig(cf: Partial<Config>) {
        INTERNAL_LOGGER.setLevel(getConfigField("minLogLevel"))
        config = cf
}



export function getConfigField<T extends keyof Config>(key: T): Config[T] {
    // @ts-ignore
    return config[key] || DEFAULT_CONFIG[key]
}