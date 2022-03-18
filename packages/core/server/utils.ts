import {Context, createChainedFunction} from "@reincarnatedjesus/f-chain";

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
