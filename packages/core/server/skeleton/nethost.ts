/*
handler(...resolveDecoratedParams<NET_DECL_ARGS>(target, memberName, {
                "GET_PLAYER": new Player(src),
                "GET_PAYLOAD": payload,
                "GET_SOURCE": src
            }))
 */
import {getMeta} from "./meta";
import {INTERNAL_ARGS, NET_DECL_ARGS} from "./constants";

export function runNetPipeline(target: any, prop: string, eventName: string, payload: any, src: number) {
    const handlerRef = target[prop]
    const meta = getMeta<NET_DECL_ARGS[]>(target, prop, INTERNAL_ARGS)
    
}