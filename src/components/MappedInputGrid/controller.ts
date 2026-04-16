import Computed from "../../WebComp/src/utils/Properties/PropertyTypes/Computed";
import Value from "../../WebComp/src/utils/Properties/PropertyTypes/Value";
import { Validated } from "../../WebComp/src/utils/Properties/Validation";
import { isArrayOf, isBoolean, isString } from "../../WebComp/src/utils/Properties/Validation/types";
import WithProperties from "../../WebComp/src/utils/Properties/WithProperties";

function checkAnswers(ctx: {
                                expected: readonly string[],
                                answers: readonly string[]
                            }) {
    
    if(ctx.expected.length !== ctx.answers.length)
        return false;

    return ctx.expected.every( (_,i) => ctx.expected[i].toUpperCase() === ctx.answers[i].toUpperCase() );
    
}

const StringArray = Validated( Value([] as readonly string[]), isArrayOf(isString) );

export default class MappedInputGridController extends WithProperties({
                            labels  : StringArray,
                            answers : StringArray,
                            expected: StringArray,
                            ro      : Validated( Value(false), isBoolean ),
                            ok      : Computed( checkAnswers )
                        }) {}