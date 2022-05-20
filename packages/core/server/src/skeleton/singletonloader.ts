import {getMeta} from "./meta";
import {SINGLETON_DATA, SINGLETON_REGISTERED} from "./constants";
import {INTERNAL_LOGGER} from "../server";

const singletons = new Map<string, any>()


export function registerSingleton(name: string, ref: any) {
    singletons.set(name, new ref())
    INTERNAL_LOGGER.debug(`Registered new singleton: ${name}`)
}

export function getRegisteredSingletons() {
    return Array.from(singletons.entries())
}

export function getSingletonRef<T>(name: string): T | undefined {
    return singletons.get(name)
}


export function isSingletonCreated(name: string) {
    return singletons.has(name)
}


export function isSingleton(target: any)  {
    return getMeta<boolean>(target, SINGLETON_DATA, SINGLETON_REGISTERED) || false
}

