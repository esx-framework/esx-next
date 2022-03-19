import {getMeta} from "./meta";
import {
    CtxDecl, CtxType,
    FailReasons,
    HANDLER_ERROR,
    INTERNAL_ARGS,
    NET_DECL_ARGS, NO_FAIL, VALIDATOR_FAILED,
    ValidatorSigs, STATIC_DECL_ARGS, GET_SINGLETON, ORIG_CLASS_NAME
} from "./constants";
import {
    chainedSwitch,
    createContextDescriptor,
    getArgs,
    getValidatorKey,
    isArgGetterOfType,
    mergeArrays,
    TODO
} from "../utils";
import {Player} from "../classes/player";
import {PlayerPermissionManager} from "../classes/permmgr";
import {CommandContext} from "../decorators/command.decorator";
import {EventContext} from "../decorators/event.decorator";
import {getSingletonRef} from "./singletonloader";
import {INTERNAL_LOGGER} from "../server";
import {Inject} from "../decorators/singleton.decorator";

interface ContextCallResult<T> {
    reachedEnd: boolean,
    reason: FailReasons,
    result: T
}

export async function callInCtx<T = never>(target: any, prop: string, cx: CtxDecl, execType: CtxType): Promise<ContextCallResult<T>> {
    const callContext = createContextDescriptor(execType)
    const handlerRef = target[prop]
    const meta = getMeta<NET_DECL_ARGS[]>(target, prop, INTERNAL_ARGS) || []
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
            .ok()
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
//function to make users able to call any method with decorated params
export function ctxProxy(target: any, propKey: string) {
    INTERNAL_LOGGER.debug(`Creating proxy for ${propKey} in ${target[ORIG_CLASS_NAME]}`)
    const originalMethod = target[propKey]
    const proxy = ((...args: any[]) => {
        INTERNAL_LOGGER.debug(`Proxy called for ${propKey} in ${target[ORIG_CLASS_NAME]}`)
        const meta = getMeta<STATIC_DECL_ARGS[]>(target, propKey, INTERNAL_ARGS) || []
        const argMap: any[] = []
        for (const [k, v] of Object.entries(meta)) {
            if (isArgGetterOfType(v, GET_SINGLETON, false)) {
                const args = getArgs<typeof GET_SINGLETON>(v)
                INTERNAL_LOGGER.debug(`Args for ${v} is ${args}`)
                if (args[0]) {
                    const singletonName = args[0]
                    const singleton = getSingletonRef(singletonName)
                    if (singleton) {
                        INTERNAL_LOGGER.debug(`Loaded singleton ${singletonName} into arg map when calling on ${target[ORIG_CLASS_NAME]}`)
                        argMap[(k as unknown as any)] = singleton
                    } else {
                        throw new Error(`Failed to inject singleton ${singletonName} into ${target[ORIG_CLASS_NAME]} because it wasn't found in the ESX IoC (try registering it when starting ESX using \`.withSingletons([new ${singletonName}(...)])\`)`)
                    }
                }
            }
            //add other static param resolvers here
        }

        const finalArgs = mergeArrays(args, argMap)
        originalMethod.apply(target, finalArgs) //re-bind the this
    })
    delete target[propKey]
    target[propKey] = proxy.bind(target)
    target.test = 10
    INTERNAL_LOGGER.debug(`Proxy attached to class ${target[ORIG_CLASS_NAME]}, in ${propKey}()`)


}