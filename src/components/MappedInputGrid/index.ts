import { defineWebComponent } from "@WebCompLib"
import MappedInputGridController from "./controller";
import { setupAnswerLen, setupFields } from "./setup";
import { NO_VALUE } from "../../WebComp/src/utils/NullObjects";

export default defineWebComponent(
    MappedInputGridController,
    {
        name    : "mapped-inputgrid",
        content : __LOAD_FILE__("./index.html"),
        style   : __LOAD_FILE__("./index.css"),
        elements: {
            grid: HTMLElement,
        },
        attachController: (ctx, controller, registerRefreshHook) => {

            // setup...
            const answerLen = setupAnswerLen(ctx.target, controller);
            setupFields(ctx.elements.grid, controller, answerLen);

            const propsRules = createPropertiesRules(controller.properties);
            registerRefreshHook(propsRules);

            propsRules.whenChanged(["ok"], () => {
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

type PropertiesRules<T> = (() => void) & {
    whenChanged: <K extends Extract<keyof T, string>>(keys: K[], callback: () => void) => void;
}

function createPropertiesRules<T extends Record<string, any>>(properties: T)
                                                        : PropertiesRules<T> {

    const callbacks = new Array<() => void>();
    
    const evaluate: PropertiesRules<T> = function() {
        for(let i = 0; i < callbacks.length; ++i)
            callbacks[i]();
    }

    evaluate.whenChanged = function(keys, callback) {

        const detectChange = propertiesChangeDetector(properties, ...keys);

        callbacks.push(() => {
                if( detectChange() )
                    callback();
            });
    }

    return evaluate;
}