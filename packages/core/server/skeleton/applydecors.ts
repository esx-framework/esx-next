//https://github.com/nestjs/nest/blob/master/packages/common/decorators/core/apply-decorators.ts
/**
 * Applies decorators
 * @param decorators
 */
export function applyDecorators(
    ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
    return <TFunction extends Function, Y>(
        target: TFunction | object,
        propertyKey?: string | symbol,
        descriptor?: TypedPropertyDescriptor<Y>,
    ) => {
        for (const decorator of decorators) {
            if (target instanceof Function && !descriptor) {
                (decorator as ClassDecorator)(target);
                continue;
            }
            (decorator as MethodDecorator | PropertyDecorator)(
                target,
                propertyKey,
                descriptor,
            );
        }
    };
}