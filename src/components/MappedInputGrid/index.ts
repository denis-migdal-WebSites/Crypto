import { defineWebComponent } from "@WebCompLib"
import html from "../../WebComp/src/View/ShadowTemplate/parsers/html";
import { onPropertiesChange } from "../../WebComp/src/utils/Properties/PropertiesListeners";
import MappedInputGridController from "./controller";

export default defineWebComponent(
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

            const labels   = controller.properties.labels;
            const expected = controller.properties.expected;
            const isRO     = controller.properties.ro;

            onPropertiesChange( controller.properties, () => {
                ctx.target.classList.toggle("ok", controller.properties.ok);
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

                    controller.properties.answers = inputs.map( e => {
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
    });