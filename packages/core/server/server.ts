import {Augments, ComponentAugmenter} from "./decorators";
import {Testing} from "./testing/manager";
import {Config} from "./index";
import {DEFAULT_CONFIG} from "./skeleton/constants";
import {Player} from "./classes/player";

Testing.stub()
Testing.defStub("GetNumPlayerIdentifiers", () => 0)

@Augments("player")
class Lol implements ComponentAugmenter<typeof Player>{

    onInit(params: any): any {
        console.log("Augmented component mounted")
    }
}
new Lol()

const ply = new Player(10)
const comp = ply.getComponent("Lol")
console.log(comp)
let config: Partial<Config>;
export function setConfig(cf: Partial<Config>) {
    config = cf
}



export function getConfigField<T extends keyof Config>(key: T): Config[T] {
    return config[key] || DEFAULT_CONFIG[key]
}