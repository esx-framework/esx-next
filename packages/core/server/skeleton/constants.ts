import {Player} from "../classes/player";
import {PlayerPermissionManager} from "../classes/permmgr";
import {Config} from "../index";

export const INTERNAL_RPC_DRIVER = "__ESX_DRIVER"
export const INTERNAL_ARGS = "__ESX_ARG_REFL"
export const META_KEY = "__ESX_META_BUCKET"

export const GET_PLAYER_DECL_ARG = "GET_PLAYER"
export const GET_SOURCE_DECL_ARG = "GET_SOURCE"
export const GET_PAYLOAD_DECL_ARG = "GET_PAYLOAD"
export const GET_PERM_DECL_ARG = "GET_PERMS"

export const SRC_VALIDATOR = "SRC_VALIDATOR"
export type SourceValidatorSig = (src: number) => boolean

export const PAYLOAD_VALIDATOR = "PAYLOAD_VALIDATOR"
export type PayloadValidatorSig = (payload: any) => boolean

export const PERM_VALIDATOR = "PERM_VALIDATOR"
export type PermValidatorSig = (mgr: PlayerPermissionManager) => boolean

export const PLAYER_VALIDATOR = "PLAYER_VALIDATOR"
export type PlayerValidatorSig = (player: Player) => boolean

export type NET_DECL_ARGS = typeof GET_PLAYER_DECL_ARG | typeof GET_SOURCE_DECL_ARG | typeof GET_PAYLOAD_DECL_ARG | typeof GET_PERM_DECL_ARG

export const GET_REFLECTOR_DECL_ARG = "GET_REFLECTOR"

export const CLASSWIDE_META = "CLASS_META"

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