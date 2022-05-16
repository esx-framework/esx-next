import {Augmentable, Augments, ComponentAugmenter} from "../decorators";
import {AugmentableComponent} from "../decorators/augments.decorator";


@Augmentable("AugmentableClass")
class AugmentableClass implements AugmentableComponent {
    public getComponent: <C>(name: string) => C
    constructor() {}
    public method() {
        return "Hello from augmentable"
    }
}

@Augments("AugmentableClass")
class AugmentingClass  {
    constructor(private readonly parent: AugmentableClass) {

    }
    public callMethodOnOriginal() {
        return this.parent.method()
    }

}
test("tests if class augmentation works", (done) => {
    const inst = new AugmentableClass()
    const compRes = inst.getComponent<AugmentingClass>("AugmentingClass").callMethodOnOriginal()
    const mRes = inst.method()
    expect(compRes).toEqual(mRes)
    done()
})