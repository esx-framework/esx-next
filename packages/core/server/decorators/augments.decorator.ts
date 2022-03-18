import {AUGMENT_KEY, AUGMENT_MAP, Component} from "../skeleton/constants";
import {attachMeta, getMeta} from "../skeleton/meta";


const augmenters = new Map<Component | string, any[]>()

/**
 * Marks a class as an augmentation for a component (available via the `.getComponent()` method`)
 * @param component
 */
export const Augments = (component: Component | string) => {
    return (target: Function) => {
        const augs = augmenters.get(component) || []
        augs.push(target)
        augmenters.set(component, augs)
    }
}




export interface ComponentAugmenter<T extends new (...args: any) => any> {
    onMount: (...params: ConstructorParameters<T>) => any
}

/**
 * Marks a class as an augmentable one
 * @param refName
 * @param implementGetter whether to automatically implement the `getComponent` method (defaults to true)
 */
export const Augmentable = (refName: Component | string, implementGetter = true): any => {
    return (target: any) => class extends target {
            constructor(...args: any[]) {
                super(...args);
                const augs = augmenters.get(refName).map(aug => {
                    const ag = new aug()
                    try {
                        ag.onMount(...args)
                    } catch (err) {
                        throw new Error(`Failed to attach augmenting class ${aug.name} to ${target.name} due to ComponentAugmenter<${"typeof"}${target.name}> not being implemented in ${aug.name}`)
                    }
                    return {inst: ag, name: aug.name}
                })
                attachMeta(this, AUGMENT_KEY, AUGMENT_MAP, augs)
            }
            public getComponent<C>(...args: any[]): C {
                if (implementGetter) {
                    // @ts-ignore
                    return getComponentInClassCtx<C>(this, ...args)
                } else {
                    return target.getComponent(...args)
                }
            }
        }
}

/**
 * The function doesn't have to be implemented, since the `@Augmentable` decorator will automatically implement it (and will overwrite the class's implementation, unless specified), so having the signature is enough.
 * @example
 * ```ts
 * @Augmentable("player")
 * export class Player implements AugmentableComponent {
 *     public getComponent: <C>(name: string) => C
 * }
 * ```
 */
export interface AugmentableComponent {
    getComponent: getComponentSignature
}
export type getComponentSignature = <C>(name: string) => C

export function getComponentInClassCtx<T>(target: any, name: string): T {
    const comps = getMeta<any[]>(target, AUGMENT_KEY, AUGMENT_MAP)
    return comps.find(cmp => cmp.name === name)?.inst
}