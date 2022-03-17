import {
    generateRpcPair,
    INTERNAL_RPC_DRIVER,
    NET_DECL_ARGS,
    NET_EVENT_HANDLER_PROP,
    RPC_HANDLER_PROP, TODO
} from "../skeleton/constants";
import {attachMeta} from "../skeleton/meta";
import {Player} from "../classes/player";
import {resolveDecoratedParams} from "../skeleton/param.resolver";
import {PlayerPermissionManager} from "../classes/permmgr";
import {handleError} from "../skeleton/errors";
import {createChainedFunction} from "@reincarnatedjesus/f-chain";
import {callInCtx} from "../skeleton/rthost";



type RpcDelegate = {src: number, payload: any, __id: string}
//exported because its used in events too, little messy
export const createChain = (src: number, payload: any, id: string) => createChainedFunction(() => ({src: 0, payload: {}, __id: ""}), {
    getPayload: (ctx) => ctx.getRoot<RpcDelegate>().payload,
    getSource: (ctx) => ctx.getRoot<RpcDelegate>().src,
    getReqId: (ctx) => ctx.getRoot<RpcDelegate>().__id
})()

//mock to create a compile time type of the context
const mock = createChain(0, {}, "")
export type RpcContext = typeof mock;



/**
 * Decorator to mark a method as an RPC ("server callback") listener
 * @param name
 */
export const RPC = (name: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, RPC_HANDLER_PROP, true)
        const {recv} = generateRpcPair(name, "")
        onNet(recv, async ({id, payload}: { payload: any[], id: string }) => {
            const src = source
            const handler = target[memberName]
                const ply = new Player(src)
                const cx: RpcContext = createChain(src, payload, id)
                const res = await callInCtx<any>(target, memberName, cx)
                if (res.reachedEnd) {
                    const {reply} = generateRpcPair(name, id)
                    emitNet(reply, src, res.result)
                }

        })
    }
}
