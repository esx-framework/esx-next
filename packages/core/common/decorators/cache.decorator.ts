import {memo} from "../utils";

/**
 * Decorator to cache a functions return value
 * @constructor
 */
export const Cache = () => {
    return (target: any, propKey: any, descr: PropertyDescriptor) => {
        target[propKey] = memo(target[propKey]).bind(target)
    }
}