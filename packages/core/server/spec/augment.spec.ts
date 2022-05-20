import {Augmentable} from "../decorators";
import {AugmentableComponent, registerAugmenterFor} from "../decorators/augments.decorator";


@Augmentable("AugmentableClass")
class AugmentableClass implements AugmentableComponent {
    public getComponent: <C>(name: string) => C
    constructor() {}
    public method() {
        return "Hello from augmentable"
    }
}


class AugmentingClass  {
    constructor(private readonly parent: AugmentableClass) {

    }
    public callMethodOnOriginal() {
        return this.parent.method()
    }

}
test("tests if class augmentation works", (done) => {
    registerAugmenterFor("AugmentableClass", AugmentingClass, "AugmentingClass")
    const inst = new AugmentableClass()
    const compRes = inst.getComponent<AugmentingClass>("AugmentingClass").callMethodOnOriginal()
    const mRes = inst.method()
    expect(compRes).toEqual(mRes)
    done()
})