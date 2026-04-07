export {HooksManager}    from "../Hooks";
export {default as extractElements} from "../View/extractElements";

import createViewClass, {ViewMethods, type ViewFactoryArgs} from "../View/createViewClass";

// ================== Low level (definitions)
import { HooksManager, setHandlers, type Hooks} from "../Hooks";

export interface Controller<T extends Hooks> {
    readonly hooks: HooksManager<T>;
}

import {type ViewCtx, type Elems} from "../View/types";

export type ViewCstr<ELEMS extends Elems> = {
    new(target: HTMLElement): ViewCtx<ELEMS>
};

// ================== Middle level (configurable)

import style    from "../View/ShadowTemplate/parsers/style";
import template from "../View/ShadowTemplate/parsers/template";

// ==================

//TODO: view type...
function instantiateController(view: any) {

    if( ! ("createDefaultController" in view) )
        return null;

    const controller = view.createDefaultController();
    setHandlers(controller, view);

    if( "attachController" in view)
        view.attachController(controller);

    return controller;
}

export function createWebComponent<
                        ELEMS extends Elems
                    >(
                        View      : ViewCstr<ELEMS>
                    ) {
    return class WebComponent extends HTMLElement {
        readonly view       = new View(this);
        readonly controller = instantiateController(this.view);
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