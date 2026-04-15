import { defineWebComponent } from "@WebCompLib"
import html from "../../WebComp/src/View/ShadowTemplate/parsers/html";
import createPropertiesFactory from "../../WebComp/src/utils/Properties/createPropertiesFactory";
import Value from "../../WebComp/src/utils/Properties/PropertyTypes/Value";
import { Validated } from "../../WebComp/src/utils/Properties/Validation";
import { isString, isBoolean, isArrayOf } from "../../WebComp/src/utils/Properties/Validation/types";
import Computed from "../../WebComp/src/utils/Properties/PropertyTypes/Computed";
import { onPropertiesChange } from "../../WebComp/src/utils/Properties/PropertiesListeners";

function checkAnswers(ctx: {
                                expected: readonly string[],
                                answers: readonly string[]
                            }) {

    return ctx.expected.every( (_,i) => ctx.expected[i].toUpperCase() === ctx.answers[i].toUpperCase() );
    
}

const StringArray = Validated( Value([] as readonly string[]), isArrayOf(isString) );

const createMIGCData = createPropertiesFactory({
    labels  : StringArray,
    answers : StringArray,
    expected: StringArray,
    ro      : Validated( Value(false), isBoolean ),
    ok      : Computed( checkAnswers )
});

class MappedInputGridController /*extends WithHooks<MIGCHooks>*/ {

    readonly data: ReturnType<typeof createMIGCData>;

    constructor(args: {
        /*hooksProvider: HooksProvider<MIGCHooks>*/
        data: {
            labels  : readonly string[],
            expected: readonly string[],
            ro     ?: boolean
        }
    }) {
        this.data = createMIGCData(args.data);
    }
}

defineWebComponent(null, {
    name: "e-e",
});

const MappedInputGrid = defineWebComponent(
    MappedInputGridController,
    {
        name    : "mapped-inputgrid",
        template: {
            content : __LOAD_FILE__("./index.html"),
            style   : __LOAD_FILE__("./index.css"),
        },
        elements: {
            grid: HTMLElement,
        },
        attachController(ctx, controller) {

            const labels   = controller.data.labels;
            const expected = controller.data.expected;
            const isRO     = controller.data.ro;

            onPropertiesChange( controller.data, () => {
                ctx.target.classList.toggle("ok", controller.data.ok);
            });

            let size = 1;
            for( let i = 0; i < labels.length; ++i) {
                const exp_len = expected[i].length;
                const lab_len = labels  [i].length;

                if( exp_len > size) size = exp_len;
                if( lab_len > size) size = lab_len;
            }

            ctx.target.style.setProperty("--size", `${size}`);

            const elements = new Array<HTMLElement>(labels.length);
            const inputs   = new Array<HTMLInputElement>(labels.length);

            for(let i = 0; i < labels.length; ++i) {

                const element = elements[i] = document.createElement("span");

                const label = html`<span>${labels[i].toUpperCase()}</span>`;
                const input = inputs[i] = html<HTMLInputElement>`<input maxlength=${size} />`;

                if( isRO ) {
                    input.readOnly = true;
                    input.value    = expected[i];
                }

                input.addEventListener("focus", () => {
                    input.setSelectionRange(0, input.value.length);
                });

                input.addEventListener("input", () => {

                    controller.data.answers = inputs.map( e => {
                        return e.value.toUpperCase();
                    });

                    if( input.value.length >= size) {

                        const nextParent = input.parentElement!.nextElementSibling;
                        if( nextParent === null ) {
                            input.blur();
                            return;
                        }
                        const nextElement = nextParent.lastElementChild as HTMLInputElement;
                        
                        nextElement.focus();
                    }
                });

                element.append(label, input);
            }

            ctx.elements.grid.replaceChildren(...elements);
        },
    })

export default MappedInputGrid;