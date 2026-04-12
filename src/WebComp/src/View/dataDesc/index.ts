import StrictlyPositiveInt from "../validators/StrictlyPositiveInt";

export function dataDesc<T>(
                    defVal: T,
                    validator: NoInfer<(val: T) => boolean>) {

    return {default: defVal, validator};
}

export function createDataDesc<T>(validator: (val: T) => boolean) {

    return (defVal: T) => dataDesc(defVal, validator);
}

export const descriptors = {
    StrictlyPositiveInt: createDataDesc( StrictlyPositiveInt )
}