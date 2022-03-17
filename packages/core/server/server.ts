import "reflect-metadata"
import {run} from "./paramtest";
import {RPC} from "./decorators/rpc.decorator";
import {getMeta} from "./meta";
import {INTERNAL_ARGS, INTERNAL_RPC_DRIVER} from "./constants";
import {Payload, Source} from "./decorators/netargs.decorator";

class Lol {
    @RPC("TEST")
    public method(@Source() src: number, @Payload() pload: any) {

    }
}

const cls = new Lol()
console.log(getMeta(cls, "method", INTERNAL_ARGS))

