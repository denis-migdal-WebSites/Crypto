import "../components/InputLine";

import { defineWebComponent, extractElements } from "@WebCompLib"

//TODO...
import { HookCaller, HooksProvider } from "../WebComp/src/Hooks2";

type PipeControllerHooks = {
    xi(arg: number): void;
}

class PipeController {

    readonly callHook: HookCaller<PipeControllerHooks>;
    
    constructor(args: {hooksProvider: HooksProvider<PipeController>}) {
        this.callHook = args.hooksProvider(this);
    }
    // readonly state = new PipeState(this) ?

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
        onXi(_ctx, args: number) {
            console.warn("toto", args);
        }
    })

// test:

const elements = extractElements(document.body, {
    "test": Pipe
})

//void elements; // for debug.
elements.test.controller.callHook("xi", 34);