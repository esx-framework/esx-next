import {AUGMENT_KEY, AUGMENT_MAP, Component} from "../skeleton/constants";
import {attachMeta, getMeta} from "../skeleton/meta";
import {INTERNAL_LOGGER} from "../server";


const augmenters = new Map<Component | string, any[]>()

/**
 * Marks a class as an augmentation for a component (available via the `.getComponent()` method`)
 * @param component
 */
export const Augments = (component: Component | string) => {
    return (target: Function) => {
        INTERNAL_LOGGER.debug(`Registering augmenter ${target.name} for component ${component}`)
        const augs = augmenters.get(component) || []
        augs.push([Object.getPrototypeOf(target).constructor, target.name])
        augmenters.set(component, augs)
    }
}

export function registerAugmenterFor(comp: Component | string, augmenter: any, customName?: string) {
    INTERNAL_LOGGER.debug(`Registering augmenter ${customName || augmenter.constructor.name} for component ${comp}`)
        const augs = augmenters.get(comp) || []
        augs.push([augmenter, customName || augmenter.constructor.name])
        augmenters.set(comp, augs)
}




export interface ComponentAugmenter<T extends new (...args: any) => any> {
    new: (instance: T, ...params: ConstructorParameters<T>) => ComponentAugmenter<T>
}

/**
 * Marks a class as an augmentable one
 * @param refName
 * @param implementGetter whether to automatically implement the `getComponent` method (`ComponentAugmenter<T>` interface) (defaults to true)
 */
export const Augmentable = (refName: Component | string, implementGetter = true): any => {
    INTERNAL_LOGGER.debug(`Registering augmentable component ${refName}`)
    return (target: any) => class extends target {
            constructor(...args: any[]) {
                super(...args);
                const augs = (augmenters.get(refName) || []).map(([aug, name]) => {
                    try {
                        const ag = new aug(this)
                        INTERNAL_LOGGER.debug(`Injecting ${name} into ${target.name} as augmentable`)
                        return {inst: ag, name: name}
                    } catch (err) {
                        INTERNAL_LOGGER.error(`Failed to attach augmenting class ${name} to ${target.name} due to ${err} in ${aug.name}`, err)
                    }
                })
                INTERNAL_LOGGER.debug(`Registered all augmenters for ${target.name}`, augs.map(val => val.name))
                attachMeta(this, AUGMENT_KEY, AUGMENT_MAP, augs)
            }
            public getComponent<C>(...args: any[]): C {
                if (implementGetter) {
                    // @ts-ignore
                    return getComponentInClassCtx<C>(this, ...args)
                } else {
                    try {
                        return target?.getComponent(...args)
                    } catch (err) {
                        return undefined
                    }
                }
            }
        }
}

/**
 * The interface doesn't have to be implemented, since the `@Augmentable` decorator will automatically implement it (and will overwrite the class's implementation, unless specified), so having the signature is enough.
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