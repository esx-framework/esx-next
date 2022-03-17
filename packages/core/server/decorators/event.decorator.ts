import {NET_DECL_ARGS} from "../constants";
import {Player} from "../classes/player";
import {resolveDecoratedParams} from "../param.resolver";

/**
 * Decorator to mark a method as a net event listener
 * @param eventName
 * 
 * 
 */

export const OnNet = (eventName: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        const handler = target[memberName]
        onNet(eventName, (...payload: any[]) => {
            const src = source
            handler(...resolveDecoratedParams<NET_DECL_ARGS>(target, memberName, {
                "GET_PLAYER": new Player(src),
                "GET_PAYLOAD": payload,
                "GET_SOURCE": src
            }))
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
        const handler = target[memberName]
        on(eventName, handler)
    }
}

