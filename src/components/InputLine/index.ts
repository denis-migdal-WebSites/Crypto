import { defineWebComponent } from "@WebCompLib"

const InputLine = defineWebComponent({
    name    : "input-line",
    content : __LOAD_FILE__("./index.html"),
    style   : "div { background-color: red; }",
    elements: {
        Hello: HTMLDivElement
    },
    // handlers
    // api (+ redirect UIActions)
})

export default InputLine;