
export {Vector3} from "./math/3d/vec3"
export {Vector2} from "./math/2d/vec2"
export {Line} from "./math/2d/line"
export {Circle} from "./math/2d/circle"
export {Cache} from "./decorators/cache.decorator"
export {memo, sig} from "./utils"


const isServer = IsDuplicityVersion()
if (isServer) {
    //server
} else {
    //client
}