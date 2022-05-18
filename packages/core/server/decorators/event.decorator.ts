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
 * Decorator to mark a method as a local event listener
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

/**
 * Decorator to mark a method as a function (callable from the client, similar to events, except the event name is the method's name) <br>
 * **RETURN VALUE IS IGNORED**, use RPC-s for passing data.
 */
export const Function = () => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        const funcName = `ESX:FN:${memberName}`
        attachMeta(target, memberName, NET_EVENT_HANDLER_PROP, true)
        INTERNAL_LOGGER.debug(`Marked method ${memberName} as a net-callable function`)
        onNet(funcName, async (...payload: any[]) => {
            const src = global.source
            const cx: EventContext = createChain(src, payload, "EVENT_NO_ID")
            await callInCtx(target, memberName, cx, CTX_EVENT)
        })
    }
}
