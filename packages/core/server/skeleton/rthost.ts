import {getMeta} from "./meta";
import {
    CtxDecl, ctxType, CtxType,
    FailReasons,
    getValidatorKey, HANDLER_ERROR,
    INTERNAL_ARGS,
    NET_DECL_ARGS, NO_FAIL, TODO,
    VALIDATOR_FAILED,
    ValidatorSigs
} from "./constants";
import {chainedSwitch} from "../utils";
import {Player} from "../classes/player";
import {PlayerPermissionManager} from "../classes/permmgr";
import {CommandContext} from "../decorators/command.decorator";
import {EventContext} from "../decorators/event.decorator";

interface ContextCallResult<T> {
    reachedEnd: boolean,
    reason: FailReasons,
    result: T
}

export async function callInCtx<T = never>(target: any, prop: string, cx: CtxDecl, execType: CtxType): Promise<ContextCallResult<T>> {
    TODO("Write fail logic if the calls doesnt match the current ctx")
    const callContext = ctxType(execType)
    const handlerRef = target[prop]
    const meta = getMeta<NET_DECL_ARGS[]>(target, prop, INTERNAL_ARGS)
    const ply = new Player(cx.getSource())
    const permMgr = new PlayerPermissionManager(ply)
    const args: any[] = []
    for (const [k, argDecl] of Object.entries(meta)) {
        const validatorArg = getValidatorKey(argDecl)
        const validatorFn = getMeta<ValidatorSigs>(target, prop, validatorArg) || ((cx: CtxDecl, ...data: unknown[]) => true)
        const toInspect = chainedSwitch<typeof validatorArg, any>(validatorArg)
            .inspectIf("PAYLOAD_VALIDATOR", callContext.hasPayload, () => (<EventContext>cx).getPayload())
            .inspectIf("SRC_VALIDATOR", callContext.hasSource, () => cx.getSource())
            .inspectIf("PLAYER_VALIDATOR", callContext.hasPlayer,() => ply)
            .inspectIf("PERM_VALIDATOR", callContext.hasPermManager,() => permMgr)
            .inspectIf("ARG_VALIDATOR", callContext.hasArgs, () => (<CommandContext>cx).getArgs())
            .inspectIf("RAW_CMD_VALIDATOR", callContext.hasRawCmd, () => (<CommandContext>cx).getRawCmd())
        const proceed = validatorFn(cx, toInspect)
        if (!proceed) {
            return {reachedEnd: false, reason: VALIDATOR_FAILED, result: undefined}
        }
        args[(<any>k)] = toInspect
    }

    try {
        const ret = await handlerRef(...args)
        return {reachedEnd: true, reason: NO_FAIL, result: ret}
    } catch (err) {
        TODO!("better error handling")
        return {reachedEnd: false, reason: HANDLER_ERROR, result: err}
    }

}