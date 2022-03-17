import {Meta, Reflector} from "./decorators/meta.decorator";
import {ClassReflector} from "./classes/reflector";
import {resolveDecoratedParams} from "./param.resolver";


@Meta("classwide", "classwidehello")
class Lol {
    @Meta("local", "hello")
    public method(@Reflector() reflector: ClassReflector) {
        console.log(reflector.getMeta("classwide"))
        console.log(reflector.getContextMeta("local"))
    }
}

const cls = new Lol()
const meth = resolveDecoratedParams(cls, "method", {})
//console.log(getMeta(cls, "method", INTERNAL_ARGS))
// @ts-ignore
cls.method(...meth)


