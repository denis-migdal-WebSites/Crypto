import { NO_VALUE } from "../../NullObjects";
import { Property } from "../Property";

class ComputedInstance<CTX extends Record<string, any>, T>
                                                implements Property<T>{

    protected ctx  : Readonly<CTX>;
    protected calc : (ctx: Readonly<CTX>) => T;
    protected cache: T|typeof NO_VALUE = NO_VALUE;

    constructor(ctx: Readonly<CTX>, calc : (ctx: Readonly<CTX>) => T) {
        this.ctx  = ctx;
        this.calc = calc;
    }

    get() {
        if( this.cache === NO_VALUE )
            this.cache = this.calc(this.ctx);

        return this.cache;
    }

    set() { return false; }

    markStale(){ this.cache = NO_VALUE; }
}

export default function Computed<CTX extends Record<string, any>, T>(
            calc: (ctx: Readonly<CTX>) => T
        ) {

    return (ctx: Readonly<CTX>) => new ComputedInstance( ctx, calc );
}