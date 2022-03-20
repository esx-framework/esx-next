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
    ChainedSwitch,
    chainedSwitch,
    createContextDescriptor,
    getArgs,
    getValidatorKey,
    isArgGetterOfType, isMarkedForStaticInjection, isProxyAttached,
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
    if (isMarkedForStaticInjection(target, prop) && !isProxyAttached(target, prop)) {
        ctxProxy(target, prop)
    }
    const callContext = createContextDescriptor(execType)
    const handlerRef = target[prop]
    const meta = getMeta<NET_DECL_ARGS[]>(target, prop, INTERNAL_ARGS) || []
    const ply = new Player(cx.getSource())
    const permMgr = new PlayerPermissionManager(ply)
    const args: any[] = []
    for (const [k, argDecl] of Object.entries(meta)) {
        const validatorArg = getValidatorKey(argDecl)
        const validatorFn = getMeta<ValidatorSigs>(target, prop, validatorArg) || ((cx: CtxDecl, ...data: unknown[]) => true)
        const toInspect = new ChainedSwitch(validatorArg)
            .inspectIf("PAYLOAD_VALIDATOR", callContext.hasPayload, () => (<EventContext>cx).getPayload())
            .inspectIf("SRC_VALIDATOR", callContext.hasSource, () => cx.getSource())
            .inspectIf("PLAYER_VALIDATOR", callContext.hasPlayer,() => ply)
            .inspectIf("PERM_VALIDATOR", callContext.hasPermManager,() => permMgr)
            .inspectIf("ARG_VALIDATOR", callContext.hasArgs, () => (<CommandContext>cx).getArgs())
            .inspectIf("RAW_CMD_VALIDATOR", callContext.hasRawCmd, () => (<CommandContext>cx).getRawCmd())
            .ok()
        const proceed = validatorFn(cx, toInspect)
        if (!proceed) {
            INTERNAL_LOGGER.debug(`Validator failed`)
            return {reachedEnd: false, reason: VALIDATOR_FAILED, result: undefined}
        }
        args[(<any>k)] = toInspect
    }

    try {
        const ret = await handlerRef(...args)
        return {reachedEnd: true, reason: NO_FAIL, result: ret}
    } catch (err) {
        INTERNAL_LOGGER.fatal(`Failed to run method: ${prop} in ${target[ORIG_CLASS_NAME] || target.constructor.name} (context: ${execType})`, err)
        return {reachedEnd: false, reason: HANDLER_ERROR, result: err}
    }

}
//function to make users able to call any method with decorated params
export function ctxProxy(target: any, propKey: string) {
    INTERNAL_LOGGER.debug(`Creating proxy for ${propKey} in ${target[ORIG_CLASS_NAME] || target.constructor.name}`)
    const originalMethod = target[propKey]
    const injectionProxy = ((...args: any[]) => {
        INTERNAL_LOGGER.debug(`Proxy called for ${propKey} in ${target[ORIG_CLASS_NAME] || target.constructor.name}`)
        const meta = getMeta<STATIC_DECL_ARGS[]>(target, propKey, INTERNAL_ARGS) || []
        const __ESX_STATIC_INJECTION_MARKER = 0
        const argMap: any[] = []
        for (const [k, v] of Object.entries(meta)) {
            if (isArgGetterOfType(v, GET_SINGLETON, false)) {
                const args = getArgs<typeof GET_SINGLETON>(v)
                INTERNAL_LOGGER.debug(`Args for ${v} is ${args}`)
                if (args[0]) {
                    const singletonName = args[0]
                    const singleton = getSingletonRef(singletonName)
                    if (singleton) {
                        INTERNAL_LOGGER.debug(`Loaded singleton ${singletonName} into arg map when calling on ${target[ORIG_CLASS_NAME] || target.constructor.name}`)
                        argMap[(k as unknown as any)] = singleton
                    } else {
                        throw new Error(`Failed to inject singleton ${singletonName} into ${target[ORIG_CLASS_NAME] || target.constructor.name} because it wasn't found in the ESX IoC (try registering it when starting ESX using \`.withSingletons([new ${singletonName}(...)])\`)`)
                    }
                }
            }
            //add other static param resolvers here
        }

        const finalArgs = mergeArrays(args, argMap)
        return originalMethod.apply(target, finalArgs) //re-bind the this
    })
    delete target[propKey]
    target[propKey] = injectionProxy.bind(target)
    //target.test = 10
    INTERNAL_LOGGER.debug(`Proxy attached to class ${target[ORIG_CLASS_NAME]}, in ${propKey}()`)


}