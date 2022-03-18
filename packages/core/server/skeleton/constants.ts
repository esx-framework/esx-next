import {Player} from "../classes/player";
import {PlayerPermissionManager} from "../classes/permmgr";
import {Config} from "../index";
import {CommandContext} from "../decorators/command.decorator";
import {RpcContext} from "../decorators/rpc.decorator";
import {EventContext} from "../decorators/event.decorator";

export const INTERNAL_ARGS = "__ESX_ARG_REFL"
export const META_KEY = "__ESX_META_BUCKET"
export const AUGMENT_KEY = "__ESX_AUGMENTED"
export const CLASSWIDE_META = "CLASS_META"
export const AUGMENT_MAP = "__ESX_AUG_MAP"
export const SINGLETON_DATA = "__ESX_SINGLETON_DATA"
export const SINGLETON_REGISTERED = "__ESX_SINGLETON_REGISTERED"

export const GET_PLAYER_DECL_ARG = "GET_PLAYER"
export const GET_SOURCE_DECL_ARG = "GET_SOURCE"
export const GET_PAYLOAD_DECL_ARG = "GET_PAYLOAD"
export const GET_PERM_DECL_ARG = "GET_PERMS"
export const GET_ARGS_DECL_ARG = "GET_ARGS"
export const GET_RAW_CMD_DECL_ARG = "GET_RAW_CMD"
export const GET_TICK_MGR = "GET_TICK_HANDLER"
export const GET_INTERVAL_MGR = "GET_INTERVAL_REF"

export type TickArgs = typeof GET_TICK_MGR | typeof GET_INTERVAL_MGR

export const getValidatorKey = (args: NET_DECL_ARGS) => {
    switch (args) {
        case "GET_PAYLOAD":
            return PAYLOAD_VALIDATOR
        case "GET_PERMS":
            return PERM_VALIDATOR
        case "GET_SOURCE":
            return SRC_VALIDATOR
        case "GET_PLAYER":
            return PLAYER_VALIDATOR
        case "GET_RAW_CMD":
            return RAW_CMD_VALIDATOR
        case "GET_ARGS":
            return ARG_VALIDATOR
        default:
            return undefined
    }
}
export type CtxDecl = EventContext | RpcContext | CommandContext
export const CTX_EVENT = "EVENT_CTX"
export const CTX_RPC = "RPC_CTX"
export const CTX_CMD = "CMD_CTX"
export const CTX_TICK = "TICK_CTX"
export const CTX_INTERVAL = "INTERVAL_CTX"
export const TICK_HANDLER = "TICK_HANDLER"
export const INTERVAL_HANDLER = "INTERVAL_HANDLER"
export type CtxType = typeof CTX_CMD | typeof CTX_EVENT | typeof CTX_RPC | typeof CTX_TICK | typeof CTX_INTERVAL

export const createContextDescriptor = (typ: CtxType) => ({
    hasPayload: () => typ === CTX_EVENT || typ === CTX_RPC,
    hasSource: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasArgs: () => typ === CTX_CMD,
    hasRawCmd: () => typ === CTX_CMD,
    hasPermManager: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasPlayer: () => typ === CTX_EVENT || typ === CTX_RPC || typ === CTX_CMD,
    hasIntervalRef: () => typ === CTX_INTERVAL,
    hasTickId: () => typ === CTX_TICK
})

export const ARG_VALIDATOR = "ARG_VALIDATOR"
export type ArgValidatorSig = (cx: CtxDecl, args: string[]) => boolean

export const RAW_CMD_VALIDATOR = "RAW_CMD_VALIDATOR"
export type RawCmdValidatorSig = (cx: CtxDecl, cmd: string) => boolean

export const SRC_VALIDATOR = "SRC_VALIDATOR"
export type SourceValidatorSig = (cx: CtxDecl, src: number) => boolean

export const PAYLOAD_VALIDATOR = "PAYLOAD_VALIDATOR"
export type PayloadValidatorSig = (cx: CtxDecl, payload: any) => boolean

export const PERM_VALIDATOR = "PERM_VALIDATOR"
export type PermValidatorSig = (cx: CtxDecl, mgr: PlayerPermissionManager) => boolean

export const PLAYER_VALIDATOR = "PLAYER_VALIDATOR"
export type PlayerValidatorSig = (cx: CtxDecl, player: Player) => boolean

export type NET_DECL_ARGS = typeof GET_PLAYER_DECL_ARG | typeof GET_SOURCE_DECL_ARG | typeof GET_PAYLOAD_DECL_ARG | typeof GET_PERM_DECL_ARG | typeof GET_RAW_CMD_DECL_ARG | typeof GET_ARGS_DECL_ARG | typeof GET_TICK_MGR

export type ValidatorSigs = ArgValidatorSig | RawCmdValidatorSig | SourceValidatorSig | PayloadValidatorSig | PermValidatorSig | PlayerValidatorSig


export const metaName = (name: string) => `_META:${name}`
export const generateRpcPair = (name: string, id: string) => ({recv: `ESX:RPC:${name}:RECV`, uuid: id, reply: `ESX:RPC:${name}:REPL:${id}`})


export const NET_EVENT_HANDLER_PROP = "NET_EVENT_HANDLER_PROP"
export const EVENT_HANDLER_PROP = "EVENT_HANDLER_PROP"
export const RPC_HANDLER_PROP = "RPC_HANDLER_PROP"

export const TODO = (text: string) => {
    throw new Error(`TODO: ${text}`)
}


export type Identifiers = "discord" | "steam" | "license" | "xbl" | "ip" | "live"

export const DEFAULT_CONFIG: Config = {
    preferredIdent: "license"
}

export const VALIDATOR_FAILED = "VALIDATOR_FAILED"
export const HANDLER_ERROR = "HANDLER_ERROR"
export const NO_FAIL = "NO_FAIL"
export type FailReasons = typeof VALIDATOR_FAILED | typeof HANDLER_ERROR | typeof NO_FAIL
export type Component = "player"
