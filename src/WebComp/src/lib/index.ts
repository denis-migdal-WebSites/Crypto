export {HooksManager}    from "../Hooks";
export {default as extractElements} from "../View/extractElements";

import createViewClass, {type ViewFactoryArgs} from "../View/createViewClass";

// ================== Low level (definitions)
import { HooksManager, type Hooks} from "../Hooks";

export interface Controller<T extends Hooks> {
    readonly hooks: HooksManager<T>;
}

import {type ViewCtx, type Elems} from "../View/types";

export type ViewCstr<
                        ELEMS      extends Elems,
                        CONTROLLER extends Controller<any>|null
                    > = {

    //TODO: IView not ViewCtx
    new(target: HTMLElement, controller: CONTROLLER): ViewCtx<ELEMS>

    readonly getDefaultController: (target: HTMLElement) => CONTROLLER
};

// ================== Middle level (configurable)

export function createWebComponent<
                        ELEMS      extends Elems,
                        CONTROLLER extends Controller<any>|null
                    >(
                        View: ViewCstr<ELEMS, CONTROLLER>
                        // could give default controllerFactory here...
                    ) {
    return class WebComponent extends HTMLElement {
        readonly controller = View.getDefaultController(this);
        readonly view       = new View(this, this.controller);
    }
}

// ================== (High level)

type WebCompArgs<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            > = {
                name       : string,
            } & ViewFactoryArgs<ELEMS, CONTROLLER>;

export function defineWebComponent<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            >(
                args: WebCompArgs<ELEMS, CONTROLLER>
            ) {

    const View = createViewClass( args );

    const WebComponent = createWebComponent(View);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}