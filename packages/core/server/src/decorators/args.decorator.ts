import {attachMeta, getMeta} from "../skeleton/meta";
import {
    GET_PAYLOAD_DECL_ARG, GET_PERM_DECL_ARG,
    GET_PLAYER_DECL_ARG,
    GET_SOURCE_DECL_ARG,
    INTERNAL_ARGS,
    PAYLOAD_VALIDATOR,
    PayloadValidatorSig, PERM_VALIDATOR,
    PermValidatorSig,
    PLAYER_VALIDATOR,
    PlayerValidatorSig,
    SourceValidatorSig,
    SRC_VALIDATOR
} from "../skeleton/constants";
import {getArgTypes} from "../utils";

/**
 * Decorator to get/validate the payload of an RPC/Net event
 */
export const Payload = (validatorFn?: PayloadValidatorSig | false) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_PAYLOAD_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (typeof validatorFn == "function") {
            attachMeta(target, propKey, PAYLOAD_VALIDATOR, validatorFn)
        } else if (typeof validatorFn !== "boolean") {
            //automatic validation
            const dto = (getArgTypes(target, propKey) || [])[idx]
            attachMeta(target, propKey, PAYLOAD_VALIDATOR, dto)
        }
    }
}

/**
 * Decorator to get/validate the source of an RPC/Net event
 */
export const Source = (validatorFn?: SourceValidatorSig) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_SOURCE_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (validatorFn) {
            attachMeta(target, propKey, SRC_VALIDATOR, validatorFn)
        }
    }
}


/**
 * Decorator to get/validate the calling player of an RPC/Net event
 */
export const Player = (validatorFn?: PlayerValidatorSig) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_PLAYER_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (validatorFn) {
            attachMeta(target, propKey, PLAYER_VALIDATOR, validatorFn)
        }
    }
}
/**
 * Decorator to get/validate the permissions of th calling player (shorthand for calling `player.getPermManager()...` in the Player decorator)
 * @param validatorFn
 * @constructor
 */
export const Permission = (validatorFn?: PermValidatorSig) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_PERM_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (validatorFn) {
            attachMeta(target, propKey, PERM_VALIDATOR, validatorFn)
        }
    }
}