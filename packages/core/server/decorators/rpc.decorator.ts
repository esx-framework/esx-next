import {INTERNAL_RPC_DRIVER, NET_EVENT_HANDLER_PROP, RPC_HANDLER_PROP} from "../skeleton/constants";
import {RpcDriver} from "../classes/rpcdriver";
import {attachMeta} from "../skeleton/meta";

/**
 * Decorator to mark a method as an RPC ("server callback") listener
 * @param name
 *
 *
 *
 */
export const RPC = (name: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, RPC_HANDLER_PROP, true)
        attachMeta(target, memberName, INTERNAL_RPC_DRIVER, new RpcDriver(name, target, memberName))
    }
}
