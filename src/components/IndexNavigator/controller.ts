import Value from "@/WebComp/src/utils/Properties/PropertyTypes/Value";
import WithProperties from "../../WebComp/src/utils/Properties/WithProperties";
import { Validated } from "@/WebComp/src/utils/Properties/Validation";
import { isPositiveInteger } from "@/WebComp/src/utils/Properties/Validation/numbers";
import { NULL_OP } from "@/WebComp/src/utils/NullObjects";

export default class IndexNavigatorController extends WithProperties({
    count   : Validated(Value(0), isPositiveInteger),
    current : Validated(Value(1), isPositiveInteger),
    callback: Value<(idx: number) => void>( NULL_OP )
}) {

    notify() {
        this.properties.callback(this.properties.current);
    }

    gotoPrev() {
        let cur   = this.properties.current;
        let count = this.properties.count;

        this.properties.current = ( (cur+count-2) % count) + 1

        this.notify();
    }

    gotoNext() {
        let cur   = this.properties.current;
        let count = this.properties.count;

        this.properties.current = (cur % count)+1

        this.notify();
    }
}