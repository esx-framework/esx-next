import {INTERNAL_ARGS} from "./constants";
import {attachMeta, getMeta} from "./meta";

const ParamDecor = (val: any) => {
    return (target: any, propKey: string, idx: number) => {
        const map: any[] = getMeta<any[]>(target, propKey, "ARGS") || []
        map[idx] = val
        attachMeta(target, propKey, "ARGS", map)
    }
}
class Lol {
    public hello(@ParamDecor("hello") param: any, @ParamDecor("param2") param2: any) {
        console.log("result:", param, param2)
    }
}
function call(cls: any, meth: string) {
    const meta = getMeta<any[]>(cls, meth, "ARGS") || []
    cls[meth](...meta)
}

export function run() {
    const lol = new Lol()
    call(lol, "hello")

}