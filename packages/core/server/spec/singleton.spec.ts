import {Class, Inject, Singleton} from "../decorators/singleton.decorator";
import {ESX} from "../index";

test("tests if a singleton is properly injected", () => {
    @Singleton()
    class ToInject  {
        public method(res: number) {
            return res
        }
    }
    ESX.withSingletons([new ToInject()])
    @Class()
    class TestClass {
        constructor() {}
        public toCall(w: number, @Inject("ToInject") injected?: ToInject) {
            return injected.method(w)
        }
    }
    const tc = new TestClass()
    expect(tc.toCall(10)).toBe(10)

})