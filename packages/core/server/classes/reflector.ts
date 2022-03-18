import {getMeta} from "../skeleton/meta";
import {CLASSWIDE_META} from "../skeleton/constants";
import {metaName} from "../utils";

/**
 * Class to get metadata about the current context
 *
 */
export class ClassReflector {
    constructor(private readonly target: any, private readonly propkey: string) {}

    /**
     * Gets a metadata value in the current method's context (registered with @Meta() above the method declaration)
     * @param key
     *
     */
    public getContextMeta<T>(key: string): T | undefined {
        return getMeta<T>(this.target, this.propkey, metaName(key))
    }

    /**
     * Gets a metadata value in the whole class (registered with @Meta() above the class declaration)
     * @param key
     *
     */
    public getMeta<T>(key: string): T | undefined {

        return getMeta<T>(this.target, CLASSWIDE_META, metaName(key))
    }
}