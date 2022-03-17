import {generateRpcPair, NET_DECL_ARGS, TODO} from "../skeleton/constants";
import {resolveDecoratedParams} from "../skeleton/param.resolver";
import {Player} from "./player";
import {handleError} from "../skeleton/errors";

export class RpcDriver {

    constructor(name: string, private readonly target: any, propKey: string) {
        const {recv} = generateRpcPair(name, "")
        onNet(recv, async ({id, payload}: { payload: any[], id: string }) => {
            const src = source
            const handler = target[propKey]
            try {
                const res = await handler(...resolveDecoratedParams<NET_DECL_ARGS>(target, propKey, {
                    "GET_PLAYER": new Player(src),
                    "GET_PAYLOAD": payload,
                    "GET_SOURCE": src
                }))
                const {reply} = generateRpcPair(name, id)
                emitNet(reply, src, res)
            } catch (err) {
                handleError(err, "RPC")
                TODO("Error handling for RPC")
            }

        })
    }

}