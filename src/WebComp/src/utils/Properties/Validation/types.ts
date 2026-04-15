export function isString(u: unknown): u is string {
    return typeof u === 'string';
}

export function isArrayOf<T>( cond: ((u: unknown) => u is T)
                                   |((u: unknown) => boolean) ) {
    
    const fct = function (u: unknown): u is T[] {

        if( ! Array.isArray(u) )
            return false;

        for(let i = 0; i < u.length; ++i) {
            if( ! cond( u[i] ) )
                return false; 
        }

        return true;
    }

    Object.defineProperty(fct, "name", {
        value: `ArrayOf(${cond.name})`
    });

    return fct;
}