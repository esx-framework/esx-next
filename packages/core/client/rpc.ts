import {uuid} from "uuidv4";
import {generateRpcPair} from "../common/utils";


/**
 * Trigger an RPC event to the server
 * @param name Name of the RPC event.
 * @param payload The payload of the RPC event.
 * @param timeout Timeout (in ms), if a response is not received by the time that this expires, then ˙null` is returned.
 */
export async function emitRpc<T, P>(name: string, payload: P, timeout = 1000): Promise<T | null> {
    return new Promise((res) => {
        const id = uuid()
        const {recv, reply} = generateRpcPair(name, id)
        emitNet(recv, {id, payload})
        const handlerFunc = (resp: T) => {
            res(resp)
            removeEventListener(reply, handlerFunc) //clean up
        }
        onNet(reply, handlerFunc)
        setTimeout(() => {
            res(null)
        }, timeout)
    })
}