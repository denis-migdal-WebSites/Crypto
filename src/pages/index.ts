import "../components/InputLine";

import { defineWebComponent, extractElements, WithHooks } from "@WebCompLib"

type PipeControllerHooks = {
    xi(arg: number): number;
}

class PipeController extends WithHooks<PipeControllerHooks> {
    foo() {}
}

const Pipe = defineWebComponent(
    PipeController,
    {
        name    : "my-pipe",
        content : "<div data-wc-id='Hello'>Hello</div>",
        style   : "div { background-color: red; }",
        elements: {
            Hello: HTMLDivElement
        },
        attachController(ctx, controller) {
            controller.foo()
            console.warn("HERE :-)", ctx.elements.Hello);
        },
        onXi(_ctx, args) {
            console.warn("toto", args);
            return 2;
        }
    })
// test:

const elements = extractElements(document.body, {
    "test": Pipe
})

//void elements; // for debug.
elements.test.controller.callHook("xi", 34);