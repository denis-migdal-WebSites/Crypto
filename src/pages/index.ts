import extractElements from "../../libs/WebComp/src/extractElements";
import "../components/InputLine";

import { defineWebComponent, HooksManager } from "@WebCompLib"

type PipeControllerHooks = {
    xi(arg: number): void;
}

//TODO: ctrler with state...
class PipeController {

    readonly hooks = new HooksManager<PipeControllerHooks>();
    // readonly state = new PipeState(this) ?
}

const Pipe = defineWebComponent({
    name    : "my-pipe",
    content : "<div data-wc-id='Hello'>Hello</div>",
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    controller: PipeController,
    onXi(controller, args: number) {
        // TODO: give to controller + fix types...
        console.warn("toto", controller, args);
    },
    uiActions: { //TODO: rename + move...
        // setupControllerBindings()
        initializeBindings() { // ctrl connu seulement ici...
            console.warn("HERE ;)", this.elements.Hello);
        }
        //TODO: render()
    },
})

const elements = extractElements(document.body, {
    "test": Pipe
})

// @ts-ignore
//console.warn( elements.test.view.onXi(34) );
elements.test.controller.hooks.trigger("xi", 43); // trigger type...