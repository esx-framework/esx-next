import {resolveDecoratedParams} from "./skeleton/param.resolver";
import {OnNet, Payload, Source} from "./decorators";
import {Testing} from "./testing/manager";
import {Config} from "./index";
import {DEFAULT_CONFIG} from "./skeleton/constants";

Testing.stub()
class Lol {
    @OnNet("test")
    public method(@Payload() pload: string, @Source() src: number) {
        console.log("test payload:", pload, "source", src)
    }
}

const cls = new Lol()


Testing.emitNetEventWithSource("test", 1, "hello there")


let config: Partial<Config>;
export function setConfig(cf: Partial<Config>) {
    config = cf
}



export function getConfigField<T extends keyof Config>(key: T) {
    return config[key] || DEFAULT_CONFIG[key]
}