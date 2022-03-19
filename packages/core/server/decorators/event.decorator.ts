import {CTX_EVENT, EVENT_HANDLER_PROP, NET_EVENT_HANDLER_PROP, ORIG_CLASS_NAME} from "../skeleton/constants";
import {attachMeta} from "../skeleton/meta";
import {callInCtx} from "../skeleton/rthost";
import {createChain, RpcContext} from "./rpc.decorator";
import {INTERNAL_LOGGER} from "../server";


export type EventContext = Omit<RpcContext, "getReqId">



/**
 * Decorator to mark a method as a net event listener
 * @param eventName
 *
 *
 */
export const OnNet = (eventName: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, NET_EVENT_HANDLER_PROP, true)
        INTERNAL_LOGGER.debug(`Event handler for ${eventName} attached to ${target[ORIG_CLASS_NAME] || target.constructor.name}.${memberName}`)
        onNet(eventName, async (...payload: any[]) => {
            const src = global.source
            const cx: EventContext = createChain(src, payload, "EVENT_NO_ID")
            await callInCtx(target, memberName, cx, CTX_EVENT)
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

