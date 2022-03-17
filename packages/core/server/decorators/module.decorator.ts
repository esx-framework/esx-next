import {registerModule} from "../singletonloader";

export const Module = () => {
    return (target: Function) => {
        registerModule(target)
    }
}