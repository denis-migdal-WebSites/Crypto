export {HooksManager}    from "../Hooks";
export {default as extractElements} from "../View/extractElements";

import createViewClass, {ViewMethods, type ViewFactoryArgs} from "../View/createViewClass";

// ================== Low level (definitions)
import { HooksManager, setHandlers, isHandlerName, type Hooks, type GetHandlers} from "../Hooks";

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

import { AsMethods } from "../installMethods";

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

type AcceptString<T extends Record<string, any>, F extends keyof T> = {
    [K in keyof T]: K extends F ? T[K] | string : T[K];
};

type ViewFactoryArgsRaw<
                        ELEMS      extends Elems,
                        CONTROLLER extends Controller<any>|null = null
                    >
    = AcceptString<ViewFactoryArgs<ELEMS, CONTROLLER>, "content"|"style">;

type GetHandlersFrom<CONTROLLER extends Controller<any>|null>
    = CONTROLLER extends null
                ? {}
                : GetHandlers<Exclude<CONTROLLER, null>>;

type WebCompArgs<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            > = {
    name       : string,
} & ViewFactoryArgsRaw<ELEMS, CONTROLLER>
  & {
    attachController?: (this: ViewCtx<ELEMS>,
                        controller: Omit<NoInfer<CONTROLLER>, "hooks">) => void,
  }
  & AsMethods<ViewCtx<ELEMS>, GetHandlersFrom<NoInfer<CONTROLLER>>>
;

function parseViewArgs<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            >(
                args: ViewFactoryArgsRaw<ELEMS, CONTROLLER>
            ) : ViewFactoryArgs<ELEMS, CONTROLLER> {

    args = {...args}; // will be modified.

    if( typeof args.content === "string") {
        const content = template(args.content); 
        args.content = () => content.cloneNode(true);
    }

    if( typeof args.style   === "string")
        args.style   = style   (args.style);

    return args as ViewFactoryArgs<ELEMS, CONTROLLER>;
}

export function defineWebComponent<
                ELEMS      extends Elems,
                METHODS    extends ViewMethods<ELEMS, CONTROLLER>,
                CONTROLLER extends Controller<any>|null = null
            >(
                args: WebCompArgs<ELEMS, CONTROLLER>
            ) {

    const View = createViewClass( parseViewArgs(args) );

    const WebComponent = createWebComponent(View);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}