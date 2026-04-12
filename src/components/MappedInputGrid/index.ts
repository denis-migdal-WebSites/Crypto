import { defineWebComponent, WithHooks } from "@WebCompLib"
import html from "../../WebComp/src/View/ShadowTemplate/parsers/html";

class MappedInputGridController extends WithHooks<{
            verified?: (ok: boolean) => void
        }> {

    invite  : readonly string[] = ["H", "E", "L", "L", "O"];
    expected: readonly string[] = ["H", "E", "L", "L", "O"];

    size = 1;

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
        name    : "mapped-inputline",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            labels: HTMLElement,
            inputs: HTMLElement,
        },
        attachController(ctx, controller) {
            
            const invite = controller.invite;
            const labels = new Array<HTMLElement     >(invite.length);
            const inputs = new Array<HTMLInputElement>(invite.length);

            const size = controller.size;
            ctx.target.style.setProperty("--size", `${size}`);

            for(let i = 0; i < invite.length; ++i) {
                labels[i] = html`<span>${invite[i]}</span>`;
                inputs[i] = html<HTMLInputElement>`<input maxlength=${size} />`;

                const input = inputs[i];

                input.addEventListener("focus", () => {
                    input.setSelectionRange(0, input.value.length);
                });

                input.addEventListener("input", () => {

                    controller.onInputsChanged(inputs.map( e => {
                        return e.value.toUpperCase();
                    }));

                    if( input.value.length >= size) {
                        const nextElement = input.nextElementSibling as HTMLInputElement|null ;

                        if( nextElement === null ) {
                            input.blur();
                            return;
                        }

                        nextElement.focus();
                    }
                });
            }

            ctx.elements.labels.replaceChildren(...labels);
            ctx.elements.inputs.replaceChildren(...inputs);
        },
        onVerified(ctx, ok) {
            ctx.target.classList.toggle("ok", ok);
        }
    })

export default MappedInputGrid;