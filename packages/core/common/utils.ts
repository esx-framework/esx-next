export function boundary<T>(fn: () => T | undefined, def: T) {
    try {
        return fn() || def
    } catch (err) {
        return def
    }
}