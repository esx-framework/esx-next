export function buildObject(entries: ([string, any])[]) {
    const ret: any = {}
   entries.forEach(([key, val]) => {
       ret[key] = val
   })
    return ret
}