import html from "../../WebComp/src/View/ShadowTemplate/parsers/html";
import MappedInputGridController from "./controller";

export function setupAnswerLen( target: HTMLElement,
                            controller: MappedInputGridController,) {

    let size = 1;

    const labels   = controller.properties.labels;
    for( let i = 0; i < labels.length; ++i) {
        const lab_len = labels[i].length;
        if( lab_len > size)
            size = lab_len;
    }

    const expected = controller.properties.expected;
    for( let i = 0; i < expected.length; ++i) {
        const exp_len = expected[i].length;

        if( exp_len > size)
            size = exp_len;
    }

    target.style.setProperty("--size", `${size}`);

    return size;
}

function printable(char: string) {
    if( char === "\n")
        return "↵";
    return char;
}

export function setupFields(      grid: HTMLElement,
                            controller: MappedInputGridController,
                             answerLen: number) {

    const labels   = controller.properties.labels;
    const inputs   = createInputs(labels.length, controller, answerLen);

    const elements = new Array<HTMLElement>(labels.length);

    for(let i = 0; i < labels.length; ++i) {
        const element = elements[i] = document.createElement("span");
        const label = html`<span>${printable(labels[i].toUpperCase())}</span>`;
        element.append(label, inputs[i]);
    }

    grid.replaceChildren(...elements);
}

export function createInputs(
                                nbInputs  : number,
                                controller: MappedInputGridController,
                                answerLen : number,
                            ) {

    const isRO     = controller.properties.ro;

    const inputs   = new Array<HTMLInputElement>(nbInputs);
    const expected = controller.properties.expected;

    for(let i = 0; i < nbInputs; ++i) {

        const input = inputs[i] = html<HTMLInputElement>`<input placeholder="?" maxlength=${answerLen} />`;

        if( isRO ) {
            input.readOnly = true;

            if( expected[i] !== undefined)
                input.value = printable(expected[i]);
        }

        if( ! isRO ) {

            input.addEventListener("keypress", (ev) => {
                if( ev.key !== "Enter")
                    return;

                ev.preventDefault();
                input.value = "↵";
                input.dispatchEvent( new Event("input") );
            })
        }

        input.addEventListener("focus", () => {
            input.setSelectionRange(0, input.value.length);
        });

        input.addEventListener("input", () => {

            controller.properties.answers = inputs.map( e => {
                return e.value.toUpperCase();
            });

            if( input.value.length >= answerLen) {

                const nextParent = input.parentElement!.nextElementSibling;
                if( nextParent === null ) {
                    input.blur();
                    return;
                }
                const nextElement = nextParent.lastElementChild as HTMLInputElement;
                
                nextElement.focus();
            }
        });
    }

    return inputs;
}