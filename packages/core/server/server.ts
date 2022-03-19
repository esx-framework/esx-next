import {Augmentable, Augments, ComponentAugmenter} from "./decorators/augments.decorator";
import {Testing} from "./testing/manager";
import {Config, ESX, OnNet, Payload, Source} from "./index";
import {DEFAULT_CONFIG} from "./skeleton/constants";
import {Player} from "./classes/player";
import {Logger} from "./classes/logger";
import {Class, Inject, Singleton} from "./decorators/singleton.decorator";
import {mock} from "./utils";
import {EventContext} from "./decorators/event.decorator";
import "reflect-metadata"

Testing.stub()
Testing.defStub("GetNumPlayerIdentifiers", () => 0)
let config: Partial<Config> = {};
export const INTERNAL_LOGGER = new Logger("ESX::CORE", getConfigField("minLogLevel"))

@Singleton()
class Lol  {
public method() {
    console.log("I am a method")
}
}
ESX.withSingletons([new Lol()])
//testing, ignore
@Class()
class Receiver {
    public method(@Inject("Lol") param: Lol) {
        param.method()
    }

    public otherMethod(staticArg: number, @Inject("Lol") param?: Lol) {
        console.log("Static arg was:", staticArg)
        param.method()
    }
    public staticMethod() {}
    @OnNet("hello")
    public eventHandler(@Payload((pl: EventContext) => pl.getPayload()[0].prop == "hello") hello: any, @Source((cx, src) => src == 0) src: number, @Inject("Lol") param: Lol) {
        console.log("all validators succeeded", hello)
        param.method()
    }
}
const recv = new Receiver()
Testing.emitNetEventWithSource("hello", 0, {prop: "hello"})


export function setConfig(cf: Partial<Config>) {
    config = cf
}



export function getConfigField<T extends keyof Config>(key: T): Config[T] {
    // @ts-ignore
    return config[key] || DEFAULT_CONFIG[key]
}