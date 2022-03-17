import {attachMeta, getMeta} from "../meta";
import {GET_PAYLOAD_DECL_ARG, GET_PLAYER_DECL_ARG, GET_SOURCE_DECL_ARG, INTERNAL_ARGS} from "../constants";

/**
 * Decorator to get the payload of an RPC/Net event
 * @constructor
 */
export const Payload = () => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_PAYLOAD_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
    }
}

/**
 * Decorator to get the source of an RPC/Net event
 * @constructor
 */
export const Source = () => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_SOURCE_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
    }
}


/**
 * Decorator to get the calling player of an RPC/Net event
 * @constructor
 */
export const Player = () => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_PLAYER_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
    }
}