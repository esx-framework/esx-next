import {getMeta} from "../skeleton/meta";
import {CLASSWIDE_META, SINGLETON_DATA, SINGLETON_REGISTERED} from "../skeleton/constants";
import {metaName} from "../utils";

/**
 * Class to get metadata about the current context
 *
 */
export class ClassReflector {
    constructor(private readonly target: any) {}

    /**
     * Gets a metadata value in a method's context (registered with @Meta() above the method declaration)
     * @param key
     *
     */
    public getContextMeta<T>(propKey: string, key: string): T | undefined {
        return getMeta<T>(this.target, propKey, metaName(key))
    }

    /**
     * Gets a metadata value in the whole class (registered with @Meta() above the class declaration)
     * @param key
     *
     */
    public getMeta<T>(key: string): T | undefined {
        return getMeta<T>(this.target, CLASSWIDE_META, metaName(key))
    }

    /**
     * Checks whether the target class was marked as a singleton (doesn't check if it's already injected into the IoC)
     */
    public isRegisteredSingleton() {
        return getMeta<boolean>(this.target, SINGLETON_DATA, SINGLETON_REGISTERED) || false
    }
}