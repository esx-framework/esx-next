const mods = new Map<string, any>()

export function registerModule(ref: any) {
    mods.set(ref.name, new ref())
}

export function getModuleRef<T>(name: string): T {
    return mods.get(name)
}

