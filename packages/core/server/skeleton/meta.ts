import {META_KEY} from "./constants";

function ensureMetaBucket(targ: any) {
    targ[META_KEY] = targ[META_KEY] || {}
}

export function attachMeta(to: any, prop: string, key: string, data: any) {
    ensureMetaBucket(to)
    to[META_KEY][prop] = to[META_KEY][prop] || {}
    to[META_KEY][prop][key] = data
}
export function getMeta<T>(from: any, prop: string, key: string): T | undefined {
    try {
        return from[META_KEY][prop][key]
    } catch (err) {
        return undefined
    }
}