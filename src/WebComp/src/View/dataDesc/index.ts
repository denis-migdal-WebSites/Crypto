import StrictlyPositiveInt from "../validators/StrictlyPositiveInt";
import Boolean             from "../validators/Boolean";
import StringArray from "../validators/StringArray";

export function dataDesc<T>(
                    defVal: T,
                    validator: NoInfer<(val: T) => boolean>) {

    return {default: defVal, validator};
}

export function createDataDesc<T>(validator: (val: T) => boolean) {

    return (defVal: T) => dataDesc(defVal, validator);
}

export const descriptors = {
    StrictlyPositiveInt: createDataDesc( StrictlyPositiveInt ),
    Boolean            : createDataDesc( Boolean ),
    StringArray        : createDataDesc( StringArray ),
}