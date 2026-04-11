// from MWL
// change {} -> object + use unknown[] = never[].
export type Cstr<T    extends object    = object,
                 ARGS extends unknown[] = never[]
            > = {new(...args: ARGS): T};

// modified...
export type Constructible<T extends {} = {}, Args extends unknown[] = never[]>
    = Cstr<T, Args> | ((...args: Args) => T);

export function isClass<T    extends {}        = {},
                        ARGS extends unknown[] = never[]>(
                            obj: Constructible<T, ARGS>
                        ): obj is Cstr<T, ARGS> {
    const prototype = Object.getOwnPropertyDescriptor(obj, "prototype");
    if( prototype === undefined)
        return false;
    return prototype.writable === false;
}
// End from MWL


export default function createInstance< T    extends {},
                                        ARGS extends unknown[]
                        >( constructible: Constructible<T, ARGS>,
                           ...args      : NoInfer<ARGS>
                         ) {

    if( isClass(constructible) )
        return new constructible(...args);

    return constructible(...args);
}