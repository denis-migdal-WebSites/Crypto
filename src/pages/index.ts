import { defineWebComponent } from "@WebCompLib"

const Pipe = defineWebComponent({
    name    : "my-pipe",
    content : "<div data-wc-id='Hello'>Hello</div>",
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    // super possible => Object.setPrototypeOf(child, parent);
    uiActions: {
        initializeBindings() {
            console.warn("HERE ;)", this.elements.Hello);
        }
    },
    // handlers
    // api (+ redirect UIActions)
})