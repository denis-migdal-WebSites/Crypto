import { defineWebComponent } from "@WebCompLib"

const Pipe = defineWebComponent({
    name    : "my-pipe",
    content : "<div data-wc-id='Hello'>Hello</div>",
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    // hooks
    onSetupUI: (ctx) => {
        ctx; //TODO: additional props...
    }
    //TODO: onRenderUI

    // actions (internals)

    // actions (externals)
})