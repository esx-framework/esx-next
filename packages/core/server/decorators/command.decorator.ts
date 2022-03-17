import {
    ARG_VALIDATOR,
    ArgValidatorSig,
    GET_ARGS_DECL_ARG, GET_RAW_CMD_DECL_ARG,
    INTERNAL_ARGS,
    PlayerValidatorSig, RAW_CMD_VALIDATOR, RawCmdValidatorSig, TODO
} from "../skeleton/constants";
import {Player} from "../classes/player";
import {attachMeta, getMeta} from "../skeleton/meta";
import {createChainedFunction} from "@reincarnatedjesus/f-chain";



type CommandDelegate = {args: string[], rawCmd: string, src: number}

export const createChain = (src: number, args: string[], rawCmd: string) => createChainedFunction(() => ({src, args, rawCmd}), {
    getArgs: (ctx) => ctx.getRoot<CommandDelegate>().args,
    getRawCmd: (ctx) => ctx.getRoot<CommandDelegate>().rawCmd,
    getSource: (ctx) => ctx.getRoot<CommandDelegate>().src
})()
const mock = createChain(0, [], "")

export type CommandContext = typeof mock;

TODO("Create event ctx type")

export const Command = (name: string, checkAce = true, validatorFn?: PlayerValidatorSig) => {
RegisterCommand(name, (src: number, args: string[], raw: string) => {

}, checkAce)
}


/**
 * Decorator to get/validate the arguments of a command
 */
export const Args = (validatorFn?: ArgValidatorSig) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_ARGS_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (validatorFn) {
            attachMeta(target, propKey, ARG_VALIDATOR, validatorFn)
        }
    }
}

/**
 * Decorator to get/validate the raw command string
 */
export const RawCommand = (validatorFn?: RawCmdValidatorSig) => {
    return (target: Object, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, INTERNAL_ARGS) || []
        map[idx] = GET_RAW_CMD_DECL_ARG
        attachMeta(target, propKey, INTERNAL_ARGS, map)
        if (validatorFn) {
            attachMeta(target, propKey, RAW_CMD_VALIDATOR, validatorFn)
        }
    }
}


