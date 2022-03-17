import {AUGMENT_KEY, AUGMENT_MAP, Component} from "../skeleton/constants";
import {attachMeta} from "../skeleton/meta";


const augmenters = new Map<Component, any[]>()

/**
 * Marks a class as an augmentation for a component (available via the `.getComponent()` method`)
 * @param component
 */
export const Augments = (component: Component) => {
    return (target: Function) => {
        const augs = augmenters.get(component) || []
        augs.push(target)
        augmenters.set(component, augs)
    }
}




export interface ComponentAugmenter<T extends abstract new (...args: any) => any> {
    onInit: (...params: ConstructorParameters<T>) => any
}

export const Augmentable = (refName: Component): any => {
    return (target: any) => {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);
                const augs = augmenters.get(refName).map(aug => {
                    const ag = new aug()
                    try {
                        ag.onInit(...args)
                    } catch (err) {
                        throw new Error(`Failed to attach augmenting class ${aug.name} to ${target.name} due to ${err}`)
                    }
                    return {inst: ag, name: aug.name}
                })
                attachMeta(this, AUGMENT_KEY, AUGMENT_MAP, augs)
            }
        }


    }
}

export interface AugmentableComponent {
    getComponent: <C>(name: string) => C
}
