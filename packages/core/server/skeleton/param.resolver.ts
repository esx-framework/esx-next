import {INTERNAL_ARGS} from "./constants";
import {getMeta} from "./meta";
import {boundary} from "../../common/utils";


export function resolveDecoratedParams<T extends string>(target: any, memberName: string, values: Record<T, any>) {
    const meta = getMeta<(T)[]>(target, memberName, INTERNAL_ARGS)
    const argMap: any[] = []
    for (const [k, v] of Object.entries(meta)) {
        argMap[(k as any)] = boundary(() => values[v], v)
    }
    return argMap
}