import { defineWebComponent } from "@WebCompLib";
import IndexNavigatorController from "./controller";
import { RefreshRules } from "@/WebComp/src/utils/FrameScheduler/UI/RefreshRules";

export default defineWebComponent(
    IndexNavigatorController,
    {
        name    : "index-navigator",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            count  : HTMLElement,
            prev   : HTMLElement,
            next   : HTMLElement,
            current: HTMLElement,
        },
        attachController: (ctx, controller, ui) => {

            const countlen = `${controller.properties.count}`.length;
            ctx.elements.current.style.setProperty("--len", `${countlen}`);

            const rules = new RefreshRules(controller, ui);

            ctx.elements.prev.addEventListener("click", () => {
                controller.gotoPrev();
            });

            ctx.elements.next.addEventListener("click", () => {
                controller.gotoNext();
            });

            rules.whenPropertyChanged("count", () => {
                ctx.elements.count.textContent = `${controller.properties.count}`;
            });
            rules.whenPropertyChanged("current", () => {
                ctx.elements.current.textContent = `${controller.properties.current}`;
            });
/*
            const answerLen = setupAnswerLen(ctx.target, controller);
            setupFields(ctx.elements.grid, controller, answerLen);

            // =========

            rules.whenPropertiesChanged(["ok"], () => {
                ctx.target.classList.toggle("ok", controller.properties.ok)
            });*/
        }
    });