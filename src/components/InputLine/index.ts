import { defineWebComponent } from "@WebCompLib"


const InputLine = "";
defineWebComponent(
    null,
    {
        name    : "input-line",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            //Hello: HTMLDivElement
        },
    })

export default InputLine;