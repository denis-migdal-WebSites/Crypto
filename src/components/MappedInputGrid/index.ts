import { defineWebComponent } from "@WebCompLib"
import MappedInputGridController from "./controller";
import { setupAnswerLen, setupFields } from "./setup";
import { NO_VALUE } from "../../WebComp/src/utils/NullObjects";
import { UI } from "../../WebComp/src/View/createViewFactory";
import { onPropertiesChange } from "../../WebComp/src/utils/Properties/PropertiesListeners";

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

            /* 
                ui.addParts(
                    okX -> XXX (?).
                
                )

                parts: { (for re-use ?) ~> type deduction dangerous...
                "ok": adapt(ok, {key: target}) (?).
                    // () => setup()
                    //  - from : attachController() + refresh()...
                    //  -> attach to registerRefreshHook ?
            } */

            // setup...
            // answerLen.setup(ctx.target, controller) [?].
            // fields   .setup(...)
            const answerLen = setupAnswerLen(ctx.target, controller);
            setupFields(ctx.elements.grid, controller, answerLen);

            const rules = new RefreshRules(controller, ui);

            rules.whenPropertiesChanged(["ok"], () => {
                ctx.target.classList.toggle("ok", controller.properties.ok)
            });
        }
    });

//TODO: move

function propertiesChangeDetector<T extends Record<string, any>>(
                                        target: T,
                                        ...keys: Extract<keyof T, string>[]
                                    ) {

    const prev_values = new Array(keys.length);
    prev_values.fill(NO_VALUE);

    return () => {
        for(let i = 0; i < keys.length; ++i) {
                const value = target[keys[i]];
                if( value !== prev_values[i] ) {
                    prev_values[i] = value;
                    return true;
                }
            }

            return false;
    }
}

class RefreshRules<C extends {properties: T}, T extends Record<string, any>> {

    readonly controller: C;
    readonly ui        : UI;

    readonly callback  = () => this.evaluate();
    readonly callbacks = new Array<() => void>();

    isListeningProperties = false;

    evaluate() {
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i]();
    }

    constructor(controller: C, ui: UI) {
        this.controller = controller;
        this.ui         = ui;

        ui.addToRefresh( this.callback );
    }

    whenPropertiesChanged(keys   : readonly (Extract<keyof T, string>)[],
                         callback: () => void) {

        if( ! this.isListeningProperties ) {
            onPropertiesChange( this.controller.properties as any, //TODO...
                                this.ui.requestRefresh )
            this.isListeningProperties = true;
        }

        const detectChange = propertiesChangeDetector(
                                        this.controller.properties,
                                        ...keys);

        this.callbacks.push(() => {
            if( detectChange() )
                callback();
        });
    }
}