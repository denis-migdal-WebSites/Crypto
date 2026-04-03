import { defineWebComponent } from "@WebCompLib"

const Pipe = defineWebComponent({
    name    : "my-pipe",
    content : "<div data-wc-id='Hello'>Hello</div>",
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    // hooks
    /* onUiSetup: (ctx) => {
        //TODO: ctx...
        console.warn(ctx.elements);
    } */
    // actions (internals)

    // actions (externals)
})