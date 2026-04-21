import {type Constructible, isClass} from "@MWL/types";

// End from MWL
export default function createInstance< T    extends {},
                                        ARGS extends unknown[]
                        >( constructible: Constructible<T, ARGS>,
                           ...args      : NoInfer<ARGS>
                         ) {

    if( isClass<T, ARGS>(constructible) )
        return new constructible(...args);

    return constructible(...args);
}