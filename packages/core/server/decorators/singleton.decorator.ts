import {attachMeta, getMeta} from "../skeleton/meta";
import {
    GET_SINGLETON,
    INTERNAL_ARGS, ORIG_CLASS_NAME, PROXY_PROPS, REFLECTOR_DATA,
    SINGLETON_DATA,
    SINGLETON_REGISTERED
} from "../skeleton/constants";
import {appendArgs} from "../utils";
import {ctxProxy} from "../skeleton/rthost";
import {INTERNAL_LOGGER} from "../server";

export const Singleton = (): any => {
    return (target: any) => class extends target {
        private static readonly ___ESX_SINGLETON_INSTANCE: any
        private readonly __ESX_ORIGNAME = target.name
        constructor(...args: any[]) {
            super(...args);
            if (this.___ESX_SINGLETON_INSTANCE) {
                return this.___ESX_SINGLETON_INSTANCE
            }
            this.___ESX_SINGLETON_INSTANCE = this
            attachMeta(this, SINGLETON_DATA, SINGLETON_REGISTERED, true)
            INTERNAL_LOGGER.debug(`Instantiated singleton class ${this.constructor.name}`)
        }
    }
}

export const Inject = (name: string): ParameterDecorator => {
    return (target: any, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        const args = appendArgs(GET_SINGLETON, [name])
        INTERNAL_LOGGER.debug(`Marking ${name} for injection into ${target.constructor.name}.${propKey} and appending: ${args}`)
        map[idx] = args
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        const attacherMap: any[] = getMeta(target, REFLECTOR_DATA, PROXY_PROPS) || []
        attacherMap.push(propKey)
        attachMeta(target, REFLECTOR_DATA, PROXY_PROPS, attacherMap)
        //ctxProxy(target, propKey)
    }
}

export const Class = (): any => {
    return (target: any) => class extends target {
        private readonly __ESX_ORIGNAME = target.name
        constructor(...args: any[]) {
            super(...args);
            const keys = getMeta<string[]>(this, REFLECTOR_DATA, PROXY_PROPS)
            for (const k of keys) {
                if (typeof this[k] == "function") {
                    INTERNAL_LOGGER.debug(`Proxying member ${k} in ${this[ORIG_CLASS_NAME]}`)
                    ctxProxy(this, k)
                }
            }


        }
    }
}
