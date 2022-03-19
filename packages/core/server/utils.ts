import {Context, createChainedFunction} from "@reincarnatedjesus/f-chain";
import {
    ARG_VALIDATOR,
    CTX_CMD,
    CTX_EVENT,
    CTX_INTERVAL,
    CTX_RPC,
    CTX_TICK,
    CtxType,
    ExtraArgs, INJECTION_MARKER,
    NET_DECL_ARGS,
    PAYLOAD_VALIDATOR,
    PERM_VALIDATOR,
    PLAYER_VALIDATOR, PROXY_PROPS,
    RAW_CMD_VALIDATOR, REFLECTOR_DATA,
    SRC_VALIDATOR
} from "./skeleton/constants";
import {getMeta} from "./skeleton/meta";

export const chainedSwitch = <T, F extends unknown>(val: T) => createChainedFunction(() => val, {
    "inspect": (cx, val: T, resFactory: (val: T) => F = (v) => v as F) => {
        if (cx.getRoot<T>() === val) {
            cx.setValue("RET_V", resFactory(val))
        }
    },
    "ok": (cx) => {
        return cx.get<F>("RET_V")
    },
    "inspectIf": (cx: Context, val: T, cond: (val: T) => boolean, resFactory: (val: T) => F = (v) => v as F) => {
        const cd = cx.getRoot<T>()
        if (cond(cd) && cd === val) {
            cx.setValue("RET_V", resFactory(val))
        }
    }
})()

export class ChainedSwitch<T, F extends unknown> {
    constructor(private readonly val: T) {}
    private ret_v: any
    public inspectIf(val: T, cond: (val: T) => boolean, resFactory: (val: T) => F = (v) => v as F) {
        if (cond(this.val) && this.val == val) {
            this.ret_v = resFactory(val)
        }
        return this
    }
    public ok() {
        return this.ret_v
    }
}

/**
 * Function to mock a data type (useful when calling methods with some decorated params)
 */
export const mock = <T>(): T => {
    return null as unknown as T
}


export const isArgGetterOfType = (name: string, type: string, defret = false) => {
    try {
        const [part] = name.split("::")
        return part === type
    } catch (err) {
        return defret
    }
}
export const getArgs = <T extends keyof ExtraArgs>(from: string): ExtraArgs[T] | undefined => {
    try {
        const [_, args] = from.split("::")
        const parsed = JSON.parse(args)
        return parsed
    } catch (err) {
        return undefined
    }
}
export const appendArgs = (to: string, args: any[]) => `${to}::${JSON.stringify(args)}`

export const createContextDescriptor = (typ: CtxType) => ({
    hasPayload: () => typ === CTX_EVENT || typ === CTX_RPC,
    hasSource: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasArgs: () => typ === CTX_CMD,
    hasRawCmd: () => typ === CTX_CMD,
    hasPermManager: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasPlayer: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasIntervalRef: () => typ === CTX_INTERVAL,
    hasTickId: () => typ === CTX_TICK
})
export const metaName = (name: string) => `_META:${name}`

export const generateRpcPair = (name: string, id: string) => ({
    recv: `ESX:RPC:${name}:RECV`,
    uuid: id,
    reply: `ESX:RPC:${name}:REPL:${id}`
})

export const TODO = (text: string) => {
    throw new Error(`TODO: ${text}`)
}

export const getValidatorKey = (args: NET_DECL_ARGS) => {
    switch (args) {
        case "GET_PAYLOAD":
            return PAYLOAD_VALIDATOR
        case "GET_PERMS":
            return PERM_VALIDATOR
        case "GET_SOURCE":
            return SRC_VALIDATOR
        case "GET_PLAYER":
            return PLAYER_VALIDATOR
        case "GET_RAW_CMD":
            return RAW_CMD_VALIDATOR
        case "GET_ARGS":
            return ARG_VALIDATOR
        default:
            return undefined
    }
}

export const mergeArrays = <T extends ReadonlyArray<any>, F extends ReadonlyArray<any>>(target: T, arr: F): Array<T[number] | F[number]> => {
    const merged: any[] = target as any
    for (const [k, v] of Object.entries(arr)) {
        merged[(k as unknown as any)] = v
    }
    return merged as Array<T[number] | F[number]>
}

export const isMarkedForStaticInjection = (target: any, prop: string) => !!getMeta(target, REFLECTOR_DATA, PROXY_PROPS)
export const isProxyAttached = (target: any, prop: string) => typeof target[prop] === "function" ? target[prop].toString().includes(INJECTION_MARKER) : false