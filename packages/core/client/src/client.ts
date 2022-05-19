export {Player} from "./classes/player"
export {emitRpc} from "./rpc"
export * from "../../common/common"

/**
 * Call a server sided function (marked with the `@Function()` decorator)
 * @param name
 * @param payload
 */
export function callFunction(name: string, payload: any) {
    emitNet(`ESX:FN:${name}`, payload)
}