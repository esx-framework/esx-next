import {INTERNAL_RPC_DRIVER} from "../constants";
import {RpcDriver} from "../classes/rpcdriver";
import {attachMeta} from "../meta";

/**
 * Decorator to mark a method as an RPC ("server callback") listener
 * @param name
 * 
 * 
 * 
 */
export const RPC = (name: string) => {
    return (target: any, memberName: string, propertyDescr: PropertyDescriptor) => {
        attachMeta(target, memberName, INTERNAL_RPC_DRIVER, new RpcDriver(name))
    }
}
