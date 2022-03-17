import {NET_DECL_ARGS, INTERNAL_ARGS} from "./constants";
import {getMeta} from "./meta";

export function resolveDecoratedParams<T extends string>(target: any, memberName: string, values: Record<T, any>) {
    const meta = getMeta<(T)[]>(target, memberName, INTERNAL_ARGS)
    const argMap: any[] = []
    for (const [k, v] of Object.entries(meta)) {
        argMap[(k as any)] = values[v]
    }
    return argMap
}