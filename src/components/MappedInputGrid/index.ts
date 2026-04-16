import { defineWebComponent } from "@WebCompLib"
import MappedInputGridController from "./controller";
import { setupAnswerLen, setupFields } from "./setup";
import RefreshWhenPropertiesChanged from "../../WebComp/src/View/UI/WhenPropertiesChanged";
import Setup from "../../WebComp/src/View/UI/Setup";

export default defineWebComponent(
    MappedInputGridController,
    {
        name    : "mapped-inputgrid",
        template: {
            content : __LOAD_FILE__("./index.html"),
            style   : __LOAD_FILE__("./index.css"),
        },
        elements: {
            grid: HTMLElement,
        },
        ui: {
            pre: Setup( (ctx, controller) => {
                const answerLen = setupAnswerLen(ctx.target, controller);
                setupFields(ctx.elements.grid, controller, answerLen);
            }),
            ok : RefreshWhenPropertiesChanged(["ok"], (ctx, ctrler) => {
                    ctx.target.classList.toggle("ok", ctrler.properties.ok)
                }),
        },
    });