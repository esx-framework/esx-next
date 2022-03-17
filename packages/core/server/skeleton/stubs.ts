const netHandlers = new Map<string, Function[]>()
const localHandlers = new Map<string, Function[]>()

const onNetStub = (eventName: string, handler: Function) => {
    const curr = netHandlers.get(eventName) || []
    curr.push(handler)
    netHandlers.set(eventName, curr)
}

let lastSource = 0;
export const defineSource = (src: number) => (lastSource = src)

const emitNetStub = (eventName: string, ...args: any[]) => {
const toCall = netHandlers.get(eventName) || []
    toCall.forEach(async (ev) => {
        global.source = lastSource
        await ev(...args)
        global.source = -1
    })
}

const onStub = (eventName: string, handler: Function) => {
    const curr = localHandlers.get(eventName) || []
    curr.push(handler)
    localHandlers.set(eventName, curr)
}

const emitStub = (eventName: string, ...args: any[]) => {
    const toCall = localHandlers.get(eventName) || []
    toCall.forEach(async (ev) => {
        await ev(...args)
    })
}

export const createStub = (functionName: string, fn: Function, force = false) => {
    // @ts-ignore
    global[functionName] = force ? fn : global[functionName] || fn
}

export function stub() {
    global.onNet = global.onNet || onNetStub
    global.emitNet = global.emitNet || emitNetStub
    global.on = global.on || onStub
}