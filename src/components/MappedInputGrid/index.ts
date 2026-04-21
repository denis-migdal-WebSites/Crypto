import { defineWebComponent } from "@WebCompLib"
import MappedInputGridController from "./controller";
import { setupAnswerLen, setupFields } from "./setup";
import { RefreshRules } from "../../WebComp/src/utils/FrameScheduler/UI/RefreshRules";
import { printable } from "@/core/toCharArray";

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

            rules.whenPropertyChanged("ok", () => {
                ctx.target.classList.toggle("ok", controller.properties.ok)
            });

            if( controller.properties.ro ) {
                rules.whenPropertyChanged("expected", () => {
                    const expected = controller.properties.expected;
                    const inputs = ctx.elements.grid.querySelectorAll<HTMLInputElement>("input");

                    for(let i = 0; i < expected.length; ++i)
                        inputs[i].value = printable(expected[i]);
                });
            }
        }
    });