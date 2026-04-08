import "../components/InputLine";

import { defineWebComponent, HooksManager, extractElements } from "@WebCompLib"

type PipeControllerHooks = {
    xi(arg: number): void;
}

class PipeController {

    readonly hooks = new HooksManager<PipeControllerHooks>();
    // readonly state = new PipeState(this) ?

    foo() {}
}

const Pipe = defineWebComponent({
    name    : "my-pipe",
    content : "<div data-wc-id='Hello'>Hello</div>",
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    controllerProvider() {
        return new PipeController()
    },
    attachController(controller) {
        controller.foo()
        console.warn("HERE :-)", this.elements.Hello);
    },
    onXi(controller, args: number) {
        controller.foo();
        console.warn("toto", controller, args);
    }
})

// test:

const elements = extractElements(document.body, {
    "test": Pipe
})

void elements; // for debug.

//console.warn( elements.test.view.onXi(34) );
//elements.test.controller.hooks.trigger("xi", 43); // trigger type...