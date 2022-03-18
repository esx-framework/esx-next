import {attachMeta, getMeta} from "../skeleton/meta";
import {
    CTX_INTERVAL,
    CTX_TICK,
    GET_INTERVAL_MGR,
    GET_TICK_MGR,
    INTERNAL_ARGS, INTERVAL_HANDLER,
    TICK_HANDLER,
    TickArgs
} from "../skeleton/constants";
import {TickManager} from "../classes/tickManager";
import {IntervalManager} from "../classes/intervalManager";
import {createContextDescriptor} from "../utils";

//not using callInCtx from rthost here because performance matters
/**
 * Decorator to execute a method every tick
 * @param onFirst function to execute on the first tick cycle
 */
export const Tick = (onFirst?: (tickContext: TickManager) => void) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        const tickFn = target[memberName]

        const args = getMeta<TickArgs[]>(target, memberName, INTERNAL_ARGS) //get advantage of decorator resolution order (param decorators are resolved before the method decorators)
        const argMap: any[] = []

        const tick = new TickManager((cx) => {
            tickFn(...cx.getState<any[]>("ARGS"))
        })
        for (const [k, v] of Object.entries(args)) {
            if (v == GET_TICK_MGR) {
                argMap[(<any>k)] = tick
            } else {
                argMap[(<any>k)] = undefined
            }
        }

        tick.setState("ARGS", argMap)
        if (onFirst) {
            tick.onFirst(onFirst)
        }
        tick.start()
        attachMeta(target, memberName, TICK_HANDLER, tick)
    }
}


/**
 * Decorator to get the tick wrapper (`TickManager`) of the current method
 */
export const TickMgr = () => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_TICK_MGR
        attachMeta(target, propKey, INTERNAL_ARGS, map)
    }
}
/**
 * Decorator to run a method in an interval
 * @param interval interval in miliseconds
 * @param onFirst function to execute on the first interval cycle
 */
export const Interval = (interval: number, onFirst?: (intervalContext: IntervalManager) => void) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        const intervalFn = target[memberName]

        const args = getMeta<TickArgs[]>(target, memberName, INTERNAL_ARGS)
        const argMap: any[] = []

        const intervalMGr = new IntervalManager((cx) => {
            intervalFn(...cx.getState<any[]>("ARGS"))
        }, interval)

        for (const [k, v] of Object.entries(args)) {
            if (v == GET_INTERVAL_MGR) {
                argMap[(<any>k)] = intervalMGr
            } else {
                argMap[(<any>k)] = undefined
            }
        }

        intervalMGr.setState("ARGS", argMap)
        if (onFirst) {
            intervalMGr.onFirst(onFirst)
        }
        intervalMGr.start()
        attachMeta(target, memberName, INTERVAL_HANDLER, interval)
    }
}

/**
 * Decorator to get the interval wrapper (`IntervalManager`) of the current method
 * @constructor
 */
export const IntervalMgr = () => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_INTERVAL_MGR
        attachMeta(target, propKey, INTERNAL_ARGS, map)
    }
}

