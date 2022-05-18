import {Meta} from "../decorators";
import {ClassReflector} from "../classes/reflector";

@Meta("classWideMeta", "hello from classwide")
class ClassWithMeta {
    @Meta("methodMeta", "hello from method")
    public method() {

    }
}

test("test class metadata registration", (done) => {
    const inst = new ClassWithMeta()
    const refl = new ClassReflector(inst)
    expect(refl.getMeta("classWideMeta")).toEqual("hello from classwide")
    expect(refl.getContextMeta("method", "methodMeta")).toEqual("hello from method")
    done()
})