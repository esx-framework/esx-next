import {registerModule} from "../skeleton/singletonloader";

export const Module = () => {
    return (target: Function) => {
        registerModule(target)
    }
}