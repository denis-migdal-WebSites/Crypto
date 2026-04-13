import { defineWebComponent, WithHooks } from "@WebCompLib"
import html from "../../WebComp/src/View/ShadowTemplate/parsers/html";
import { descriptors } from "../../WebComp/src/View/dataDesc";
import { HooksProvider } from "../../WebComp/src/utils/Hooks";

type MIGCHooks = {
    verified?: (ok: boolean) => void
};

class MappedInputGridController extends WithHooks<MIGCHooks> {

    labels  : readonly string[];
    expected: readonly string[];

    constructor(args: {
        hooksProvider: HooksProvider<MIGCHooks>
        data: {
            labels  : readonly string[],
            expected: readonly string[],
        }
    }) {
        super(args);

        this.labels   = args.data.labels  .map( e => e.toUpperCase());
        this.expected = args.data.expected.map( e => e.toUpperCase());
    }

    onInputsChanged(values: readonly string[]) {
        this.callHook("verified", this.verify(values));
    }

    verify(values: readonly string[]) {
        return this.expected.every( (_,i) => this.expected[i] === values[i] )
    }
}

const MappedInputGrid = defineWebComponent(
    MappedInputGridController,
    {
        name    : "mapped-inputgrid",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            grid: HTMLElement,
        },
        data: {
            labels  : descriptors.StringArray([]),
            expected: descriptors.StringArray([]),
            ro      : descriptors.Boolean    (false),
        },
        attachController(ctx, controller) {

            const invite = controller.labels;

            let size = 1;
            for( let i = 0; i < invite.length; ++i) {
                const exp_len = controller.expected[i].length;
                const lab_len = controller.labels  [i].length;

                if( exp_len > size) size = exp_len;
                if( lab_len > size) size = lab_len;
            }

            ctx.target.style.setProperty("--size", `${size}`);

            const elements = new Array<HTMLElement>(invite.length);
            const inputs   = new Array<HTMLInputElement>(invite.length);

            for(let i = 0; i < invite.length; ++i) {

                const element = elements[i] = document.createElement("span");

                const label = html`<span>${invite[i]}</span>`;
                const input = inputs[i] = html<HTMLInputElement>`<input maxlength=${size} />`;

                if( ctx.data.ro ) {
                    input.readOnly = true;
                    input.value    = controller.expected[i];
                }

                input.addEventListener("focus", () => {
                    input.setSelectionRange(0, input.value.length);
                });

                input.addEventListener("input", () => {

                    controller.onInputsChanged(inputs.map( e => {
                        return e.value.toUpperCase();
                    }));

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
        onVerified(ctx, ok) {
            ctx.target.classList.toggle("ok", ok);
        }
    })

export default MappedInputGrid;