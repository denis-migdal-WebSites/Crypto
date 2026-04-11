// from MWL
// change {} -> object + use any[].
export type Cstr<T    extends object = object,
                 ARGS extends any[]  = any[]
            > = {new(...args: ARGS): T};

// modified...
export type Constructible<T extends {} = {}, Args extends any[] = any[]>
    = Cstr<T, Args> | ((...args: Args) => T);

export function isClass<T    extends {}    = {},
                        ARGS extends any[] = any[]>(
                            obj: Constructible<T, ARGS>
                        ): obj is Cstr<T, ARGS> {
    const prototype = Object.getOwnPropertyDescriptor(obj, "prototype");
    if( prototype === undefined)
        return false;
    return prototype.writable === false;
}
// End from MWL


export default function createInstance< T    extends {},
                                        ARGS extends any[]
                        >( constructible: Constructible<T, ARGS>,
                           ...args      : NoInfer<ARGS>
                         ) {

    if( isClass(constructible) )
        return new constructible(...args);

    return constructible(...args);
}