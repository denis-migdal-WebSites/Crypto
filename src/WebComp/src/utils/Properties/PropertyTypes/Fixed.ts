import { FCT_FALSE, NULL_OP } from "../../NullObjects";

export default function Fixed<T>(value: T) {

    const property = {
        get       : () => value,
        set       : FCT_FALSE,
        markStale : NULL_OP
    };

    return () => property;
}