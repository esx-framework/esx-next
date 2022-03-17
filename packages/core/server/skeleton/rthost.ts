/*
handler(...resolveDecoratedParams<NET_DECL_ARGS>(target, memberName, {
                "GET_PLAYER": new Player(src),
                "GET_PAYLOAD": payload,
                "GET_SOURCE": src
            }))
 */
import {getMeta} from "./meta";
import {
    CtxDecl,
    FailReasons,
    getValidatorKey, HANDLER_ERROR,
    INTERNAL_ARGS,
    NET_DECL_ARGS, NO_FAIL,
    VALIDATOR_FAILED,
    ValidatorSigs
} from "./constants";
import {chainedSwitch} from "../utils";
import {Player} from "../classes/player";
import {PlayerPermissionManager} from "../classes/permmgr";
import {EventContext} from "../decorators";
import {CommandContext} from "../decorators/command.decorator";
import {resolveDecoratedParams} from "./param.resolver";

interface ContextCallResult<T> {
    reachedEnd: boolean,
    reason: FailReasons,
    result: T
}

export async function callInCtx<T = never>(target: any, prop: string, cx: CtxDecl): Promise<ContextCallResult<T>> {
    const handlerRef = target[prop]
    const meta = getMeta<NET_DECL_ARGS[]>(target, prop, INTERNAL_ARGS)
    const ply = new Player(cx.getSource())
    const permMgr = new PlayerPermissionManager(ply)
    for (const [argIdx, argDecl] of Object.entries(meta)) {
        const validatorArg = getValidatorKey(argDecl)
        const validatorFn = getMeta<ValidatorSigs>(target, prop, validatorArg) || ((cx: CtxDecl, ...data: unknown[]) => true)
        const toInspect = chainedSwitch<typeof validatorArg, any>(validatorArg)
            .inspect("PAYLOAD_VALIDATOR", () => (<EventContext>cx).getPayload())
            .inspect("SRC_VALIDATOR", () => cx.getSource())
            .inspect("PLAYER_VALIDATOR", () => ply)
            .inspect("PERM_VALIDATOR", () => permMgr)
            .inspect("ARG_VALIDATOR", () => (<CommandContext>cx).getArgs())
            .inspect("RAW_CMD_VALIDATOR", () => (<CommandContext>cx).getRawCmd())
        const proceed = validatorFn(cx, toInspect)
        if (!proceed) {
            return {reachedEnd: false, reason: VALIDATOR_FAILED, result: undefined}
        }

    }
    const args = resolveDecoratedParams<NET_DECL_ARGS>(target, prop, {
        "GET_PLAYER": ply,
        "GET_PAYLOAD": (<EventContext>cx).getPayload(),
        "GET_SOURCE": cx.getSource(),
        "GET_PERMS": permMgr,
        "GET_ARGS": (<CommandContext>cx).getArgs(),
        "GET_RAW_CMD": (<CommandContext>cx).getRawCmd()
    })
    try {
        const ret = await handlerRef(...args)
        return {reachedEnd: true, reason: NO_FAIL, result: ret}
    } catch (err) {
        return {reachedEnd: false, reason: HANDLER_ERROR, result: err}
    }

}