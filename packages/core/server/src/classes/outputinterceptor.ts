const {createOutputInterceptor} = require("output-interceptor")

export class OutputInterceptor {
    constructor() {}
    public async interceptStdout<T extends (...args: any) => any>(fn: T): Promise<{output: string, retval: Awaited<ReturnType<T>>}> {
        const interceptor = createOutputInterceptor()
        const outp = await interceptor(async () => {
            return await fn()
        })
        return {output: interceptor.output, retval: outp}
    }
}