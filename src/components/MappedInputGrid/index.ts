import { defineWebComponent } from "@WebCompLib"
import MappedInputGridController from "./controller";
import { setupAnswerLen, setupFields } from "./setup";
import { RefreshRules } from "../../WebComp/src/utils/FrameScheduler/UI/RefreshRules";

export default defineWebComponent(
    MappedInputGridController,
    {
        name    : "mapped-inputgrid",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            grid: HTMLElement,
        },
        attachController: (ctx, controller, ui) => {

            const answerLen = setupAnswerLen(ctx.target, controller);
            setupFields(ctx.elements.grid, controller, answerLen);

            // =========
            const rules = new RefreshRules(controller, ui);

            rules.whenPropertiesChanged(["ok"], () => {
                ctx.target.classList.toggle("ok", controller.properties.ok)
            });
        }
    });