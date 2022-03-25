import {ArgumentTypes} from "@reincarnatedjesus/f-chain";

export function boundary<T>(fn: () => T | undefined, def: T) {
    try {
        return fn() || def
    } catch (err) {
        return def
    }
}
export function sig(toSer: any) {
    try {
        GetHashKey(toSer)
    } catch (err) {
        if (toSer.toString) {
            return GetHashKey(toSer.toString())
        } else {
            try {
                return GetHashKey(JSON.stringify(toSer))
            } catch (err) {
                try {
                    return GetHashKey(JSON.stringify(Object.entries(toSer)))
                } catch (err) {
                    return toSer
                }
            }
        }
    }
}

export function memo<F extends (...args: any[]) => any>(fn: F): (...args: ArgumentTypes<F>) => ReturnType<F> {
const argsCache: Record<string, any> = {}
    return (...args: any[]) => {
            const serArgs = sig(args.map(arg => sig(arg)))
            return argsCache[serArgs] ?? (() => {
                const computed = fn(...args)
                argsCache[serArgs] = computed
                return computed
            })()
    }
}
//squares a number
export const sqr = memo((num: number) => num * num)
export const degToRad = (degs: number) => degs / (Math.PI / 180)