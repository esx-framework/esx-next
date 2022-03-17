import {NET_EVENT_HANDLER_PROP, NET_DECL_ARGS, EVENT_HANDLER_PROP} from "../skeleton/constants";
import {Player} from "../classes/player";
import {resolveDecoratedParams} from "../skeleton/param.resolver";
import {attachMeta} from "../skeleton/meta";
import {runNetPipeline} from "../skeleton/nethost";

/**
 * Decorator to mark a method as a net event listener
 * @param eventName
 *
 *
 */

export const OnNet = (eventName: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, NET_EVENT_HANDLER_PROP, true)
        const handler = target[memberName]
        onNet(eventName, (...payload: any[]) => {
            const src = source
            runNetPipeline(target, memberName, eventName, payload, src)
        })
    }
}

/**
 * Decorator to mark a method as an event listener
 * @param eventName
 *
 *
 */
export const On = (eventName: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, EVENT_HANDLER_PROP, true)
        const handler = target[memberName]
        on(eventName, handler)
    }
}

